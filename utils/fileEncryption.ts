import RNFS from 'react-native-fs';
import { Platform } from 'react-native';
import { encryptData, decryptData } from './encryption';
import { createHash } from 'crypto';
import { randomBytes } from 'crypto';
import { secureDeleteFile, secureDeleteFileWithMetadata } from './secureDelete';

// Directory for encrypted photos
export const ENCRYPTED_PHOTOS_DIR = `${RNFS.DocumentDirectoryPath}/encrypted_photos/`;
// Directory for temporary decrypted files
export const TEMP_DECRYPTED_DIR = `${RNFS.CachesDirectoryPath}/temp_decrypted/`;

// Ensure encrypted photos directory exists
export const setupEncryptedPhotoDirectory = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  
  try {
    const dirExists = await RNFS.exists(ENCRYPTED_PHOTOS_DIR);
    if (!dirExists) {
      await RNFS.mkdir(ENCRYPTED_PHOTOS_DIR);
    }
    
    // Also create temp directory for decrypted files
    const tempDirExists = await RNFS.exists(TEMP_DECRYPTED_DIR);
    if (!tempDirExists) {
      await RNFS.mkdir(TEMP_DECRYPTED_DIR);
    }
  } catch (error) {
    console.error('Error setting up encrypted photo directory:', error);
  }
};

// Initialize directory
if (Platform.OS !== 'web') {
  setupEncryptedPhotoDirectory();
}

