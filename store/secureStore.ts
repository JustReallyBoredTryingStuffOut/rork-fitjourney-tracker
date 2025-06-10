import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { secureStore, generateEncryptionKey, storeEncryptionKey } from "@/utils/encryption";
import * as Crypto from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import { cleanupTempDecryptedFiles, deleteAllEncryptedPhotos } from "@/utils/fileEncryption";

interface SecureStoreState {
  hasInitializedEncryption: boolean;
  userConsent: boolean;
  encryptionVersion: number;
  
  // Actions
  setUserConsent: (consent: boolean) => void;
  initializeEncryption: () => Promise<void>;
  
  // Secure storage helpers
  secureSet: (key: string, value: string) => Promise<void>;
  secureGet: (key: string) => Promise<string | null>;
  secureRemove: (key: string) => Promise<void>;
  
  // GDPR compliance
  exportUserData: () => Promise<string>;
  deleteUserData: () => Promise<void>;
  
  // Secure deletion
  secureWipeAllData: () => Promise<void>;
  secureWipeStorageKeys: (keys: string[]) => Promise<void>;
}

// Create a secure storage adapter for zustand
const createSecureStorage = () => {
  return {
    getItem: async (name: string): Promise<string | null> => {
      if (Platform.OS === 'web') {
        return AsyncStorage.getItem(name);
      }
      try {
        return await SecureStore.getItemAsync(name);
      } catch (e) {
        return null;
      }
    },
    setItem: async (name: string, value: string): Promise<void> => {
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem(name, value);
        return;
      }
      try {
        await SecureStore.setItemAsync(name, value);
      } catch (e) {
        console.error('Error storing secure data:', e);
      }
    },
    removeItem: async (name: string): Promise<void> => {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem(name);
        return;
      }
      try {
        await SecureStore.deleteItemAsync(name);
      } catch (e) {
        console.error('Error removing secure data:', e);
      }
    }
  };
};

