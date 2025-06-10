import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { encryptData, decryptData } from './encryption';

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
    // Destination path for the encrypted file
    const encryptedFilePath = `${ENCRYPTED_PHOTOS_DIR}${fileName}`;
    
    // Read the file as base64
    const fileContent = await FileSystem.readAsStringAsync(sourceUri, {
      encoding: FileSystem.EncodingType.Base64
    });
    
    // Encrypt the file content
    const encryptedContent = await encryptData(fileContent);
    
    // Write the encrypted content to the new file
    await FileSystem.writeAsStringAsync(encryptedFilePath, encryptedContent);
    
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
    
    // Decrypt the content
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