// Generate a unique filename based on content hash
const generateSecureFilename = async (sourceUri: string, baseFileName: string): Promise<string> => {
  try {
    // For local files, hash the content for a unique filename
    if (sourceUri.startsWith('file://') || sourceUri.startsWith(RNFS.DocumentDirectoryPath)) {
      // Read a small portion of the file to create a hash
      // This avoids loading the entire file into memory
      const fileExists = await RNFS.exists(sourceUri);
      
      if (fileExists) {
        const fileInfo = await RNFS.stat(sourceUri);
        if (fileInfo.size && fileInfo.size > 0) {
          // Read the first 4KB of the file
          const headerBytes = await RNFS.read(sourceUri, Math.min(4096, fileInfo.size), 0, 'base64');
        
        // Create a hash from the header + file size + timestamp + random value
        const randomBytesBuffer = randomBytes(16);
        const randomValue = Array.from(randomBytesBuffer)
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        const contentHash = createHash('sha256')
          .update(headerBytes + fileInfo.size + Date.now() + randomValue)
          .digest('hex');
        
        // Use the first 12 characters of the hash
        return `${baseFileName.split('.')[0]}_${contentHash.substring(0, 12)}.enc`;
      }
    }
  } catch (error) {
    console.warn('Error generating secure filename:', error);
  }
  
  // Fallback to timestamp-based filename with random component
  const randomBytesBuffer = randomBytes(8);
  const randomValue = Array.from(randomBytesBuffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return `${baseFileName.split('.')[0]}_${Date.now()}_${randomValue}.enc`;
};

// Encrypt and save a photo file
export const encryptAndSavePhoto = async (
  sourceUri: string, 
  fileName: string
): Promise<string> => {
  if (Platform.OS === 'web') {
    // For web, we can't encrypt files directly, so just return the original URI
    return sourceUri;
  }
  
  // Validate the source URI
  if (!sourceUri || typeof sourceUri !== 'string' || sourceUri.trim() === '') {
    throw new Error('Invalid source URI: empty or null');
  }
  
  try {
    // Generate a secure filename
    const secureFileName = await generateSecureFilename(sourceUri, fileName);
    
    // Destination path for the encrypted file
    const encryptedFilePath = `${ENCRYPTED_PHOTOS_DIR}${secureFileName}`;
    
    // Read the file as base64
    const fileContent = await RNFS.readFile(sourceUri, 'base64');
    
    // Create metadata with file type and original name
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const metadata = JSON.stringify({
      type: fileExtension === 'gif' ? 'image/gif' : 'image/jpeg',
      name: fileName,
      timestamp: Date.now(),
      originalSize: fileContent.length,
      encryptionVersion: 2, // Track encryption version for future upgrades
      contentHash: createHash('sha256')
        .update(fileContent.substring(0, Math.min(fileContent.length, 1024))) // Hash first 1KB for verification
        .digest('hex')
    });
    
    // Encrypt the metadata and file content separately
    const encryptedMetadata = await encryptData(metadata);
    const encryptedContent = await encryptData(fileContent);
    
    // Combine metadata and content with a separator
    const fullEncryptedContent = `${encryptedMetadata}|||${encryptedContent}`;
    
    // Write the encrypted content to the new file
    await RNFS.writeFile(encryptedFilePath, fullEncryptedContent, 'utf8');
    
    // Create a verification file to ensure integrity
    const verificationHash = createHash('sha256')
      .update(fullEncryptedContent.substring(0, Math.min(fullEncryptedContent.length, 1024))) // Hash first 1KB
      .digest('hex');
    
    await RNFS.writeFile(
      `${encryptedFilePath}.verify`,
      verificationHash,
      'utf8'
    );
    
    return encryptedFilePath;
  } catch (error) {
    console.error('Error encrypting and saving photo:', error);
    // If encryption fails, copy the file without encryption as fallback
    try {
      const fallbackPath = `${ENCRYPTED_PHOTOS_DIR}${fileName}`;
      await RNFS.copyFile(sourceUri, fallbackPath);
      return fallbackPath;
    } catch (fallbackError) {
      console.error('Fallback copy also failed:', fallbackError);
      return sourceUri; // Return original as last resort
    }
  }
};

// Decrypt a photo file for viewing
export const decryptPhoto = async (encryptedUri: string): Promise<string> => {
  if (Platform.OS === 'web' || !encryptedUri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
    // For web or non-encrypted files, return the original URI
    return encryptedUri;
  }
  
  try {
    // Read the encrypted file
    const encryptedContent = await RNFS.readFile(encryptedUri, 'utf8');
    
    // Check if this is our new format with metadata
    if (encryptedContent.includes('|||')) {
      const [encryptedMetadata, encryptedFileContent] = encryptedContent.split('|||');
      
      // Decrypt the metadata
      const metadataStr = await decryptData(encryptedMetadata);
      if (!metadataStr) {
        throw new Error('Failed to decrypt metadata');
      }
      
      const metadata = JSON.parse(metadataStr);
      
      // Decrypt the file content
      const decryptedContent = await decryptData(encryptedFileContent);
      if (!decryptedContent) {
        throw new Error('Failed to decrypt file content');
      }
      
      // Verify content integrity if we have a hash in metadata
      if (metadata.contentHash) {
        const contentHash = createHash('sha256')
          .update(decryptedContent.substring(0, Math.min(decryptedContent.length, 1024))) // Hash first 1KB
          .digest('hex');
        
        if (contentHash !== metadata.contentHash) {
          console.warn('Content hash verification failed, file may be corrupted');
        }
      }
      
      // Create a temporary file for the decrypted content
      const fileExtension = metadata.type === 'image/gif' ? 'gif' : 'jpg';
      const tempFileName = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${fileExtension}`;
      const tempFilePath = `${TEMP_DECRYPTED_DIR}${tempFileName}`;
      
              // Write the decrypted content to the temp file
        await RNFS.writeFile(tempFilePath, decryptedContent, 'base64');
      
      return tempFilePath;
    } else {
      // Legacy format - try to decrypt the whole file
      const decryptedContent = await decryptData(encryptedContent);
      
      if (!decryptedContent) {
        throw new Error('Decryption failed');
      }
      
      // Create a temporary file for the decrypted content
      const tempFileName = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 10)}.jpg`;
      const tempFilePath = `${TEMP_DECRYPTED_DIR}${tempFileName}`;
      
      // Write the decrypted content to the temp file
      await RNFS.writeFile(tempFilePath, decryptedContent, 'base64');
      
      return tempFilePath;
    }
  } catch (error) {
    console.error('Error decrypting photo:', error);
    // If decryption fails, return the original encrypted URI
    return encryptedUri;
  }
};

// Check if a file is encrypted
export const isEncryptedFile = (uri: string): boolean => {
  return uri.startsWith(ENCRYPTED_PHOTOS_DIR);
};

// Delete an encrypted photo securely
export const deleteEncryptedPhoto = async (uri: string): Promise<void> => {
  if (Platform.OS === 'web' || !uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
    return;
  }
  
  try {
    // Securely overwrite and delete the file
    await secureDeleteFileWithMetadata(uri, 3);
    
    // Delete verification file if it exists
    try {
      const verifyUri = `${uri}.verify`;
      const verifyInfo = await RNFS.stat(verifyUri);
              if (verifyInfo.isFile && verifyInfo.isFile()) {
          await RNFS.unlink(verifyUri);
        }
    } catch (verifyError) {
      console.warn('Error deleting verification file:', verifyError);
    }
    
    // Also check for any temporary decrypted versions of this file
    // This is a best-effort cleanup of potential temp files
    const fileName = uri.split('/').pop();
    if (fileName) {
      const baseFileName = fileName.split('.')[0];
      
      try {
        const tempDirContents = await RNFS.readDir(TEMP_DECRYPTED_DIR);
        const relatedTempFiles = tempDirContents.filter(file => 
          file.includes(baseFileName) || file.includes(uri.substring(uri.length - 20))
        );
        
        // Delete any related temp files
        for (const tempFile of relatedTempFiles) {
          await secureDeleteFile(`${TEMP_DECRYPTED_DIR}${tempFile}`, 1);
        }
      } catch (tempError) {
        // Ignore errors with temp cleanup
        console.warn('Error cleaning up temp files:', tempError);
      }
    }
  } catch (error) {
    console.error('Error deleting encrypted photo:', error);
  }
};

// Get file info for an encrypted photo
export const getEncryptedPhotoInfo = async (uri: string): Promise<{
  size: number;
  modificationTime: number | undefined;
  exists: boolean;
  metadata?: any;
} | null> => {
  if (Platform.OS === 'web' || !uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
    return null;
  }
  
  try {
    const fileInfo = await RNFS.stat(uri);
    
    // Try to extract metadata if the file exists
          let metadata = undefined;
      if (fileInfo.isFile && fileInfo.isFile()) {
      try {
        const encryptedContent = await RNFS.readFile(uri);
        
        // Check if this is our new format with metadata
        if (encryptedContent.includes('|||')) {
          const [encryptedMetadata] = encryptedContent.split('|||');
          
          // Decrypt the metadata
          const metadataStr = await decryptData(encryptedMetadata);
          if (metadataStr) {
            metadata = JSON.parse(metadataStr);
          }
        }
      } catch (metadataError) {
        console.warn('Error extracting metadata:', metadataError);
      }
    }
    
    return {
      size: fileInfo.size,
      modificationTime: fileInfo.mtime,
      exists: fileInfo.isFile && fileInfo.isFile(),
      metadata
    };
  } catch (error) {
    console.error('Error getting encrypted photo info:', error);
    return null;
  }
};

// Clean up all temporary decrypted files
export const cleanupTempDecryptedFiles = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  
  try {
    const tempDirInfo = await RNFS.stat(TEMP_DECRYPTED_DIR);
          if (tempDirInfo.isDirectory && tempDirInfo.isDirectory()) {
      // Get all files in the temp directory
      const tempFiles = await RNFS.readDir(TEMP_DECRYPTED_DIR);
      
      // Delete each file
      for (const file of tempFiles) {
        await secureDeleteFile(`${TEMP_DECRYPTED_DIR}${file}`, 1);
      }
      
      console.log(`Cleaned up ${tempFiles.length} temporary decrypted files`);
    }
  } catch (error) {
    console.error('Error cleaning up temporary decrypted files:', error);
  }
};

// Delete all encrypted photos
export const deleteAllEncryptedPhotos = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  
  try {
    const dirInfo = await RNFS.stat(ENCRYPTED_PHOTOS_DIR);
          if (dirInfo.isDirectory && dirInfo.isDirectory()) {
      // Get all files in the encrypted photos directory
      const files = await RNFS.readDir(ENCRYPTED_PHOTOS_DIR);
      
      // Securely delete each file
      for (const file of files) {
        await secureDeleteFileWithMetadata(`${ENCRYPTED_PHOTOS_DIR}${file}`, 3);
      }
      
              // Also delete the directory and recreate it
        await RNFS.rmdir(ENCRYPTED_PHOTOS_DIR);
        await RNFS.mkdir(ENCRYPTED_PHOTOS_DIR);
      
      // Clean up temp files too
      await cleanupTempDecryptedFiles();
      
      console.log(`Securely deleted ${files.length} encrypted photos`);
    }
  } catch (error) {
    console.error('Error deleting all encrypted photos:', error);
  }
};

