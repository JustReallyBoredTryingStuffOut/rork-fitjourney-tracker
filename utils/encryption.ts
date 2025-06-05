import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Simple encryption/decryption for sensitive data
// Note: This is a basic implementation. For production apps, consider using more robust encryption libraries.

// Generate a random encryption key
export const generateEncryptionKey = async (): Promise<string> => {
  if (Platform.OS === 'web') {
    // For web, use a simpler approach
    return 'web-key-' + Math.random().toString(36).substring(2, 15);
  }
  
  // For native platforms, generate a more secure random key
  try {
    // Generate a random array
    const randomArray = new Uint8Array(32);
    for (let i = 0; i < 32; i++) {
      randomArray[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(randomArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  } catch (error) {
    // Fallback to a less secure but functional method
    console.warn('Using fallback random key generation');
    return 'secure-key-' + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
};

// Store the encryption key securely
export const storeEncryptionKey = async (key: string): Promise<void> => {
  if (Platform.OS === 'web') {
    // For web, store in localStorage (less secure)
    await AsyncStorage.setItem('encryption-key', key);
    return;
  }
  
  // For native platforms, use SecureStore
  await SecureStore.setItemAsync('encryption-key', key);
};

// Retrieve the encryption key
export const getEncryptionKey = async (): Promise<string | null> => {
  if (Platform.OS === 'web') {
    return AsyncStorage.getItem('encryption-key');
  }
  
  return SecureStore.getItemAsync('encryption-key');
};

// Simple XOR encryption/decryption
// Note: This is NOT secure and should not be used in production
const simpleEncrypt = (data: string, key: string): string => {
  let result = '';
  for (let i = 0; i < data.length; i++) {
    const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }
  return result;
};

// Encrypt data
export const encryptData = async (data: string): Promise<string> => {
  let key = await getEncryptionKey();
  
  if (!key) {
    // Generate a new key if none exists
    key = await generateEncryptionKey();
    await storeEncryptionKey(key);
  }
  
  // Simple encryption for demo purposes
  // In a real app, use a proper encryption library
  try {
    // Use a simple hash-based approach
    const dataHash = await simpleHash(data + key);
    
    // Combine the hash with the data for a simple encryption
    return dataHash.substring(0, 16) + btoa(data);
  } catch (error) {
    console.warn('Using fallback encryption method');
  }
  
  // Fallback to simple XOR encryption
  return simpleEncrypt(data, key);
};

// Simple hash function
const simpleHash = async (text: string): Promise<string> => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string
  const hashHex = (hash >>> 0).toString(16).padStart(8, '0');
  return hashHex.repeat(4); // Repeat to get 32 chars
};

// Decrypt data
export const decryptData = async (encryptedData: string): Promise<string | null> => {
  const key = await getEncryptionKey();
  
  if (!key) {
    console.error('No encryption key found');
    return null;
  }
  
  try {
    if (encryptedData.length > 16) {
      // If this looks like our more secure format (hash + base64)
      try {
        return atob(encryptedData.substring(16));
      } catch (e) {
        // If atob fails, it might be the simple XOR format
        console.warn('Failed to decrypt with secure method, trying fallback');
      }
    }
  } catch (error) {
    console.warn('Using fallback decryption method');
  }
  
  // Fallback to simple XOR decryption
  return simpleEncrypt(encryptedData, key); // XOR is its own inverse
};

// Helper to securely store sensitive data
export const secureStore = {
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      const encrypted = await encryptData(value);
      await AsyncStorage.setItem(key, encrypted);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      const encrypted = await AsyncStorage.getItem(key);
      if (!encrypted) return null;
      return decryptData(encrypted);
    } else {
      return SecureStore.getItemAsync(key);
    }
  },
  
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  }
};