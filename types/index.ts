// Add these types to your existing types/index.ts file

export interface WeightLog {
  id: string;
  date: string;
  weight: number;
  notes?: string;
}

export interface StepLog {
  id: string;
  date: string;
  steps: number;
  distance: number;
  calories: number;
  source?: string;
  deviceId?: string;
}

export interface HealthGoals {
  dailySteps: number;
  weeklyWorkouts: number;
  targetWeight: number;
  targetDate: string;
}

export interface HealthDevice {
  id: string;
  name: string;
  type: string;
  model?: string;
  connected: boolean;
  lastSynced?: string;
  capabilities?: string[];
  batteryLevel?: number;
}

export interface ActivityLog {
  id: string;
  type: string;
  date: string;
  duration: number;
  distance: number;
  calories: number;
  notes: string;
  isOutdoor?: boolean;
  location?: string;
  route?: {
    id: string;
    name: string;
  };
  heartRate?: {
    avg: number;
    max: number;
    min: number;
  };
  elevationGain?: number;
  source?: string;
  deviceId?: string;
  externalId?: string;
}

export interface WaterIntake {
  id: string;
  date: string;
  amount: number;
}

export interface DeviceSync {
  id: string;
  deviceId: string;
  deviceName: string;
  timestamp: string;
  dataTypes: string[];
  recordCount: number;
}

export interface DeviceData {
  deviceId: string;
  deviceType: string;
  steps?: {
    date: string;
    steps: number;
    distance?: number;
    calories?: number;
  }[];
  activities?: {
    externalId: string;
    type: string;
    date: string;
    duration: number;
    distance: number;
    calories: number;
    notes?: string;
    isOutdoor?: boolean;
    location?: string;
    heartRate?: {
      avg: number;
      max: number;
      min: number;
    };
    elevationGain?: number;
    route?: any;
  }[];
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroups: MuscleGroup[];
  bodyRegion: BodyRegion;
  equipment: EquipmentType[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
  variations?: string[];
  tips?: string[];
  isCustom?: boolean;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  intensity?: 'low' | 'medium' | 'high';
  estimatedDuration: number;
  exercises: {
    id: string;
    sets?: number;
    reps?: number;
    restTime?: number;
  }[];
  imageUrl?: string;
  isCustom?: boolean;
  createdAt?: string;
  goalAlignment?: string[];
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  date: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  exercises: ExerciseLog[];
  notes: string;
  completed: boolean;
  rating: WorkoutRating | null;
  media?: WorkoutMedia[];
}

export interface ExerciseLog {
  id: string;
  exerciseId: string;
  sets: WorkoutSet[];
  notes: string;
}

export interface WorkoutSet {
  id: string;
  weight: number;
  reps: number;
  completed: boolean;
  notes: string;
}

export interface ScheduledWorkout {
  id: string;
  workoutId: string;
  date: string;
  time: string;
  recurring: boolean;
  recurringDays?: number[];
  notificationId?: string;
  completed?: boolean;
}

export interface WorkoutRating {
  rating: number;
  note: string;
  media: string | null;
  date: string;
}

export interface WorkoutMedia {
  type: 'image' | 'video';
  url: string;
  exerciseId: string | null;
  timestamp: string;
}

export interface TimerSettings {
  defaultRestTime: number;
  autoStartRest: boolean;
  voicePrompts: boolean;
  countdownBeep: boolean;
}

export type BodyRegion = 'upper' | 'lower' | 'core' | 'full';
export type MuscleGroup = 
  'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 
  'quads' | 'hamstrings' | 'glutes' | 'calves' | 
  'abs' | 'obliques' | 'lower back' | 
  'forearms' | 'traps' | 'lats';

export type EquipmentType = 
  'bodyweight' | 'dumbbell' | 'barbell' | 'kettlebell' | 
  'resistance band' | 'cable machine' | 'smith machine' | 
  'machine' | 'medicine ball' | 'stability ball' | 'bench' | 
  'pull-up bar' | 'TRX' | 'foam roller';

export interface PersonalRecord {
  id: string;
  exerciseId: string;
  exerciseName: string;
  weight: number;
  reps: number;
  estimatedOneRepMax: number;
  date: string;
  previousBest: number;
  improvement: number;
}

// New types for food categories
export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  imageUrl?: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  items: FoodItem[];
}

export interface MacroLog {
  id: string;
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  mealTime?: string;
  foodItemId?: string;
  foodName?: string;
  servingSize?: string;
  quantity?: number;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserProfile {
  name: string;
  weight: number; // kg
  height: number; // cm
  age: number;
  gender: "male" | "female" | "other";
  fitnessGoal: "lose" | "maintain" | "gain";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  dateOfBirth: string | null;
}

export interface MealRecommendation {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
  instructions: string[];
  prepTime: number;
  cookTime: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  dietaryRestrictions: string[];
  imageUrl?: string;
}

export interface FoodPhoto {
  id: string;
  uri: string;
  date: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  notes?: string;
  mealType?: "breakfast" | "lunch" | "dinner" | "snack";
  analysis?: {
    foodItems: string[];
    confidence: number;
  };
}