import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
import { 
  encryptAndSavePhoto, 
  deleteEncryptedPhoto, 
  ENCRYPTED_PHOTOS_DIR,
  setupEncryptedPhotoDirectory,
  cleanupTempDecryptedFiles,
  deleteAllEncryptedPhotos
} from "@/utils/fileEncryption";

export type FoodPhoto = {
  id: string;
  uri: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes: string;
  isAnalyzed: boolean;
};

export type ProgressPhoto = {
  id: string;
  uri: string;
  date: string;
  weight: number;
  notes: string;
  category: "front" | "side" | "back" | "other";
};

export type MediaType = {
  id: string;
  uri: string;
  type: "image" | "gif";
  date: string;
  workoutId?: string;
  notes?: string;
};

interface PhotoState {
  foodPhotos: FoodPhoto[];
  progressPhotos: ProgressPhoto[];
  workoutMedia: MediaType[];
  encryptionEnabled: boolean;
  
  // Actions
  addFoodPhoto: (photo: FoodPhoto) => Promise<void>;
  updateFoodPhoto: (photo: FoodPhoto) => Promise<void>;
  deleteFoodPhoto: (id: string) => Promise<void>;
  
  addProgressPhoto: (photo: ProgressPhoto) => Promise<void>;
  updateProgressPhoto: (photo: ProgressPhoto) => Promise<void>;
  deleteProgressPhoto: (id: string) => Promise<void>;
  
  // New media functions
  addWorkoutMedia: (media: MediaType) => Promise<void>;
  updateWorkoutMedia: (media: MediaType) => Promise<void>;
  deleteWorkoutMedia: (id: string) => Promise<void>;
  
  // Encryption settings
  toggleEncryption: (enabled: boolean) => void;
  
  // Helpers
  getFoodPhotosByDate: (date: string) => FoodPhoto[];
  getProgressPhotosByDate: (date: string) => ProgressPhoto[];
  getProgressPhotosByCategory: (category: ProgressPhoto["category"]) => ProgressPhoto[];
  getWorkoutMediaByWorkoutId: (workoutId: string) => MediaType[];
  isGifUrl: (url: string) => boolean;
  
  // Data management
  deleteAllPhotos: () => Promise<void>;
  cleanupTempFiles: () => Promise<void>;
}

// Create photo directory if it doesn't exist
const setupPhotoDirectories = async () => {
  if (Platform.OS === "web") return;
  
  const photoDir = `${FileSystem.documentDirectory}photos/`;
  const foodPhotoDir = `${photoDir}food/`;
  const progressPhotoDir = `${photoDir}progress/`;
  const workoutMediaDir = `${photoDir}workout/`;
  
  const photoDirInfo = await FileSystem.getInfoAsync(photoDir);
  if (!photoDirInfo.exists) {
    await FileSystem.makeDirectoryAsync(photoDir, { intermediates: true });
  }
  
  const foodDirInfo = await FileSystem.getInfoAsync(foodPhotoDir);
  if (!foodDirInfo.exists) {
    await FileSystem.makeDirectoryAsync(foodPhotoDir, { intermediates: true });
  }
  
  const progressDirInfo = await FileSystem.getInfoAsync(progressPhotoDir);
  if (!progressDirInfo.exists) {
    await FileSystem.makeDirectoryAsync(progressPhotoDir, { intermediates: true });
  }
  
  const workoutDirInfo = await FileSystem.getInfoAsync(workoutMediaDir);
  if (!workoutDirInfo.exists) {
    await FileSystem.makeDirectoryAsync(workoutMediaDir, { intermediates: true });
  }
  
  // Also setup encrypted photos directory
  await setupEncryptedPhotoDirectory();
};

// Initialize directories
if (Platform.OS !== "web") {
  setupPhotoDirectories();
}

