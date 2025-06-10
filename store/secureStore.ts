import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { secureStore, generateEncryptionKey, storeEncryptionKey } from "@/utils/encryption";
import * as Crypto from 'expo-crypto';

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
        // In a real implementation, this would clear all user data
        // from all stores and secure storage
        
        // Clear AsyncStorage
        await AsyncStorage.clear();
        
        // Clear SecureStore keys (if on native)
        if (Platform.OS !== 'web') {
          const keysToDelete = [
            'encryption-key',
            'encryption-version',
            'device-id',
            'user-profile',
            'health-data',
            'workout-data',
            'notification-settings'
          ];
          
          for (const key of keysToDelete) {
            await SecureStore.deleteItemAsync(key);
          }
        }
        
        // Reset the store state
        set({
          hasInitializedEncryption: false,
          userConsent: false,
          encryptionVersion: get().encryptionVersion // Keep the version number
        });
      }
    }),
    {
      name: "secure-storage",
      storage: createJSONStorage(() => createSecureStorage()),
    }
  )
);