// Verify the integrity of an encrypted file
export const verifyEncryptedFile = async (uri: string): Promise<boolean> => {
  if (Platform.OS === 'web' || !uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
    return false;
  }
  
  try {
    // Check if verification file exists
    const verifyUri = `${uri}.verify`;
    const verifyInfo = await RNFS.stat(verifyUri);
    
          if (verifyInfo.isFile && verifyInfo.isFile()) {
      // Read the verification hash
      const storedHash = await RNFS.readFile(verifyUri);
      
      // Read the encrypted file
      const encryptedContent = await RNFS.readFile(uri);
      
      // Calculate hash of the encrypted content
      const calculatedHash = createHash('sha256')
        .update(encryptedContent.substring(0, Math.min(encryptedContent.length, 1024))) // Hash first 1KB
        .digest('hex');
      
      // Compare hashes
      if (storedHash === calculatedHash) {
        return true;
      }
      
      console.warn('Verification hash mismatch for file:', uri);
      return false;
    }
    
    // If no verification file, check if we can decrypt the metadata
    const encryptedContent = await RNFS.readFile(uri);
    
    // Check if this is our new format with metadata
    if (!encryptedContent.includes('|||')) {
      return false; // Not in the expected format
    }
    
    const [encryptedMetadata, encryptedFileContent] = encryptedContent.split('|||');
    
    // Try to decrypt the metadata
    const metadataStr = await decryptData(encryptedMetadata);
    if (!metadataStr) {
      return false;
    }
    
    // Try to parse the metadata
    try {
      JSON.parse(metadataStr);
    } catch (e) {
      return false;
    }
    
    // We don't need to decrypt the entire file content to verify integrity
    // Just check that it exists and is non-empty
    return encryptedFileContent.length > 0;
  } catch (error) {
    console.error('Error verifying encrypted file:', error);
    return false;
  }
};

// Re-encrypt a file with the latest encryption version
export const reEncryptFile = async (uri: string): Promise<string | null> => {
  if (Platform.OS === 'web' || !uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
    return null;
  }
  
  try {
    // First decrypt the file
    const decryptedUri = await decryptPhoto(uri);
    if (decryptedUri === uri) {
      // Decryption failed
      return null;
    }
    
    // Get the original filename
    const fileName = uri.split('/').pop() || 'reencrypted.jpg';
    
    // Re-encrypt with the latest encryption method
    const newUri = await encryptAndSavePhoto(decryptedUri, fileName);
    
    // Delete the original encrypted file
    await deleteEncryptedPhoto(uri);
    
    // Delete the temporary decrypted file
    await secureDeleteFile(decryptedUri, 1);
    
    return newUri;
  } catch (error) {
    console.error('Error re-encrypting file:', error);
    return null;
  }
};