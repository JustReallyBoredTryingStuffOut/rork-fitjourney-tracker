import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { secureStore } from "@/utils/encryption";

interface SecureStoreState {
  hasInitializedEncryption: boolean;
  userConsent: boolean;
  
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
      
      setUserConsent: (consent) => set({ userConsent: consent }),
      
      initializeEncryption: async () => {
        try {
          // Check if encryption key exists, if not create one
          const key = await secureStore.getItem('encryption-key');
          if (!key) {
            // This would generate and store a new encryption key
            // In a real implementation, this would be more complex
            await secureStore.setItem('encryption-key', 'initialized');
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
          message: "This would contain all user data in a real implementation"
        };
        
        return JSON.stringify(userData);
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
          userConsent: false
        });
      }
    }),
    {
      name: "secure-storage",
      storage: createJSONStorage(() => createSecureStorage()),
    }
  )
);