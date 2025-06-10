import * as FileSystem from 'expo-file-system';
import * as Random from 'expo-random';
import { Platform } from 'react-native';

/**
 * Securely delete a file by overwriting it with random data before deletion
 * This makes recovery of the file contents much more difficult
 * 
 * @param uri The file URI to securely delete
 * @param passes Number of overwrite passes (default: 3)
 * @returns Promise resolving when deletion is complete
 */
export const secureDeleteFile = async (uri: string, passes: number = 3): Promise<void> => {
  if (Platform.OS === 'web' || !uri) return;
  
  try {
    const fileInfo = await FileSystem.getInfoAsync(uri);
    if (!fileInfo.exists) return;
    
    // Get file size for overwriting
    const fileSize = fileInfo.size;
    if (fileSize <= 0) {
      // If file is empty, just delete it
      await FileSystem.deleteAsync(uri, { idempotent: true });
      return;
    }
    
    // Limit size for overwriting to prevent memory issues with very large files
    // For large files, we'll overwrite the first and last portions
    const maxOverwriteSize = Math.min(fileSize, 1024 * 1024); // 1MB max
    
    for (let pass = 0; pass < passes; pass++) {
      // For each pass, use a different pattern
      let overwriteData: string;
      
      if (pass === 0) {
        // First pass: random data
        const randomBytes = await Random.getRandomBytesAsync(maxOverwriteSize);
        overwriteData = Array.from(randomBytes)
          .map(byte => String.fromCharCode(byte))
          .join('');
      } else if (pass === passes - 1) {
        // Last pass: all zeros
        overwriteData = '\0'.repeat(maxOverwriteSize);
      } else {
        // Middle passes: alternating patterns
        overwriteData = (pass % 2 === 0) 
          ? '\xFF'.repeat(maxOverwriteSize) 
          : '\xAA'.repeat(maxOverwriteSize);
      }
      
      // Overwrite the file
      await FileSystem.writeAsStringAsync(uri, overwriteData);
      
      // If file is larger than our max overwrite size, also overwrite the end of the file
      if (fileSize > maxOverwriteSize) {
        try {
          await FileSystem.writeAsStringAsync(uri, overwriteData, {
            encoding: FileSystem.EncodingType.UTF8,
            position: fileSize - maxOverwriteSize
          });
        } catch (positionError) {
          // Some file systems may not support position parameter
          console.warn('Could not overwrite end of file:', positionError);
        }
      }
    }
    
    // Finally delete the file
    await FileSystem.deleteAsync(uri, { idempotent: true });
    
  } catch (error) {
    console.error('Error securely deleting file:', error);
    // If secure deletion fails, try regular deletion as fallback
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch (deleteError) {
      console.error('Regular deletion also failed:', deleteError);
      throw new Error('Could not delete file: ' + deleteError);
    }
  }
};

/**
 * Securely delete a directory and all its contents
 * 
 * @param dirUri The directory URI to securely delete
 * @param passes Number of overwrite passes (default: 3)
 * @returns Promise resolving when deletion is complete
 */
export const secureDeleteDirectory = async (dirUri: string, passes: number = 3): Promise<void> => {
  if (Platform.OS === 'web' || !dirUri) return;
  
  try {
    const dirInfo = await FileSystem.getInfoAsync(dirUri);
    if (!dirInfo.exists || !dirInfo.isDirectory) return;
    
    // Get all files in the directory
    const contents = await FileSystem.readDirectoryAsync(dirUri);
    
    // Process each item in the directory
    for (const item of contents) {
      const itemUri = `${dirUri}${dirUri.endsWith('/') ? '' : '/'}${item}`;
      const itemInfo = await FileSystem.getInfoAsync(itemUri);
      
      if (itemInfo.isDirectory) {
        // Recursively delete subdirectories
        await secureDeleteDirectory(itemUri, passes);
      } else {
        // Securely delete files
        await secureDeleteFile(itemUri, passes);
      }
    }
    
    // Delete the now-empty directory
    await FileSystem.deleteAsync(dirUri, { idempotent: true });
    
  } catch (error) {
    console.error('Error securely deleting directory:', error);
    // If secure deletion fails, try regular deletion as fallback
    try {
      await FileSystem.deleteAsync(dirUri, { idempotent: true });
    } catch (deleteError) {
      console.error('Regular directory deletion also failed:', deleteError);
      throw new Error('Could not delete directory: ' + deleteError);
    }
  }
};

/**
 * Clean up temporary files in the cache directory
 * 
 * @returns Promise resolving when cleanup is complete
 */
export const cleanupTemporaryFiles = async (): Promise<void> => {
  if (Platform.OS === 'web') return;
  
  try {
    const cacheDir = FileSystem.cacheDirectory;
    if (!cacheDir) return;
    
    const contents = await FileSystem.readDirectoryAsync(cacheDir);
    
    // Delete each file in the cache directory
    for (const item of contents) {
      // Skip system directories
      if (item.startsWith('.')) continue;
      
      const itemUri = `${cacheDir}${item}`;
      const itemInfo = await FileSystem.getInfoAsync(itemUri);
      
      if (itemInfo.exists) {
        if (itemInfo.isDirectory) {
          // For directories, use regular deletion to avoid excessive processing
          await FileSystem.deleteAsync(itemUri, { idempotent: true });
        } else {
          // For files, use regular deletion (these are just cache files)
          await FileSystem.deleteAsync(itemUri, { idempotent: true });
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up temporary files:', error);
  }
};

/**
 * Securely wipe all user data
 * This is a destructive operation that removes all user data from the device
 * 
 * @returns Promise resolving when wipe is complete
 */
export const secureWipeAllUserData = async (): Promise<void> => {
  if (Platform.OS === 'web') {
    // For web, clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    return;
  }
  
  try {
    // Get document directory
    const docDir = FileSystem.documentDirectory;
    if (!docDir) return;
    
    // List of directories to securely delete
    const dirsToDelete = [
      `${docDir}photos/`,
      `${docDir}encrypted_photos/`,
      `${docDir}exports/`,
      `${docDir}logs/`,
      `${docDir}workouts/`
    ];
    
    // Securely delete each directory
    for (const dir of dirsToDelete) {
      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (dirInfo.exists) {
        await secureDeleteDirectory(dir);
      }
    }
    
    // Clean up cache directory
    await cleanupTemporaryFiles();
    
    console.log('All user data securely wiped');
  } catch (error) {
    console.error('Error during secure data wipe:', error);
    throw error;
  }
};