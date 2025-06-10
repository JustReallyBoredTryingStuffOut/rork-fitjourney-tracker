import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, SafeAreaView } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import { Stack, useRouter } from 'expo-router';
import { useAiStore } from '@/store/aiStore';
import { useHealthStore } from '@/store/healthStore';
import { useMacroStore } from '@/store/macroStore';
import { usePhotoStore } from '@/store/photoStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { useNotificationStore } from '@/store/notificationStore';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { secureStore } from '@/utils/encryption';
import { ArrowLeft } from "lucide-react-native";

// Handle conditional import for expo-sharing (not available on web)
let Sharing: any = null;
if (Platform.OS !== 'web') {
  import('expo-sharing').then(module => {
    Sharing = module;
  }).catch(err => {
    console.warn('expo-sharing is not available:', err);
  });
}

export default function DataManagement() {
  const router = useRouter();
  const { theme, colorScheme } = useThemeStore();
  const currentTheme = theme === "system" ? "light" : theme;
  const colors = getColors(currentTheme, colorScheme);
  
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Get all stores
  const aiStore = useAiStore();
  const healthStore = useHealthStore();
  const macroStore = useMacroStore();
  const photoStore = usePhotoStore();
  const workoutStore = useWorkoutStore();
  const notificationStore = useNotificationStore();
  const themeStore = useThemeStore();
  
  const exportData = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Not Available', 'Data export is not available on web.');
      return;
    }
    
    setIsExporting(true);
    
    try {
      // Collect all data
      const exportData = {
        goals: aiStore.goals,
        chats: aiStore.chats,
        weightLogs: healthStore.weightLogs,
        stepLogs: healthStore.stepLogs,
        activityLogs: healthStore.activityLogs,
        healthGoals: healthStore.healthGoals,
        macroLogs: macroStore.macroLogs,
        macroGoals: macroStore.macroGoals,
        userProfile: macroStore.userProfile,
        foodPhotos: photoStore.foodPhotos.map(photo => ({
          ...photo,
          uri: 'PHOTO_URI_REMOVED_FOR_EXPORT' // Don't export actual photo URIs
        })),
        progressPhotos: photoStore.progressPhotos.map(photo => ({
          ...photo,
          uri: 'PHOTO_URI_REMOVED_FOR_EXPORT' // Don't export actual photo URIs
        })),
        exercises: workoutStore.exercises,
        workouts: workoutStore.workouts,
        workoutLogs: workoutStore.workoutLogs,
        scheduledWorkouts: workoutStore.scheduledWorkouts,
        notificationSettings: notificationStore.settings,
        themeSettings: {
          theme: themeStore.theme,
          colorScheme: themeStore.colorScheme
        },
        exportDate: new Date().toISOString(),
      };
      
      // Create a JSON file
      const fileUri = `${FileSystem.documentDirectory}fitness_data_export.json`;
      await FileSystem.writeAsStringAsync(
        fileUri,
        JSON.stringify(exportData, null, 2),
        { encoding: FileSystem.EncodingType.UTF8 }
      );
      
      // Share the file
      if (Sharing && await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri);
      } else {
        Alert.alert('Sharing not available', 'Sharing is not available on this device.');
      }
    } catch (error) {
      console.error('Error exporting data:', error);
      Alert.alert('Export Failed', 'There was an error exporting your data.');
    } finally {
      setIsExporting(false);
    }
  };
  
  const deleteAllData = () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete all your data? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: confirmDeleteAllData
        }
      ]
    );
  };
  
  const confirmDeleteAllData = async () => {
    setIsDeleting(true);
    
    try {
      // Clear all stores
      await AsyncStorage.clear();
      
      // Clear secure storage if available
      if (Platform.OS !== 'web') {
        const secureKeys = [
          'user-profile-secure',
          'health-data-secure',
          'workout-data-secure'
        ];
        
        for (const key of secureKeys) {
          await SecureStore.deleteItemAsync(key);
        }
      }
      
      // Clear photo directories if available
      if (Platform.OS !== 'web') {
        const photoDir = `${FileSystem.documentDirectory}photos/`;
        const photoDirInfo = await FileSystem.getInfoAsync(photoDir);
        
        if (photoDirInfo.exists) {
          await FileSystem.deleteAsync(photoDir, { idempotent: true });
        }
      }
      
      Alert.alert(
        'Data Deleted',
        'All your data has been deleted. The app will now restart.',
        [
          { 
            text: 'OK',
            onPress: () => {
              // Navigate back to the home screen
              router.replace('/');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error deleting data:', error);
      Alert.alert('Delete Failed', 'There was an error deleting your data.');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: "Data Management",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView style={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.title, { color: colors.text }]}>Data Management</Text>
          <Text style={[styles.description, { color: colors.text }]}>
            Manage your personal data stored in this app. You can export your data or delete all data.
          </Text>
          
          <View style={[styles.card, { borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Export Your Data</Text>
            <Text style={[styles.cardDescription, { color: colors.text }]}>
              Export all your data in JSON format. This includes your profile, workouts, nutrition logs, and health data.
              Photos will not be included in the export.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={exportData}
              disabled={isExporting}
            >
              {isExporting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Export Data</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <View style={[styles.card, styles.dangerCard, { borderColor: colors.error }]}>
            <Text style={[styles.cardTitle, { color: colors.error }]}>Delete All Data</Text>
            <Text style={[styles.cardDescription, { color: colors.text }]}>
              Permanently delete all your data from this app. This action cannot be undone.
              All your profile information, workouts, logs, and photos will be deleted.
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.error }]}
              onPress={deleteAllData}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Delete All Data</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => router.push('/privacy-policy')}
          >
            <Text style={[styles.link, { color: colors.primary }]}>View Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dangerCard: {
    marginTop: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  link: {
    fontSize: 16,
    fontWeight: '500',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
});