// Helper function to securely delete a file
const secureDeleteFile = async (uri: string): Promise<void> => {
  if (Platform.OS === "web" || !uri || uri.startsWith('http')) return;
  
  try {
    if (uri.startsWith(ENCRYPTED_PHOTOS_DIR)) {
      // Use secure deletion for encrypted files
      await deleteEncryptedPhoto(uri);
    } else {
      // For regular files, use standard deletion
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(uri, { idempotent: true });
      }
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set, get) => ({
      foodPhotos: [],
      progressPhotos: [],
      workoutMedia: [],
      encryptionEnabled: true, // Encryption is enabled by default
      
      toggleEncryption: (enabled) => {
        set({ encryptionEnabled: enabled });
      },
      
      addFoodPhoto: async (photo) => {
        if (Platform.OS !== "web") {
          try {
            const fileName = `food_${photo.id}.jpg`;
            let newUri;
            
            if (get().encryptionEnabled) {
              // Encrypt and save the photo
              newUri = await encryptAndSavePhoto(photo.uri, fileName);
            } else {
              // Save without encryption (original behavior)
              newUri = `${FileSystem.documentDirectory}photos/food/${fileName}`;
              await FileSystem.copyAsync({
                from: photo.uri,
                to: newUri
              });
            }
            
            // Update the URI to point to the saved file
            photo.uri = newUri;
          } catch (error) {
            console.error("Error saving food photo:", error);
          }
        }
        
        set((state) => ({
          foodPhotos: [...state.foodPhotos, photo]
        }));
      },
      
      updateFoodPhoto: async (photo) => {
        set((state) => ({
          foodPhotos: state.foodPhotos.map(p => p.id === photo.id ? photo : p)
        }));
      },
      
      deleteFoodPhoto: async (id) => {
        const { foodPhotos } = get();
        const photoToDelete = foodPhotos.find(p => p.id === id);
        
        if (photoToDelete && Platform.OS !== "web") {
          try {
            await secureDeleteFile(photoToDelete.uri);
          } catch (error) {
            console.error("Error deleting food photo:", error);
          }
        }
        
        set((state) => ({
          foodPhotos: state.foodPhotos.filter(p => p.id !== id)
        }));
      },
      
      addProgressPhoto: async (photo) => {
        if (Platform.OS !== "web") {
          try {
            const fileName = `progress_${photo.id}.jpg`;
            let newUri;
            
            if (get().encryptionEnabled) {
              // Encrypt and save the photo
              newUri = await encryptAndSavePhoto(photo.uri, fileName);
            } else {
              // Save without encryption (original behavior)
              newUri = `${FileSystem.documentDirectory}photos/progress/${fileName}`;
              await FileSystem.copyAsync({
                from: photo.uri,
                to: newUri
              });
            }
            
            // Update the URI to point to the saved file
            photo.uri = newUri;
          } catch (error) {
            console.error("Error saving progress photo:", error);
          }
        }
        
        set((state) => ({
          progressPhotos: [...state.progressPhotos, photo]
        }));
      },
      
      updateProgressPhoto: async (photo) => {
        set((state) => ({
          progressPhotos: state.progressPhotos.map(p => p.id === photo.id ? photo : p)
        }));
      },
      
      deleteProgressPhoto: async (id) => {
        const { progressPhotos } = get();
        const photoToDelete = progressPhotos.find(p => p.id === id);
        
        if (photoToDelete && Platform.OS !== "web") {
          try {
            await secureDeleteFile(photoToDelete.uri);
          } catch (error) {
            console.error("Error deleting progress photo:", error);
          }
        }
        
        set((state) => ({
          progressPhotos: state.progressPhotos.filter(p => p.id !== id)
        }));
      },
      
      // New media functions
      addWorkoutMedia: async (media) => {
        // Only save to filesystem if it's a local file (not a URL) and not on web
        if (Platform.OS !== "web" && !media.uri.startsWith("http")) {
          try {
            const extension = get().isGifUrl(media.uri) ? "gif" : "jpg";
            const fileName = `workout_${media.id}.${extension}`;
            let newUri;
            
            if (get().encryptionEnabled) {
              // Encrypt and save the media
              newUri = await encryptAndSavePhoto(media.uri, fileName);
            } else {
              // Save without encryption (original behavior)
              newUri = `${FileSystem.documentDirectory}photos/workout/${fileName}`;
              await FileSystem.copyAsync({
                from: media.uri,
                to: newUri
              });
            }
            
            // Update the URI to point to the saved file
            media.uri = newUri;
          } catch (error) {
            console.error("Error saving workout media:", error);
          }
        }
        
        set((state) => ({
          workoutMedia: [...state.workoutMedia, media]
        }));
      },
      
      updateWorkoutMedia: async (media) => {
        set((state) => ({
          workoutMedia: state.workoutMedia.map(m => m.id === media.id ? media : m)
        }));
      },
      
      deleteWorkoutMedia: async (id) => {
        const { workoutMedia } = get();
        const mediaToDelete = workoutMedia.find(m => m.id === id);
        
        if (mediaToDelete && Platform.OS !== "web" && !mediaToDelete.uri.startsWith("http")) {
          try {
            await secureDeleteFile(mediaToDelete.uri);
          } catch (error) {
            console.error("Error deleting workout media:", error);
          }
        }
        
        set((state) => ({
          workoutMedia: state.workoutMedia.filter(m => m.id !== id)
        }));
      },
      
      getFoodPhotosByDate: (date) => {
        const { foodPhotos } = get();
        return foodPhotos.filter(
          photo => new Date(photo.date).toDateString() === new Date(date).toDateString()
        );
      },
      
      getProgressPhotosByDate: (date) => {
        const { progressPhotos } = get();
        return progressPhotos.filter(
          photo => new Date(photo.date).toDateString() === new Date(date).toDateString()
        );
      },
      
      getProgressPhotosByCategory: (category) => {
        const { progressPhotos } = get();
        return progressPhotos.filter(photo => photo.category === category);
      },
      
      getWorkoutMediaByWorkoutId: (workoutId) => {
        const { workoutMedia } = get();
        return workoutMedia.filter(media => media.workoutId === workoutId);
      },
      
      isGifUrl: (url: string) => {
        // Check if URL ends with .gif or contains giphy or tenor domains
        return url.toLowerCase().endsWith('.gif') || 
               url.includes('giphy.com') || 
               url.includes('tenor.com') ||
               url.includes('gph.is');
      },
      
      // Data management functions
      deleteAllPhotos: async () => {
        if (Platform.OS !== "web") {
          try {
            // Get all photos to delete
            const { foodPhotos, progressPhotos, workoutMedia } = get();
            
            // Delete all encrypted photos at once
            await deleteAllEncryptedPhotos();
            
            // Delete any non-encrypted photos
            const allPhotos = [
              ...foodPhotos.map(p => p.uri),
              ...progressPhotos.map(p => p.uri),
              ...workoutMedia.filter(m => !m.uri.startsWith('http')).map(m => m.uri)
            ];
            
            for (const uri of allPhotos) {
              if (!uri.startsWith(ENCRYPTED_PHOTOS_DIR) && !uri.startsWith('http')) {
                await FileSystem.deleteAsync(uri, { idempotent: true });
              }
            }
            
            // Clean up temp files
            await cleanupTempDecryptedFiles();
            
            // Clean up photo directories
            const photoDir = `${FileSystem.documentDirectory}photos/`;
            await FileSystem.deleteAsync(photoDir, { idempotent: true });
            await setupPhotoDirectories();
            
            console.log("All photos deleted successfully");
          } catch (error) {
            console.error("Error deleting all photos:", error);
          }
        }
        
        // Clear the store state
        set({
          foodPhotos: [],
          progressPhotos: [],
          workoutMedia: []
        });
      },
      
      cleanupTempFiles: async () => {
        if (Platform.OS !== "web") {
          try {
            await cleanupTempDecryptedFiles();
          } catch (error) {
            console.error("Error cleaning up temp files:", error);
          }
        }
      }
    }),
    {
      name: "photo-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);