import React, { useState, useEffect, useRef } from 'react';
import { Stack } from 'expo-router';
import { ThemeProvider } from '@/context/ThemeContext';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Dimensions, TextInput, ScrollView, Platform, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGamificationStore } from '@/store/gamificationStore';
import { useMacroStore } from '@/store/macroStore';
import { useWorkoutStore } from '@/store/workoutStore';
import { Zap, Award, Trophy, X, User, Weight, Ruler, Calendar, Activity, ArrowRight, ChevronRight, Brain, Sparkles } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { Picker } from '@react-native-picker/picker';
import Button from '@/components/Button';

// App name
export const APP_NAME = "FitQuest";

export default function RootLayout() {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const { 
    gamificationEnabled, 
    toggleGamification, 
    onboardingCompleted, 
    setOnboardingCompleted 
  } = useGamificationStore();
  
  const { userProfile, updateUserProfile } = useMacroStore();
  const { workoutRecommendationsEnabled, toggleWorkoutRecommendations, setAiRecommendationsExplained } = useWorkoutStore();
  
  // User profile form state
  const [name, setName] = useState(userProfile.name || "");
  const [weight, setWeight] = useState(userProfile.weight?.toString() || "");
  const [height, setHeight] = useState(userProfile.height?.toString() || "");
  const [birthYear, setBirthYear] = useState("");
  const [gender, setGender] = useState(userProfile.gender || "prefer-not-to-say");
  const [activityLevel, setActivityLevel] = useState(userProfile.activityLevel || "moderate");
  const [fitnessGoal, setFitnessGoal] = useState(userProfile.fitnessGoal || "maintain");
  const [fitnessLevel, setFitnessLevel] = useState(userProfile.fitnessLevel || "beginner");
  
  // Form validation state
  const [nameError, setNameError] = useState("");
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [birthYearError, setBirthYearError] = useState("");
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(Dimensions.get('window').height)).current;
  const loadingBarWidth = useRef(new Animated.Value(0)).current;
  const welcomeFadeIn = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Check if it's the first launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        
        if (hasLaunched === null) {
          setIsFirstLaunch(true);
          setShowWelcome(true);
        } else {
          setIsFirstLaunch(false);
          
          // Check if onboarding is completed
          if (!onboardingCompleted) {
            setShowWelcome(true);
          }
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(false);
      }
    };
    
    checkFirstLaunch();
  }, [onboardingCompleted]);
  
  // Run animations when welcome screen is shown
  useEffect(() => {
    if (showWelcome) {
      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      
      // Slide up animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start();
      
      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: currentOnboardingStep / (onboardingSteps.length - 1),
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [showWelcome, fadeAnim, slideAnim, currentOnboardingStep]);
  
  // Update progress bar when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: currentOnboardingStep / (onboardingSteps.length - 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentOnboardingStep]);
  
  // Run loading screen animations
  useEffect(() => {
    if (showLoadingScreen) {
      // Animate loading bar
      Animated.timing(loadingBarWidth, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          // Animate welcome message fade in
          Animated.timing(welcomeFadeIn, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }).start(() => {
            // After a delay, hide loading screen and mark first launch
            setTimeout(async () => {
              setShowLoadingScreen(false);
              await AsyncStorage.setItem('hasLaunched', 'true');
            }, 1500);
          });
        }
      });
      
      // Update progress percentage
      const interval = setInterval(() => {
        setLoadingProgress(prev => {
          const newProgress = prev + 5;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 150);
      
      return () => clearInterval(interval);
    }
  }, [showLoadingScreen, loadingBarWidth, welcomeFadeIn]);
  
  // Validate form fields
  const validateName = (value: string) => {
    if (!value.trim()) {
      setNameError("Name is required");
      return false;
    }
    setNameError("");
    return true;
  };
  
  const validateWeight = (value: string) => {
    if (!value.trim()) {
      setWeightError("Weight is required");
      return false;
    }
    const weightNum = parseFloat(value);
    if (isNaN(weightNum) || weightNum <= 0 || weightNum > 500) {
      setWeightError("Please enter a valid weight");
      return false;
    }
    setWeightError("");
    return true;
  };
  
  const validateHeight = (value: string) => {
    if (!value.trim()) {
      setHeightError("Height is required");
      return false;
    }
    const heightNum = parseFloat(value);
    if (isNaN(heightNum) || heightNum <= 0 || heightNum > 300) {
      setHeightError("Please enter a valid height");
      return false;
    }
    setHeightError("");
    return true;
  };
  
  // Calculate current year for birth year validation
  const currentYear = new Date().getFullYear();
  const minBirthYear = currentYear - 100;
  const maxBirthYear = currentYear - 13;
  
  // Validate birth year input
  const validateBirthYear = (value: string) => {
    if (!value) {
      setBirthYear("");
      setBirthYearError("");
      return true; // Birth year is optional
    }
    
    const year = parseInt(value);
    if (isNaN(year)) {
      setBirthYearError("Please enter a valid year");
      return false;
    }
    
    if (year < minBirthYear || year > maxBirthYear) {
      setBirthYearError(`Year must be between ${minBirthYear} and ${maxBirthYear}`);
      return false;
    }
    
    setBirthYearError("");
    return true;
  };
  
  // Handle continue button press
  const handleContinue = () => {
    // If we're on the name step, validate name
    if (currentOnboardingStep === 4) {
      if (!validateName(name)) {
        return;
      }
    }
    
    // If we're on the body metrics step, validate weight and height
    if (currentOnboardingStep === 5) {
      const isWeightValid = validateWeight(weight);
      const isHeightValid = validateHeight(height);
      const isBirthYearValid = validateBirthYear(birthYear);
      
      if (!isWeightValid || !isHeightValid || !isBirthYearValid) {
        return;
      }
    }
    
    if (currentOnboardingStep < onboardingSteps.length - 1) {
      setCurrentOnboardingStep(currentOnboardingStep + 1);
    } else {
      // We're on the last step
      // Complete onboarding and show loading screen
      completeOnboarding();
    }
  };
  
  // Function to complete onboarding and transition to loading screen
  const completeOnboarding = () => {
    // Save user profile
    const age = birthYear ? new Date().getFullYear() - parseInt(birthYear) : userProfile.age;
    
    updateUserProfile({
      name: name.trim() || "Fitness Enthusiast", // Default name if empty
      weight: weight ? parseFloat(weight) : userProfile.weight,
      height: height ? parseFloat(height) : userProfile.height,
      age: age || 30,
      gender,
      fitnessGoal,
      activityLevel,
      fitnessLevel,
      dateOfBirth: null, // We're only collecting year, not full date
    });
    
    // Complete onboarding
    setOnboardingCompleted(true);
    setShowWelcome(false);
    
    // Show loading screen for first launch
    if (isFirstLaunch) {
      setShowLoadingScreen(true);
    }
  };
  
  // Handle skip button press
  const handleSkip = () => {
    // If we're in the user details section, just complete onboarding
    if (currentOnboardingStep >= 4) {
      // For body metrics step, we don't allow skipping
      if (currentOnboardingStep === 5) {
        const isWeightValid = validateWeight(weight);
        const isHeightValid = validateHeight(height);
        
        if (!isWeightValid || !isHeightValid) {
          return;
        }
      }
      
      // Complete onboarding
      completeOnboarding();
      return;
    }
    
    // Otherwise, set default gamification to enabled and skip to user details
    toggleGamification(true);
    setCurrentOnboardingStep(4); // Skip to first user details step
  };
  
  // Handle gamification toggle
  const handleGamificationToggle = (enabled: boolean) => {
    toggleGamification(enabled);
    handleContinue();
  };
  
  // Handle AI recommendations toggle
  const handleAiRecommendationsToggle = (enabled: boolean) => {
    toggleWorkoutRecommendations(enabled);
    setAiRecommendationsExplained(true);
    handleContinue();
  };
  
  // Handle birth year input
  const handleBirthYearChange = (text: string) => {
    // Only allow digits
    const numericValue = text.replace(/[^0-9]/g, '');
    
    // Limit to 4 digits
    if (numericValue.length <= 4) {
      setBirthYear(numericValue);
      validateBirthYear(numericValue);
    }
  };
  
  // Onboarding steps
  const onboardingSteps = [
    {
      title: `Welcome to ${APP_NAME}!`,
      description: "Your personal fitness journey starts here. Let's get you set up for success!",
      icon: <Image source={require('@/assets/images/adaptive-icon.png')} style={styles.welcomeIcon} />,
      action: () => handleContinue(),
      actionText: "Get Started",
      showSkip: false, // Don't allow skipping the first screen
    },
    {
      title: "Gamify Your Fitness Journey",
      description: `${APP_NAME} offers a fun, game-like experience to keep you motivated. Earn achievements, complete challenges, and level up as you reach your fitness goals!`,
      icon: <Trophy size={80} color={colors.primary} />,
      action: () => handleContinue(),
      actionText: "Tell Me More",
      showSkip: false, // Don't allow skipping
    },
    {
      title: "Track Your Progress",
      description: "Earn points for completing workouts, maintaining streaks, and hitting personal records. Watch yourself level up from Beginner to Fitness Guru!",
      icon: <Award size={80} color={colors.primary} />,
      action: () => handleContinue(),
      actionText: "Sounds Fun",
      showSkip: false, // Don't allow skipping
    },
    {
      title: "Enable Achievement System?",
      description: "Would you like to enable the achievement system features? You can always change this later in your profile settings.",
      icon: <Zap size={80} color={colors.primary} />,
      action: null, // No single action, we have two buttons
      actionText: "",
      showSkip: false,
      customButtons: (
        <View style={styles.choiceButtons}>
          <TouchableOpacity 
            style={[styles.choiceButton, styles.noButton]} 
            onPress={() => handleGamificationToggle(false)}
          >
            <Text style={styles.choiceButtonText}>No Thanks</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.choiceButton, styles.yesButton]} 
            onPress={() => handleGamificationToggle(true)}
          >
            <Text style={styles.choiceButtonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      ),
    },
    // New user profile steps
    {
      title: "Tell Us About Yourself",
      description: "We'll use this information to personalize your experience, track your macros, and recommend workouts that match your goals.",
      icon: <User size={80} color={colors.primary} />,
      content: (
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Your Name <Text style={styles.requiredStar}>*</Text></Text>
          <TextInput
            style={[styles.textInput, nameError ? styles.inputError : null]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (text.trim()) setNameError("");
            }}
            placeholder="Enter your name"
            placeholderTextColor={colors.textLight}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>
      ),
      action: () => handleContinue(),
      actionText: "Continue",
      showSkip: false, // Don't allow skipping name entry
    },
    {
      title: "Your Body Metrics",
      description: "This helps us calculate your daily calorie needs and track your progress accurately.",
      icon: <Weight size={80} color={colors.primary} />,
      content: (
        <View style={styles.formContainer}>
          <View style={styles.formRow}>
            <View style={styles.formColumn}>
              <Text style={styles.formLabel}>Weight (kg) <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={[styles.textInput, weightError ? styles.inputError : null]}
                value={weight}
                onChangeText={(text) => {
                  setWeight(text);
                  if (text.trim()) validateWeight(text);
                }}
                placeholder="70"
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
              {weightError ? <Text style={styles.errorText}>{weightError}</Text> : null}
            </View>
            
            <View style={styles.formColumn}>
              <Text style={styles.formLabel}>Height (cm) <Text style={styles.requiredStar}>*</Text></Text>
              <TextInput
                style={[styles.textInput, heightError ? styles.inputError : null]}
                value={height}
                onChangeText={(text) => {
                  setHeight(text);
                  if (text.trim()) validateHeight(text);
                }}
                placeholder="175"
                keyboardType="numeric"
                placeholderTextColor={colors.textLight}
              />
              {heightError ? <Text style={styles.errorText}>{heightError}</Text> : null}
            </View>
          </View>
          
          <Text style={styles.formLabel}>Birth Year</Text>
          <TextInput
            style={[styles.textInput, birthYearError ? styles.inputError : null]}
            value={birthYear}
            onChangeText={handleBirthYearChange}
            placeholder={`${currentYear - 30}`}
            keyboardType="numeric"
            maxLength={4}
            placeholderTextColor={colors.textLight}
          />
          {birthYearError ? (
            <Text style={styles.errorText}>{birthYearError}</Text>
          ) : (
            <Text style={styles.inputHint}>
              This helps us determine your age group for better recommendations
            </Text>
          )}
        </View>
      ),
      action: () => handleContinue(),
      actionText: "Continue",
      showSkip: false, // Don't allow skipping body metrics
    },
    {
      title: "Your Fitness Profile",
      description: "Let us know your current activity level and goals so we can tailor your experience.",
      icon: <Activity size={80} color={colors.primary} />,
      content: (
        <ScrollView style={styles.formContainer}>
          <Text style={styles.formLabel}>Gender (Optional)</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(value) => setGender(value)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
              itemStyle={Platform.OS === 'ios' ? styles.pickerItemIOS : undefined}
            >
              <Picker.Item label="Male" value="male" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Female" value="female" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Other" value="other" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Prefer not to say" value="prefer-not-to-say" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
            </Picker>
          </View>
          
          <Text style={styles.formLabel}>Activity Level</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={activityLevel}
              onValueChange={(value) => setActivityLevel(value)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
              itemStyle={Platform.OS === 'ios' ? styles.pickerItemIOS : undefined}
            >
              <Picker.Item label="Sedentary (little or no exercise)" value="sedentary" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Lightly active (1-3 days/week)" value="light" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Moderately active (3-5 days/week)" value="moderate" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Very active (6-7 days/week)" value="active" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Extra active (very hard exercise & physical job)" value="very_active" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
            </Picker>
          </View>
          
          <Text style={styles.formLabel}>Fitness Goal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fitnessGoal}
              onValueChange={(value) => setFitnessGoal(value)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
              itemStyle={Platform.OS === 'ios' ? styles.pickerItemIOS : undefined}
            >
              <Picker.Item label="Lose Weight" value="lose" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Maintain Weight" value="maintain" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Gain Muscle" value="gain" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
            </Picker>
          </View>
          
          <Text style={styles.formLabel}>Fitness Level</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fitnessLevel}
              onValueChange={(value) => setFitnessLevel(value)}
              style={styles.picker}
              dropdownIconColor="#FFFFFF"
              itemStyle={Platform.OS === 'ios' ? styles.pickerItemIOS : undefined}
            >
              <Picker.Item label="Beginner" value="beginner" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Intermediate" value="intermediate" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
              <Picker.Item label="Advanced" value="advanced" color={Platform.OS === 'android' ? '#FFFFFF' : '#333333'} />
            </Picker>
          </View>
        </ScrollView>
      ),
      action: () => handleContinue(),
      actionText: "Continue",
      showSkip: false, // Don't allow skipping fitness profile
    },
    {
      title: "AI Workout Recommendations",
      description: "Would you like personalized workout recommendations based on your goals, fitness level, and preferences?",
      icon: <Brain size={80} color={colors.primary} />,
      content: (
        <View style={styles.aiRecommendationsContainer}>
          <View style={styles.aiFeatureItem}>
            <Sparkles size={24} color={colors.primary} style={styles.aiFeatureIcon} />
            <Text style={styles.aiFeatureText}>Smart workout suggestions based on your progress</Text>
          </View>
          <View style={styles.aiFeatureItem}>
            <Sparkles size={24} color={colors.primary} style={styles.aiFeatureIcon} />
            <Text style={styles.aiFeatureText}>Adapts to your fitness level as you improve</Text>
          </View>
          <View style={styles.aiFeatureItem}>
            <Sparkles size={24} color={colors.primary} style={styles.aiFeatureIcon} />
            <Text style={styles.aiFeatureText}>Considers your goals and preferences</Text>
          </View>
          <Text style={styles.aiPrivacyNote}>
            Your data is processed locally on your device. You can change this setting anytime.
          </Text>
        </View>
      ),
      action: null,
      actionText: "",
      showSkip: false,
      customButtons: (
        <View style={styles.choiceButtons}>
          <TouchableOpacity 
            style={[styles.choiceButton, styles.noButton]} 
            onPress={() => handleAiRecommendationsToggle(false)}
          >
            <Text style={styles.choiceButtonText}>No Thanks</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.choiceButton, styles.yesButton]} 
            onPress={() => handleAiRecommendationsToggle(true)}
          >
            <Text style={styles.choiceButtonText}>Enable</Text>
          </TouchableOpacity>
        </View>
      ),
    },
  ];
  
  // Current step
  const currentStep = onboardingSteps[currentOnboardingStep];
  
  if (isFirstLaunch === null) {
    // Still loading
    return null;
  }
  
  return (
    <ThemeProvider>
      {showLoadingScreen ? (
        <View style={styles.loadingContainer}>
          <Image 
            source={require('@/assets/images/adaptive-icon.png')} 
            style={styles.loadingIcon} 
          />
          <Text style={styles.loadingTitle}>{APP_NAME}</Text>
          <Text style={styles.loadingSubtitle}>Your fitness journey awaits</Text>
          
          <View style={styles.loadingBarContainer}>
            <Animated.View 
              style={[
                styles.loadingBar,
                { width: loadingBarWidth.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%']
                })}
              ]}
            />
          </View>
          
          <Text style={styles.loadingPercentage}>{loadingProgress}%</Text>
          
          {loadingProgress === 100 && (
            <Animated.View style={{ opacity: welcomeFadeIn }}>
              <Text style={styles.welcomeMessage}>Welcome, {name || "Fitness Enthusiast"}!</Text>
            </Animated.View>
          )}
        </View>
      ) : showWelcome ? (
        <Animated.View 
          style={[
            styles.welcomeContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.welcomeContent}>
            {currentStep.showSkip && (
              <TouchableOpacity 
                style={styles.skipButton} 
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>
                  {currentStep.skipText || "Skip"}
                </Text>
                <ChevronRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
            
            <View style={styles.iconContainer}>
              {currentStep.icon}
            </View>
            
            <Text style={styles.welcomeTitle}>{currentStep.title}</Text>
            <Text style={styles.welcomeDescription}>{currentStep.description}</Text>
            
            {currentStep.content && (
              <View style={styles.stepContent}>
                {currentStep.content}
              </View>
            )}
            
            {currentStep.customButtons ? (
              currentStep.customButtons
            ) : (
              <Button
                title={currentStep.actionText}
                onPress={currentStep.action || handleContinue}
                style={styles.continueButton}
                icon={<ArrowRight size={18} color="#FFFFFF" style={{ marginRight: 8 }} />}
              />
            )}
            
            {/* Modern progress indicator */}
            <View style={styles.progressContainer}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0%', '100%']
                    })
                  }
                ]}
              />
              <View style={styles.progressStepsContainer}>
                {onboardingSteps.map((_, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={[
                      styles.progressStep,
                      currentOnboardingStep === index && styles.activeProgressStep
                    ]}
                    onPress={() => {
                      // Only allow going back to previous steps
                      if (index <= currentOnboardingStep) {
                        setCurrentOnboardingStep(index);
                      }
                    }}
                  />
                ))}
              </View>
            </View>
            
            {currentOnboardingStep >= 4 && currentOnboardingStep < onboardingSteps.length - 1 && (
              <Text style={styles.privacyNote}>
                You can always update these details later in your profile settings.
              </Text>
            )}
          </View>
        </Animated.View>
      ) : (
        <Stack screenOptions={{ headerShown: false }} />
      )}
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  welcomeDescription: {
    fontSize: 16,
    color: '#CCCCCC',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  continueButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 0,
    padding: 8,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginRight: 4,
  },
  // Modern progress indicator
  progressContainer: {
    width: '100%',
    marginTop: 20,
    marginBottom: 10,
    position: 'relative',
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  progressStepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 2,
  },
  progressStep: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    zIndex: 2,
  },
  activeProgressStep: {
    backgroundColor: colors.primary,
    transform: [{scale: 1.5}],
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  choiceButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  choiceButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 30,
    width: '48%',
    alignItems: 'center',
  },
  yesButton: {
    backgroundColor: colors.primary,
  },
  noButton: {
    backgroundColor: '#444444',
  },
  choiceButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // New styles for user profile form
  stepContent: {
    width: '100%',
    marginBottom: 24,
  },
  formContainer: {
    width: '100%',
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  requiredStar: {
    color: '#FF3B30',
    fontWeight: 'bold',
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: -12,
    marginBottom: 16,
  },
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  formColumn: {
    width: '48%',
  },
  pickerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  picker: {
    color: '#FFFFFF',
    height: 50,
    backgroundColor: 'transparent',
  },
  pickerItemIOS: {
    fontSize: 16,
    height: 120,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  inputHint: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: -12,
    marginBottom: 16,
  },
  privacyNote: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 8,
  },
  // Loading screen styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingIcon: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 18,
    color: '#CCCCCC',
    marginBottom: 40,
  },
  loadingBarContainer: {
    width: '80%',
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loadingBar: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  loadingPercentage: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 40,
  },
  welcomeMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // AI recommendations styles
  aiRecommendationsContainer: {
    width: '100%',
    marginBottom: 16,
  },
  aiFeatureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 8,
  },
  aiFeatureIcon: {
    marginRight: 12,
  },
  aiFeatureText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  aiPrivacyNote: {
    fontSize: 12,
    color: '#AAAAAA',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
});