export const useSecureStore = create<SecureStoreState>()(
  persist(
    (set, get) => ({
      hasInitializedEncryption: false,
      userConsent: false,
      encryptionVersion: 2, // Track encryption version for potential future upgrades
      
      setUserConsent: (consent) => set({ userConsent: consent }),
      
      initializeEncryption: async () => {
        try {
          // Generate a device identifier for additional security
          let deviceId = await secureStore.getItem('device-id');
          
          if (!deviceId) {
            // Create a unique device identifier
            if (Platform.OS === 'web') {
              // For web, create a fingerprint based on available browser info
              const fingerprint = navigator.userAgent + 
                                  screen.width + 
                                  screen.height + 
                                  navigator.language;
              
              deviceId = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                fingerprint
              );
            } else {
              // For native, generate a random ID
              const randomBytes = await Crypto.getRandomBytesAsync(32);
              deviceId = Array.from(randomBytes)
                .map(b => b.toString(16).padStart(2, '0'))
                .join('');
            }
            
            await secureStore.setItem('device-id', deviceId);
          }
          
          // Check if encryption key exists, if not create one
          const key = await secureStore.getItem('encryption-key');
          
          if (!key) {
            // Generate and store a new encryption key
            const newKey = await generateEncryptionKey();
            await storeEncryptionKey(newKey);
            
            // Store the encryption version
            await secureStore.setItem('encryption-version', get().encryptionVersion.toString());
          } else {
            // Check if we need to upgrade encryption
            const storedVersion = await secureStore.getItem('encryption-version');
            const currentVersion = storedVersion ? parseInt(storedVersion, 10) : 1;
            
            if (currentVersion < get().encryptionVersion) {
              // In a real app, you would implement migration logic here
              // to re-encrypt data with the new encryption method
              console.log('Encryption upgrade needed from version', currentVersion, 
                         'to', get().encryptionVersion);
              
              // Update the stored version
              await secureStore.setItem('encryption-version', get().encryptionVersion.toString());
            }
          }
          
          set({ hasInitializedEncryption: true });
        } catch (error) {
          console.error('Failed to initialize encryption:', error);
        }
      },
      
      secureSet: async (key, value) => {
        await secureStore.setItem(key, value);
      },
      
      secureGet: async (key) => {
        return secureStore.getItem(key);
      },
      
      secureRemove: async (key) => {
        await secureStore.removeItem(key);
      },
      
      exportUserData: async () => {
        // In a real implementation, this would gather all user data
        // from various stores and return it in a structured format
        
        // For this example, we'll just return a placeholder
        const userData = {
          exportDate: new Date().toISOString(),
          encryptionVersion: get().encryptionVersion,
          message: "This would contain all user data in a real implementation"
        };
        
        return JSON.stringify(userData, null, 2);
      },
      
      deleteUserData: async () => {
        // Perform a secure wipe of all user data
        await get().secureWipeAllData();
        
        // Reset the store state
        set({
          hasInitializedEncryption: false,
          userConsent: false,
          encryptionVersion: get().encryptionVersion // Keep the version number
        });
      },
      
      secureWipeAllData: async () => {
        if (Platform.OS === 'web') {
          // For web, clear localStorage and sessionStorage
          localStorage.clear();
          sessionStorage.clear();
          
          // Clear AsyncStorage
          await AsyncStorage.clear();
          return;
        }
        
        try {
          // 1. Delete all encrypted photos
          await deleteAllEncryptedPhotos();
          
          // 2. Clean up temporary files
          await cleanupTempDecryptedFiles();
          
          // 3. Clear AsyncStorage
          await AsyncStorage.clear();
          
          // 4. Clear SecureStore keys
          const keysToDelete = [
            'encryption-key',
            'encryption-version',
            'device-id',
            'user-profile',
            'health-data',
            'workout-data',
            'notification-settings',
            'user-profile-secure',
            'health-data-secure',
            'workout-data-secure'
          ];
          
          await get().secureWipeStorageKeys(keysToDelete);
          
          // 5. Clear app document directory
          const appDirs = [
            `${FileSystem.documentDirectory}photos/`,
            `${FileSystem.documentDirectory}workouts/`,
            `${FileSystem.documentDirectory}exports/`,
            `${FileSystem.documentDirectory}logs/`
          ];
          
          for (const dir of appDirs) {
            const dirInfo = await FileSystem.getInfoAsync(dir);
            if (dirInfo.exists) {
              await FileSystem.deleteAsync(dir, { idempotent: true });
            }
          }
          
          // 6. Clear cache directory
          const cacheDir = FileSystem.cacheDirectory;
          if (cacheDir) {
            try {
              const cacheContents = await FileSystem.readDirectoryAsync(cacheDir);
              for (const item of cacheContents) {
                await FileSystem.deleteAsync(`${cacheDir}${item}`, { idempotent: true });
              }
            } catch (error) {
              console.warn('Error clearing cache directory:', error);
            }
          }
          
          console.log('All user data securely wiped');
        } catch (error) {
          console.error('Error during secure data wipe:', error);
          throw error;
        }
      },
      
      secureWipeStorageKeys: async (keys: string[]) => {
        if (Platform.OS === 'web') {
          for (const key of keys) {
            await AsyncStorage.removeItem(key);
          }
          return;
        }
        
        try {
          // For each key, first overwrite with random data, then delete
          for (const key of keys) {
            try {
              // Get the current value to determine if it exists
              const currentValue = await SecureStore.getItemAsync(key);
              
              if (currentValue) {
                // Generate random data of similar length
                const randomBytes = await Crypto.getRandomBytesAsync(
                  Math.max(currentValue.length, 32)
                );
                const randomData = Array.from(randomBytes)
                  .map(b => String.fromCharCode(b % 94 + 32)) // Printable ASCII
                  .join('');
                
                // Overwrite with random data
                await SecureStore.setItemAsync(key, randomData);
                
                // Overwrite again with zeros
                await SecureStore.setItemAsync(key, '0'.repeat(randomData.length));
                
                // Finally delete
                await SecureStore.deleteItemAsync(key);
              }
            } catch (keyError) {
              console.warn(`Error securely wiping key ${key}:`, keyError);
              // Try regular deletion as fallback
              try {
                await SecureStore.deleteItemAsync(key);
              } catch (deleteError) {
                console.error(`Failed to delete key ${key}:`, deleteError);
              }
            }
          }
        } catch (error) {
          console.error('Error during secure key wipe:', error);
          throw error;
        }
      }
    }),
    {
      name: "secure-storage",
      storage: createJSONStorage(() => createSecureStorage()),
    }
  )
);