import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { encryptData, decryptData } from './encryption';
import * as Crypto from 'expo-crypto';

// Directory for encrypted photos
export const ENCRYPTED_PHOTOS_DIR = `${FileSystem.documentDirectory}encrypted_photos/`;

// Ensure encrypted photos directory exists
export const setupEncryptedPhotoDirectory = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  
  try {
    const dirInfo = await FileSystem.getInfoAsync(ENCRYPTED_PHOTOS_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(ENCRYPTED_PHOTOS_DIR, { intermediates: true });
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
    if (sourceUri.startsWith('file://') || sourceUri.startsWith(FileSystem.documentDirectory)) {
      // Read a small portion of the file to create a hash
      // This avoids loading the entire file into memory
      const fileInfo = await FileSystem.getInfoAsync(sourceUri);
      
      if (fileInfo.exists && fileInfo.size > 0) {
        // Read the first 4KB of the file
        const headerBytes = await FileSystem.readAsStringAsync(sourceUri, {
          encoding: FileSystem.EncodingType.Base64,
          position: 0,
          length: Math.min(4096, fileInfo.size)
        });
        
        // Create a hash from the header + file size + timestamp
        const contentHash = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          headerBytes + fileInfo.size + Date.now()
        );
        
        // Use the first 12 characters of the hash
        return `${baseFileName.split('.')[0]}_${contentHash.substring(0, 12)}.enc`;
      }
    }
  } catch (error) {
    console.warn('Error generating secure filename:', error);
  }
  
  // Fallback to timestamp-based filename
  return `${baseFileName.split('.')[0]}_${Date.now()}.enc`;
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
  
  try {
    // Generate a secure filename
    const secureFileName = await generateSecureFilename(sourceUri, fileName);
    
    // Destination path for the encrypted file
    const encryptedFilePath = `${ENCRYPTED_PHOTOS_DIR}${secureFileName}`;
    
    // Read the file as base64
    const fileContent = await FileSystem.readAsStringAsync(sourceUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    // Create metadata with file type and original name
    const fileExtension = fileName.split('.').pop()?.toLowerCase() || 'jpg';
    const metadata = JSON.stringify({
      type: fileExtension === 'gif' ? 'image/gif' : 'image/jpeg',
      name: fileName,
      timestamp: Date.now()
    });
    
    // Encrypt the metadata and file content separately
    const encryptedMetadata = await encryptData(metadata);
    const encryptedContent = await encryptData(fileContent);
    
    // Combine metadata and content with a separator
    const fullEncryptedContent = `${encryptedMetadata}|||${encryptedContent}`;
    
    // Write the encrypted content to the new file
    await FileSystem.writeAsStringAsync(encryptedFilePath, fullEncryptedContent);
    
    return encryptedFilePath;
  } catch (error) {
    console.error('Error encrypting and saving photo:', error);
    // If encryption fails, copy the file without encryption as fallback
    try {
      const fallbackPath = `${ENCRYPTED_PHOTOS_DIR}${fileName}`;
      await FileSystem.copyAsync({
        from: sourceUri,
        to: fallbackPath
      });
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
    const encryptedContent = await FileSystem.readAsStringAsync(encryptedUri);
    
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
      
      // Create a temporary file for the decrypted content
      const fileExtension = metadata.type === 'image/gif' ? 'gif' : 'jpg';
      const tempFilePath = `${FileSystem.cacheDirectory}temp_${Date.now()}.${fileExtension}`;
      
      // Write the decrypted content to the temp file
      await FileSystem.writeAsStringAsync(tempFilePath, decryptedContent, {
        encoding: FileSystem.EncodingType.Base64
      });
      
      return tempFilePath;
    } else {
      // Legacy format - try to decrypt the whole file
      const decryptedContent = await decryptData(encryptedContent);
      
      if (!decryptedContent) {
        throw new Error('Decryption failed');
      }
      
      // Create a temporary file for the decrypted content
      const tempFilePath = `${FileSystem.cacheDirectory}temp_${Date.now()}.jpg`;
      
      // Write the decrypted content to the temp file
      await FileSystem.writeAsStringAsync(tempFilePath, decryptedContent, {
        encoding: FileSystem.EncodingType.Base64
      });
      
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

// Delete an encrypted photo
export const deleteEncryptedPhoto = async (uri: string): Promise<void> => {
  if (Platform.OS === 'web' || !uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
    return;
  }
  
  try {
    await FileSystem.deleteAsync(uri);
  } catch (error) {
    console.error('Error deleting encrypted photo:', error);
  }
};

// Get file info for an encrypted photo
export const getEncryptedPhotoInfo = async (uri: string): Promise<{
  size: number;
  modificationTime: number | undefined;
  exists: boolean;
} | null> => {
  if (Platform.OS === 'web' || !uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
    return null;
  }
  
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    return {
      size: fileInfo.size,
      modificationTime: fileInfo.modificationTime,
      exists: fileInfo.exists
    };
  } catch (error) {
    console.error('Error getting encrypted photo info:', error);
    return null;
  }
};