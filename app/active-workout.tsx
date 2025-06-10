import React, { useState, useEffect, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput, 
  Alert,
  Modal,
  Image,
  Platform,
  ActivityIndicator,
  BackHandler,
  Vibration
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { 
  Plus, 
  Minus, 
  Clock, 
  Edit3, 
  X, 
  Star, 
  Camera, 
  Video, 
  MessageSquare,
  Check,
  Play,
  Pause,
  StopCircle,
  ArrowLeft,
  Watch,
  Zap
} from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import * as Speech from 'expo-speech';
import { colors } from "@/constants/colors";
import { useWorkoutStore } from "@/store/workoutStore";
import { useNotificationStore } from "@/store/notificationStore";
import { usePhotoStore, MediaType } from "@/store/photoStore";
import { useHealthStore } from "@/store/healthStore";
import { WorkoutSet, WorkoutRating, PersonalRecord } from "@/types";
import Timer from "@/components/Timer";
import Button from "@/components/Button";
import RestTimerModal from "@/components/RestTimerModal";
import NoteInput from "@/components/NoteInput";
import VideoEmbed from "@/components/VideoEmbed";
import { useTheme } from "@/context/ThemeContext";
import PRCelebrationModal from "@/components/PRCelebrationModal";
import DraggableExerciseCard from "@/components/DraggableExerciseCard";

// Voice configuration for a more natural British female voice
const voiceConfig = {
  language: 'en-GB',
  pitch: 1.05,
  rate: 0.92,
};

// Premium British female voices in order of preference for iOS
const preferredBritishVoices = [
  'com.apple.voice.premium.en-GB.Serena',
  'com.apple.voice.premium.en-GB.Kate',
  'com.apple.ttsbundle.Serena-compact',
  'com.apple.ttsbundle.Tessa-compact',
  'com.apple.voice.compact.en-GB.Serena',
  'com.apple.voice.compact.en-GB.Kate',
  'com.apple.eloquence.en-GB.Serena'
];

// Get available voices on component mount
let bestBritishFemaleVoice: string | undefined = undefined;

// Function to initialize the best available voice
const initializeVoice = async () => {
  if (Platform.OS === 'web') return;
  
  try {
    const voices = await Speech.getAvailableVoicesAsync();
    
    // First try to find one of our preferred voices
    for (const preferredVoice of preferredBritishVoices) {
      if (voices.some(v => v.identifier === preferredVoice)) {
        bestBritishFemaleVoice = preferredVoice;
        console.log(`Selected preferred voice: ${preferredVoice}`);
        return;
      }
    }
    
    // If no preferred voice found, look for any high-quality British female voice
    const highQualityBritishVoice = voices.find(v => 
      v.language.includes('en-GB') && 
      (v.quality === 'Enhanced' || v.quality === 'Premium') &&
      (v.name.toLowerCase().includes('female') || 
       v.name.includes('Kate') || 
       v.name.includes('Serena') || 
       v.name.includes('Tessa'))
    );
    
    if (highQualityBritishVoice) {
      bestBritishFemaleVoice = highQualityBritishVoice.identifier;
      console.log(`Selected high-quality voice: ${highQualityBritishVoice.identifier}`);
      return;
    }
    
    // Last resort: any British English voice
    const anyBritishVoice = voices.find(v => v.language.includes('en-GB'));
    if (anyBritishVoice) {
      bestBritishFemaleVoice = anyBritishVoice.identifier;
      console.log(`Selected fallback British voice: ${anyBritishVoice.identifier}`);
      return;
    }
    
    // If all else fails, use any English voice
    const anyEnglishVoice = voices.find(v => v.language.includes('en-'));
    if (anyEnglishVoice) {
      bestBritishFemaleVoice = anyEnglishVoice.identifier;
      console.log(`Selected any English voice: ${anyEnglishVoice.identifier}`);
    }
  } catch (err) {
    console.log('Error getting available voices:', err);
  }
};

// Initialize voice when component loads
initializeVoice();

// Helper function to speak with the best available voice
const speakWithBestVoice = (text: string) => {
  if (Platform.OS === 'web') return;
  
  const speechOptions = {
    ...voiceConfig,
    voice: bestBritishFemaleVoice
  };
  
  Speech.speak(text, speechOptions);
};

export default function ActiveWorkoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { 
    activeWorkout, 
    workouts, 
    exercises, 
    logSet, 
    completeWorkout, 
    cancelWorkout,
    updateSetNote,
    updateExerciseNote,
    updateWorkoutNote,
    updateSetWeight,
    updateSetReps,
    rateWorkout,
    addWorkoutMedia,
    activeTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    startRestTimer,
    skipRestTimer,
    setTimerSettings,
    timerSettings,
    getWorkoutDuration,
    isWorkoutRunningTooLong,
    longWorkoutThreshold,
    getPersonalRecordMessage,
    isMajorLift,
    // New functions for exercise reordering and completion
    reorderExercises,
    markExerciseCompleted,
    isExerciseCompleted,
    areAllSetsCompleted,
    startExerciseRestTimer
  } = useWorkoutStore();
  
  const { showLongWorkoutNotification } = useNotificationStore();
  const { addWorkoutMedia: addMediaToStore, isGifUrl } = usePhotoStore();
  const { isAppleWatchConnected, connectedDevices } = useHealthStore();
  
  const [showRestModal, setShowRestModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [ratingNote, setRatingNote] = useState("");
  const [ratingMedia, setRatingMedia] = useState<string | null>(null);
  const [isGif, setIsGif] = useState(false);
  const [showTimerSettingsModal, setShowTimerSettingsModal] = useState(false);
  const [showVideoEmbedModal, setShowVideoEmbedModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [workoutDuration, setWorkoutDuration] = useState(0);
  const [showLongWorkoutAlert, setShowLongWorkoutAlert] = useState(false);
  const [isLoadingGif, setIsLoadingGif] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [showSetNoteModal, setShowSetNoteModal] = useState(false);
  const [currentSetNote, setCurrentSetNote] = useState("");
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(-1);
  const [currentSetIndex, setCurrentSetIndex] = useState(-1);
  const [useConnectedDevice, setUseConnectedDevice] = useState(false);
  
  // State for exercise expansion
  const [expandedExercises, setExpandedExercises] = useState<Record<number, boolean>>({});
  
  // State for drag and drop
  const [isDragging, setIsDragging] = useState(false);
  const [draggedExerciseIndex, setDraggedExerciseIndex] = useState<number | null>(null);
  
  // PR celebration state
  const [showPRModal, setShowPRModal] = useState(false);
  const [currentPR, setCurrentPR] = useState<PersonalRecord | null>(null);
  
  // Ref to track if long workout notification has been shown
  const longWorkoutNotificationShown = useRef(false);
  
  // Check if there are connected devices that can track workouts
  const hasConnectedDevices = connectedDevices.some(
    device => device.connected && 
    (device.type === "appleWatch" || device.type === "fitbit" || device.type === "garmin")
  );
  
  // Start a timer to update workout duration
  useEffect(() => {
    if (!activeWorkout) return;
    
    const durationInterval = setInterval(() => {
      const duration = getWorkoutDuration();
      setWorkoutDuration(duration);
      
      // Check if workout is running too long and notification hasn't been shown yet
      if (isWorkoutRunningTooLong() && !longWorkoutNotificationShown.current) {
        longWorkoutNotificationShown.current = true;
        setShowLongWorkoutAlert(true);
        
        // Also send a system notification
        const workout = workouts.find(w => w.id === activeWorkout.workoutId);
        if (workout) {
          showLongWorkoutNotification(workout.name, duration);
        }
      }
    }, 60000); // Update every minute
    
    return () => clearInterval(durationInterval);
  }, [activeWorkout, getWorkoutDuration, isWorkoutRunningTooLong]);
  
  // Voice prompts for timer
  useEffect(() => {
    if (timerSettings.voicePrompts && Platform.OS !== 'web') {
      if (activeTimer.isResting && activeTimer.isRunning) {
        // Rest started
        speakWithBestVoice("Rest period started");
      } else if (!activeTimer.isResting && activeTimer.isRunning && activeTimer.elapsedTime < 1000) {
        // Workout started
        speakWithBestVoice("Workout timer started");
      }
    }
  }, [activeTimer.isResting, activeTimer.isRunning, activeTimer.elapsedTime]);
  
  // Handle back button on Android
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleGoBack();
      return true;
    });
    
    return () => backHandler.remove();
  }, []);
  
  // Listen for PR events from the workout store
  useEffect(() => {
    const unsubscribe = useWorkoutStore.subscribe(
      (state) => state.personalRecords,
      (personalRecords, previousPersonalRecords) => {
        // Check if a new PR was added
        if (personalRecords.length > previousPersonalRecords.length) {
          // Get the most recent PR
          const newPR = personalRecords[personalRecords.length - 1];
          setCurrentPR(newPR);
          setShowPRModal(true);
        }
      }
    );
    
    return () => unsubscribe();
  }, []);
  
  // Check for connected devices when starting workout
  useEffect(() => {
    if (workoutStarted && hasConnectedDevices) {
      Alert.alert(
        "Connected Device Detected",
        "Would you like to use your connected device to track this workout?",
        [
          { text: "No", style: "cancel" },
          { 
            text: "Yes", 
            onPress: () => setUseConnectedDevice(true)
          }
        ]
      );
    }
  }, [workoutStarted, hasConnectedDevices]);
  
  // Initialize expanded state for exercises
  useEffect(() => {
    if (activeWorkout && activeWorkout.exercises.length > 0) {
      const initialExpandedState: Record<number, boolean> = {};
      activeWorkout.exercises.forEach((_, index) => {
        initialExpandedState[index] = index === 0; // Only expand the first exercise by default
      });
      setExpandedExercises(initialExpandedState);
    }
  }, [activeWorkout]);
  
  if (!activeWorkout) {
    router.replace("/");
    return null;
  }
  
  const workout = workouts.find(w => w.id === activeWorkout.workoutId);
  
  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
      </View>
    );
  }
  
  const handleAddSet = (exerciseIndex: number) => {
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      weight: 0,
      reps: 0,
      completed: false,
      notes: "",
    };
    
    logSet(exerciseIndex, newSet);
    
    // Auto-start rest timer if enabled
    if (timerSettings.autoStartRest) {
      startRestTimer(timerSettings.defaultRestTime);
    }
  };
  
  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    startTimer();
    
    // Voice prompt for workout start
    if (timerSettings.voicePrompts && Platform.OS !== 'web') {
      speakWithBestVoice(`Starting ${workout.name} workout. Let's go!`);
    }
  };
  
  const handleCompleteWorkout = () => {
    pauseTimer();
    setShowRatingModal(true);
  };
  
  const handleSubmitRating = async () => {
    const workoutRating: WorkoutRating = {
      rating,
      note: ratingNote,
      media: ratingMedia,
      date: new Date().toISOString()
    };
    
    // If there's media and it's a local file (not a URL), save it to the photo store
    if (ratingMedia && !ratingMedia.startsWith('http')) {
      try {
        const mediaType: MediaType = {
          id: Date.now().toString(),
          uri: ratingMedia,
          type: isGif ? "gif" : "image",
          date: new Date().toISOString(),
          workoutId: activeWorkout.workoutId,
          notes: ratingNote
        };
        
        await addMediaToStore(mediaType);
      } catch (error) {
        console.error("Error saving workout media:", error);
      }
    }
    
    rateWorkout(workoutRating);
    completeWorkout();
    setShowRatingModal(false);
    router.replace("/");
  };
  
  const handleCancelWorkout = () => {
    setShowCancelConfirmation(true);
  };
  
  const confirmCancelWorkout = () => {
    cancelWorkout();
    setShowCancelConfirmation(false);
    router.navigate("/(tabs)");
  };
  
  const handleCaptureMedia = async () => {
    try {
      // Request permissions first
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant camera roll permissions to add photos');
          return;
        }
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setRatingMedia(uri);
        
        // Check if it's a GIF
        const isGifMedia = isGifUrl(uri);
        setIsGif(isGifMedia);
      }
    } catch (error) {
      console.error("Error capturing media:", error);
      Alert.alert("Error", "Failed to capture media. Please try again.");
    }
  };
  
  const handleTakePhoto = async () => {
    try {
      // Request permissions first
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Please grant camera permissions to take photos');
          return;
        }
      }
      
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        setRatingMedia(uri);
        setIsGif(false);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };
  
  const handleAddGif = async () => {
    setIsLoadingGif(true);
    
    try {
      // In a real app, you would integrate with a GIF API like Giphy or Tenor
      // For this example, we'll use a mock GIF URL
      const gifOptions = [
        "https://media.giphy.com/media/3oKIPavRPgJYaNI97W/giphy.gif", // Workout success
        "https://media.giphy.com/media/3o7TKGMZHi73yzCumQ/giphy.gif", // Tired
        "https://media.giphy.com/media/l2JdXY0zQv7uN0jeU/giphy.gif", // Strong
        "https://media.giphy.com/media/3o7TKRwpns23QMNNiE/giphy.gif", // Flexing
        "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif"  // Exhausted
      ];
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Pick a random GIF
      const randomGif = gifOptions[Math.floor(Math.random() * gifOptions.length)];
      
      setRatingMedia(randomGif);
      setIsGif(true);
    } catch (error) {
      console.error("Error adding GIF:", error);
      Alert.alert("Error", "Failed to add GIF. Please try again.");
    } finally {
      setIsLoadingGif(false);
    }
  };
  
  const handleAddVideo = () => {
    setShowVideoEmbedModal(true);
  };
  
  const handleSaveVideo = () => {
    if (!videoUrl.trim()) {
      Alert.alert("Error", "Please enter a valid URL");
      return;
    }
    
    // Check if it's a YouTube URL (TikTok embedding is problematic on iOS)
    const isYouTube = videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be");
    
    if (!isYouTube) {
      Alert.alert("Error", "Please enter a valid YouTube URL. TikTok videos cannot be embedded on iOS.");
      return;
    }
    
    addWorkoutMedia({
      type: "video",
      url: videoUrl,
      exerciseId: null, // For the whole workout
      timestamp: new Date().toISOString()
    });
    
    setVideoUrl("");
    setShowVideoEmbedModal(false);
    
    Alert.alert("Success", "Video saved to your workout");
  };
  
  const handleUpdateTimerSettings = (settings: any) => {
    setTimerSettings({
      ...timerSettings,
      ...settings
    });
    
    setShowTimerSettingsModal(false);
  };
  
  const handleEndLongWorkout = () => {
    setShowLongWorkoutAlert(false);
    handleCompleteWorkout();
  };
  
  const handleContinueLongWorkout = () => {
    setShowLongWorkoutAlert(false);
    // Reset the notification flag after a delay to allow for another notification later
    setTimeout(() => {
      longWorkoutNotificationShown.current = false;
    }, 15 * 60 * 1000); // Reset after 15 minutes
  };
  
  const handleGoBack = () => {
    Alert.alert(
      "Leave Workout",
      "Are you sure you want to leave this workout? Your progress will be saved and you can continue later.",
      [
        {
          text: "Stay",
          style: "cancel",
        },
        {
          text: "Leave",
          onPress: () => router.navigate("/(tabs)"),
          style: "destructive",
        },
      ]
    );
  };
  
  const handleOpenSetNote = (exerciseIndex: number, setIndex: number, note: string) => {
    setCurrentExerciseIndex(exerciseIndex);
    setCurrentSetIndex(setIndex);
    setCurrentSetNote(note);
    setShowSetNoteModal(true);
  };
  
  const handleSaveSetNote = () => {
    if (currentExerciseIndex >= 0 && currentSetIndex >= 0) {
      updateSetNote(currentExerciseIndex, currentSetIndex, currentSetNote);
      setShowSetNoteModal(false);
    }
  };
  
  const handleUpdateWeight = (exerciseIndex: number, setIndex: number, value: string) => {
    const weight = parseFloat(value) || 0;
    updateSetWeight(exerciseIndex, setIndex, weight);
  };
  
  const handleUpdateReps = (exerciseIndex: number, setIndex: number, value: string) => {
    const reps = parseInt(value) || 0;
    updateSetReps(exerciseIndex, setIndex, reps);
  };
  
  const handleClosePRModal = () => {
    setShowPRModal(false);
    setCurrentPR(null);
  };
  
  // New handlers for exercise reordering and completion
  const handleToggleExpand = (index: number) => {
    setExpandedExercises(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  const handleDragStart = () => {
    // Provide haptic feedback when drag starts
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
    setIsDragging(true);
  };
  
  const handleDragEnd = (fromIndex: number, toIndex: number) => {
    // Provide haptic feedback when drag ends
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
    
    setIsDragging(false);
    
    // Only reorder if the indices are different and valid
    if (fromIndex !== toIndex && 
        fromIndex >= 0 && 
        toIndex >= 0 && 
        fromIndex < activeWorkout.exercises.length && 
        toIndex < activeWorkout.exercises.length) {
      
      // Update the expanded state to match the new order
      const newExpandedState = { ...expandedExercises };
      const fromExpanded = newExpandedState[fromIndex];
      const toExpanded = newExpandedState[toIndex];
      
      // Swap the expanded states
      newExpandedState[toIndex] = fromExpanded;
      newExpandedState[fromIndex] = toExpanded;
      
      setExpandedExercises(newExpandedState);
      
      // Reorder the exercises in the store
      reorderExercises(fromIndex, toIndex);
      
      // Provide feedback
      if (timerSettings.voicePrompts && Platform.OS !== 'web') {
        speakWithBestVoice("Exercise order updated");
      }
    }
  };
  
  const handleMarkExerciseCompleted = (exerciseIndex: number) => {
    markExerciseCompleted(exerciseIndex, true);
    
    // Provide haptic feedback
    if (Platform.OS !== 'web') {
      Vibration.vibrate(200);
    }
    
    // Voice feedback
    if (timerSettings.voicePrompts && Platform.OS !== 'web') {
      const exercise = exercises.find(e => e.id === activeWorkout.exercises[exerciseIndex].exerciseId);
      if (exercise) {
        speakWithBestVoice(`${exercise.name} completed. Great job!`);
      }
    }
    
    // Auto-expand the next exercise if available
    if (exerciseIndex < activeWorkout.exercises.length - 1) {
      setExpandedExercises(prev => ({
        ...prev,
        [exerciseIndex]: false,
        [exerciseIndex + 1]: true
      }));
    }
  };
  
  const handleStartExerciseRest = (exerciseIndex: number) => {
    // Start a rest timer between exercises
    startExerciseRestTimer(timerSettings.defaultRestTime * 1.5); // Use a longer rest time between exercises
    
    // Voice feedback
    if (timerSettings.voicePrompts && Platform.OS !== 'web') {
      speakWithBestVoice("Starting rest between exercises");
    }
  };
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: workout.name,
          headerBackTitle: "Home",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={handleCancelWorkout}
            >
              <X size={20} color={colors.error} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        {!workoutStarted ? (
          <View style={styles.startWorkoutContainer}>
            <Text style={styles.startWorkoutTitle}>Ready to start your workout?</Text>
            <Text style={styles.startWorkoutSubtitle}>
              Track your time and progress by starting the workout timer
            </Text>
            
            {hasConnectedDevices && (
              <View style={styles.deviceOption}>
                <View style={styles.deviceToggle}>
                  <Watch size={20} color={colors.primary} />
                  <Text style={styles.deviceToggleText}>Use connected device</Text>
                </View>
                <TouchableOpacity 
                  style={styles.deviceInfoButton}
                  onPress={() => {
                    Alert.alert(
                      "Connected Device",
                      "Using your connected device will allow automatic tracking of your workout, including heart rate and calories burned.",
                      [{ text: "OK" }]
                    );
                  }}
                >
                  <Text style={styles.deviceInfoText}>What's this?</Text>
                </TouchableOpacity>
              </View>
            )}
            
            <Button
              title="Start Workout"
              onPress={handleStartWorkout}
              size="large"
              icon={<Play size={20} color="#FFFFFF" />}
              style={styles.startWorkoutButton}
            />
          </View>
        ) : (
          <>
            {useConnectedDevice && (
              <View style={styles.deviceBanner}>
                <View style={styles.deviceBannerContent}>
                  <Watch size={20} color={colors.primary} />
                  <Text style={styles.deviceBannerText}>
                    Tracking with {
                      connectedDevices.find(d => d.connected && 
                        (d.type === "appleWatch" || d.type === "fitbit" || d.type === "garmin"))?.name || 
                      "connected device"
                    }
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.deviceBannerButton}
                  onPress={() => {
                    Alert.alert(
                      "Device Tracking",
                      "Your workout is being tracked by your connected device. Heart rate, calories, and other metrics will be synced automatically.",
                      [{ text: "OK" }]
                    );
                  }}
                >
                  <Zap size={16} color={colors.primary} />
                </TouchableOpacity>
              </View>
            )}
            
            <View style={styles.workoutTimerContainer}>
              <View style={styles.workoutDurationCard}>
                <Text style={styles.workoutDurationLabel}>WORKOUT DURATION</Text>
                <Text style={styles.workoutDurationValue}>
                  {Math.floor(workoutDuration / 60)}h {workoutDuration % 60}m
                </Text>
                <View style={styles.workoutTimerControls}>
                  {activeTimer.isRunning && !activeTimer.isResting ? (
                    <TouchableOpacity 
                      style={styles.timerControlButton}
                      onPress={pauseTimer}
                    >
                      <Pause size={20} color={colors.text} />
                    </TouchableOpacity>
                  ) : !activeTimer.isResting ? (
                    <TouchableOpacity 
                      style={styles.timerControlButton}
                      onPress={startTimer}
                    >
                      <Play size={20} color={colors.text} />
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
              
              <Timer 
                onSettingsPress={() => setShowTimerSettingsModal(true)}
                showSettings
              />
            </View>
            
            <View style={styles.notesContainer}>
              <Text style={styles.sectionTitle}>Workout Notes</Text>
              <NoteInput
                initialValue={activeWorkout.notes}
                onSave={(note) => updateWorkoutNote(note)}
                placeholder="Add notes for this workout..."
                multiline
              />
            </View>
            
            {activeWorkout.media && activeWorkout.media.length > 0 && (
              <View style={styles.mediaContainer}>
                <Text style={styles.sectionTitle}>Workout Videos</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {activeWorkout.media
                    .filter(media => media.type === "video")
                    .map((media, index) => (
                      <View key={index} style={styles.videoCard}>
                        <VideoEmbed url={media.url} />
                      </View>
                    ))}
                  
                  <TouchableOpacity 
                    style={styles.addVideoCard}
                    onPress={handleAddVideo}
                  >
                    <Video size={24} color={colors.primary} />
                    <Text style={styles.addVideoText}>Add Video</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
            
            <View style={styles.exercisesContainer}>
              <Text style={styles.sectionTitle}>Exercises</Text>
              
              {isDragging && (
                <View style={styles.dragInstructions}>
                  <Text style={styles.dragInstructionsText}>
                    Drag up or down to reorder exercises
                  </Text>
                </View>
              )}
              
              {activeWorkout.exercises.map((exerciseLog, exerciseIndex) => {
                const exercise = exercises.find(e => e.id === exerciseLog.exerciseId);
                if (!exercise) return null;
                
                const isCompleted = isExerciseCompleted(exerciseIndex);
                const allSetsCompleted = areAllSetsCompleted(exerciseIndex);
                const isExpanded = expandedExercises[exerciseIndex] || false;
                
                return (
                  <DraggableExerciseCard
                    key={exerciseLog.id}
                    exercise={exercise}
                    exerciseLog={exerciseLog}
                    index={exerciseIndex}
                    isCompleted={isCompleted}
                    areAllSetsCompleted={allSetsCompleted}
                    isExpanded={isExpanded}
                    onToggleExpand={() => handleToggleExpand(exerciseIndex)}
                    onDragStart={handleDragStart}
                    onDragEnd={(toIndex) => handleDragEnd(exerciseIndex, toIndex)}
                    onMarkCompleted={() => handleMarkExerciseCompleted(exerciseIndex)}
                    onStartRest={() => handleStartExerciseRest(exerciseIndex)}
                    totalExercises={activeWorkout.exercises.length}
                  >
                    <View style={styles.exerciseNotesContainer}>
                      <NoteInput
                        initialValue={exerciseLog.notes}
                        onSave={(note) => updateExerciseNote(exerciseIndex, note)}
                        placeholder="Add notes for this exercise..."
                      />
                    </View>
                    
                    {exerciseLog.sets.length > 0 && (
                      <View style={styles.setsContainer}>
                        <View style={styles.setsHeader}>
                          <Text style={[styles.setsHeaderText, styles.setColumn]}>SET</Text>
                          <Text style={[styles.setsHeaderText, styles.weightColumn]}>KG</Text>
                          <Text style={[styles.setsHeaderText, styles.repsColumn]}>REPS</Text>
                          <Text style={[styles.setsHeaderText, styles.notesColumn]}>NOTES</Text>
                        </View>
                        
                        {exerciseLog.sets.map((set, setIndex) => (
                          <View key={set.id} style={styles.setRow}>
                            <Text style={[styles.setText, styles.setColumn]}>{setIndex + 1}</Text>
                            
                            <View style={[styles.inputContainer, styles.weightColumn]}>
                              <TextInput
                                style={styles.input}
                                value={set.weight.toString()}
                                keyboardType="numeric"
                                onChangeText={(value) => handleUpdateWeight(exerciseIndex, setIndex, value)}
                              />
                            </View>
                            
                            <View style={[styles.inputContainer, styles.repsColumn]}>
                              <TextInput
                                style={styles.input}
                                value={set.reps.toString()}
                                keyboardType="numeric"
                                onChangeText={(value) => handleUpdateReps(exerciseIndex, setIndex, value)}
                              />
                            </View>
                            
                            <TouchableOpacity 
                              style={[styles.notesButton, styles.notesColumn]}
                              onPress={() => handleOpenSetNote(exerciseIndex, setIndex, set.notes)}
                            >
                              <Edit3 size={16} color={colors.textSecondary} />
                            </TouchableOpacity>
                          </View>
                        ))}
                      </View>
                    )}
                    
                    <View style={styles.exerciseActions}>
                      <Button
                        title="Add Set"
                        onPress={() => handleAddSet(exerciseIndex)}
                        variant="outline"
                        size="small"
                        icon={<Plus size={16} color={colors.primary} />}
                        style={styles.addSetButton}
                      />
                      
                      <Button
                        title="Rest Timer"
                        onPress={() => setShowRestModal(true)}
                        variant="outline"
                        size="small"
                        icon={<Clock size={16} color={colors.primary} />}
                        style={styles.restButton}
                      />
                    </View>
                  </DraggableExerciseCard>
                );
              })}
            </View>
            
            <View style={styles.addVideoSection}>
              <Button
                title="Add YouTube Video"
                onPress={handleAddVideo}
                variant="outline"
                icon={<Video size={18} color={colors.primary} />}
                style={styles.addVideoButton}
              />
              <Text style={styles.addVideoHelp}>
                Save instructional videos to reference during your workout
              </Text>
            </View>
          </>
        )}
      </ScrollView>
      
      {workoutStarted && (
        <View style={styles.footer}>
          <View style={styles.footerButtonsContainer}>
            <Button
              title="Cancel Workout"
              onPress={handleCancelWorkout}
              variant="outline"
              size="large"
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
              icon={<X size={18} color={colors.error} />}
            />
            <Button
              title="Complete Workout"
              onPress={handleCompleteWorkout}
              size="large"
              style={styles.completeButton}
            />
          </View>
        </View>
      )}
      
      {/* Rest Timer Modal */}
      <RestTimerModal
        visible={showRestModal}
        onClose={() => setShowRestModal(false)}
        defaultTime={timerSettings.defaultRestTime}
      />
      
      {/* Rating Modal */}
      <Modal
        visible={showRatingModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.ratingModal}>
            <View style={styles.ratingHeader}>
              <Text style={styles.ratingTitle}>Rate Your Workout</Text>
              <TouchableOpacity 
                onPress={() => setShowRatingModal(false)}
                style={styles.closeButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.ratingSubtitle}>
              How was your workout today?
            </Text>
            
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <Star
                    size={36}
                    color={star <= rating ? "#FFB800" : colors.border}
                    fill={star <= rating ? "#FFB800" : "none"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={styles.ratingInput}
              placeholder="Add a note about your workout (optional)"
              placeholderTextColor={colors.textLight}
              value={ratingNote}
              onChangeText={setRatingNote}
              multiline
            />
            
            <View style={styles.mediaButtons}>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={handleTakePhoto}
              >
                <Camera size={24} color={colors.primary} />
                <Text style={styles.mediaButtonText}>Take Photo</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={handleCaptureMedia}
              >
                <Image 
                  source={{ uri: "https://img.icons8.com/ios/50/000000/image-gallery.png" }} 
                  style={{ width: 24, height: 24, tintColor: colors.secondary }}
                />
                <Text style={[styles.mediaButtonText, { color: colors.secondary }]}>Gallery</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={handleAddGif}
                disabled={isLoadingGif}
              >
                {isLoadingGif ? (
                  <ActivityIndicator size="small" color={colors.warning} />
                ) : (
                  <>
                    <Video size={24} color={colors.warning} />
                    <Text style={[styles.mediaButtonText, { color: colors.warning }]}>Add GIF</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
            
            {ratingMedia && (
              <View style={styles.mediaPreview}>
                <Image 
                  source={{ uri: ratingMedia }} 
                  style={styles.mediaImage} 
                  resizeMode="cover"
                />
                <TouchableOpacity 
                  style={styles.removeMediaButton}
                  onPress={() => {
                    setRatingMedia(null);
                    setIsGif(false);
                  }}
                >
                  <X size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            )}
            
            <Button
              title="Submit Rating"
              onPress={handleSubmitRating}
              disabled={rating === 0}
              style={styles.submitButton}
            />
          </View>
        </View>
      </Modal>
      
      {/* Set Note Modal */}
      <Modal
        visible={showSetNoteModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowSetNoteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.noteModal}>
            <View style={styles.noteModalHeader}>
              <Text style={styles.noteModalTitle}>Set Notes</Text>
              <TouchableOpacity 
                onPress={() => setShowSetNoteModal(false)}
                style={styles.closeButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.noteInput}
              placeholder="Add notes for this set..."
              placeholderTextColor={colors.textLight}
              value={currentSetNote}
              onChangeText={setCurrentSetNote}
              multiline
            />
            
            <Button
              title="Save Note"
              onPress={handleSaveSetNote}
              style={styles.saveNoteButton}
            />
          </View>
        </View>
      </Modal>
      
      {/* Timer Settings Modal */}
      <Modal
        visible={showTimerSettingsModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowTimerSettingsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.settingsModal}>
            <View style={styles.settingsHeader}>
              <Text style={styles.settingsTitle}>Timer Settings</Text>
              <TouchableOpacity 
                onPress={() => setShowTimerSettingsModal(false)}
                style={styles.closeButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Auto-start rest timer after set</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  timerSettings.autoStartRest && styles.toggleButtonActive
                ]}
                onPress={() => handleUpdateTimerSettings({ 
                  autoStartRest: !timerSettings.autoStartRest 
                })}
              >
                <View style={[
                  styles.toggleKnob,
                  timerSettings.autoStartRest && styles.toggleKnobActive
                ]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Voice prompts</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  timerSettings.voicePrompts && styles.toggleButtonActive
                ]}
                onPress={() => handleUpdateTimerSettings({ 
                  voicePrompts: !timerSettings.voicePrompts 
                })}
              >
                <View style={[
                  styles.toggleKnob,
                  timerSettings.voicePrompts && styles.toggleKnobActive
                ]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Countdown beep</Text>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  timerSettings.countdownBeep && styles.toggleButtonActive
                ]}
                onPress={() => handleUpdateTimerSettings({ 
                  countdownBeep: !timerSettings.countdownBeep 
                })}
              >
                <View style={[
                  styles.toggleKnob,
                  timerSettings.countdownBeep && styles.toggleKnobActive
                ]} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Default rest time</Text>
              <View style={styles.timeOptions}>
                {[30, 60, 90, 120].map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      timerSettings.defaultRestTime === time && styles.timeOptionActive
                    ]}
                    onPress={() => handleUpdateTimerSettings({ defaultRestTime: time })}
                  >
                    <Text style={[
                      styles.timeOptionText,
                      timerSettings.defaultRestTime === time && styles.timeOptionTextActive
                    ]}>
                      {time >= 60 ? `${time / 60}m` : `${time}s`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <Button
              title="Save Settings"
              onPress={() => setShowTimerSettingsModal(false)}
              style={styles.saveSettingsButton}
            />
          </View>
        </View>
      </Modal>
      
      {/* Video Embed Modal */}
      <Modal
        visible={showVideoEmbedModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowVideoEmbedModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.videoModal}>
            <View style={styles.videoModalHeader}>
              <Text style={styles.videoModalTitle}>Add Video</Text>
              <TouchableOpacity 
                onPress={() => setShowVideoEmbedModal(false)}
                style={styles.closeButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.videoModalSubtitle}>
              Paste a YouTube URL
            </Text>
            
            <TextInput
              style={styles.videoInput}
              placeholder="https://www.youtube.com/watch?v=..."
              placeholderTextColor={colors.textLight}
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <View style={styles.videoModalButtons}>
              <Button
                title="Cancel"
                onPress={() => setShowVideoEmbedModal(false)}
                variant="outline"
                style={styles.videoModalButton}
              />
              <Button
                title="Save Video"
                onPress={handleSaveVideo}
                style={styles.videoModalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Long Workout Alert Modal */}
      <Modal
        visible={showLongWorkoutAlert}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowLongWorkoutAlert(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            <View style={styles.alertHeader}>
              <Clock size={24} color={colors.primary} />
              <Text style={styles.alertTitle}>Long Workout Detected</Text>
            </View>
            
            <Text style={styles.alertMessage}>
              Your workout has been running for {workoutDuration} minutes, which is longer than the usual duration.
            </Text>
            
            <Text style={styles.alertQuestion}>
              Would you like to end your workout now?
            </Text>
            
            <View style={styles.alertButtons}>
              <Button
                title="Continue Workout"
                onPress={handleContinueLongWorkout}
                variant="outline"
                style={styles.alertButton}
              />
              <Button
                title="End Workout"
                onPress={handleEndLongWorkout}
                style={styles.alertButton}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* Cancel Workout Confirmation Modal */}
      <Modal
        visible={showCancelConfirmation}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowCancelConfirmation(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.alertModal}>
            <View style={styles.alertHeader}>
              <X size={24} color={colors.error} />
              <Text style={styles.alertTitle}>Cancel Workout</Text>
            </View>
            
            <Text style={styles.alertMessage}>
              Are you sure you want to cancel this workout? All progress will be lost.
            </Text>
            
            <View style={styles.alertButtons}>
              <Button
                title="Keep Working Out"
                onPress={() => setShowCancelConfirmation(false)}
                variant="outline"
                style={styles.alertButton}
              />
              <Button
                title="Cancel Workout"
                onPress={confirmCancelWorkout}
                style={[styles.alertButton, styles.cancelConfirmButton]}
                textStyle={styles.cancelConfirmButtonText}
              />
            </View>
          </View>
        </View>
      </Modal>
      
      {/* PR Celebration Modal */}
      {currentPR && (
        <PRCelebrationModal
          visible={showPRModal}
          onClose={handleClosePRModal}
          exerciseName={currentPR.exerciseName}
          weight={currentPR.weight}
          previousBest={currentPR.previousBest}
          message={getPersonalRecordMessage(currentPR)}
          isMajorLift={isMajorLift(currentPR.exerciseId)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerButton: {
    padding: 8,
  },
  startWorkoutContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 40,
  },
  startWorkoutTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
    marginBottom: 12,
  },
  startWorkoutSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
  },
  deviceOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 24,
  },
  deviceToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceToggleText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 8,
  },
  deviceInfoButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: colors.highlight,
  },
  deviceInfoText: {
    fontSize: 12,
    color: colors.primary,
  },
  startWorkoutButton: {
    width: "100%",
    maxWidth: 300,
  },
  deviceBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.highlight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  deviceBannerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  deviceBannerText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  deviceBannerButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  workoutTimerContainer: {
    marginBottom: 24,
  },
  workoutDurationCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  workoutDurationLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: 4,
  },
  workoutDurationValue: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  workoutTimerControls: {
    flexDirection: "row",
    justifyContent: "center",
  },
  timerControlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  notesContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  exercisesContainer: {
    marginBottom: 24,
  },
  dragInstructions: {
    backgroundColor: colors.highlight,
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
    alignItems: "center",
  },
  dragInstructionsText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  exerciseNotesContainer: {
    marginBottom: 16,
  },
  setsContainer: {
    marginBottom: 16,
  },
  setsHeader: {
    flexDirection: "row",
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 8,
    alignItems: "center",
  },
  setsHeaderText: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  setText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    textAlign: "center",
  },
  // Column layout styles
  setColumn: {
    width: 40,
    textAlign: "center",
  },
  weightColumn: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  repsColumn: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: "center",
  },
  notesColumn: {
    width: 40,
    alignItems: "center",
  },
  inputContainer: {
    justifyContent: "center",
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
    width: "100%",
  },
  notesButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseActions: {
    flexDirection: "row",
    marginTop: 16,
  },
  addSetButton: {
    flex: 1,
    marginRight: 8,
  },
  restButton: {
    flex: 1,
    marginLeft: 8,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 16,
  },
  footerButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  completeButton: {
    flex: 3,
    marginLeft: 8,
  },
  cancelButton: {
    flex: 2,
    borderColor: colors.error,
  },
  cancelButtonText: {
    color: colors.error,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginTop: 24,
  },
  
  // Rating Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  ratingModal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  ratingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  ratingTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  ratingSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 24,
  },
  starButton: {
    marginHorizontal: 8,
  },
  ratingInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  mediaButtons: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  mediaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  mediaButtonText: {
    fontSize: 14,
    color: colors.primary,
    marginLeft: 8,
  },
  mediaPreview: {
    position: "relative",
    width: "100%",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
  },
  mediaImage: {
    width: "100%",
    height: "100%",
  },
  removeMediaButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  submitButton: {
    width: "100%",
  },
  
  // Set Note Modal Styles
  noteModal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  noteModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  noteModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  noteInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  saveNoteButton: {
    width: "100%",
  },
  
  // Timer Settings Modal Styles
  settingsModal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  settingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  settingsTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  toggleButton: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.border,
    padding: 2,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  toggleKnob: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
  },
  toggleKnobActive: {
    transform: [{ translateX: 20 }],
  },
  timeOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  timeOption: {
    width: 60,
    height: 40,
    borderRadius: 8,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeOptionText: {
    fontSize: 14,
    color: colors.text,
  },
  timeOptionTextActive: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  saveSettingsButton: {
    marginTop: 16,
  },
  
  // Video Embed Modal Styles
  videoModal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  videoModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  videoModalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
  },
  videoModalSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  videoInput: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 24,
  },
  videoModalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  videoModalButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  
  // Media Container Styles
  mediaContainer: {
    marginBottom: 24,
  },
  videoCard: {
    width: 200,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: 12,
  },
  addVideoCard: {
    width: 120,
    height: 120,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: "dashed",
  },
  addVideoText: {
    fontSize: 14,
    color: colors.primary,
    marginTop: 8,
  },
  addVideoSection: {
    marginBottom: 40,
  },
  addVideoButton: {
    marginBottom: 8,
  },
  addVideoHelp: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  
  // Long Workout Alert Modal Styles
  alertModal: {
    backgroundColor: colors.card,
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginLeft: 12,
  },
  alertMessage: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 22,
  },
  alertQuestion: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 24,
  },
  alertButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  alertButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelConfirmButton: {
    backgroundColor: colors.error,
  },
  cancelConfirmButtonText: {
    color: "#FFFFFF",
  },
});