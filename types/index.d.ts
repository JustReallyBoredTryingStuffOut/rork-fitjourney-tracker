export type Exercise = {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string;
  description: string;
  instructions: string[];
  image?: string;
  video?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  defaultSets: number;
  defaultReps: number;
  defaultWeight?: number;
  defaultDuration?: number;
  defaultDistance?: number;
  defaultIncline?: number;
  defaultResistance?: number;
  defaultSpeed?: number;
  isCardio?: boolean;
  isBodyweight?: boolean;
  isTimed?: boolean;
  isDistance?: boolean;
  isCustom?: boolean;
};

export type Workout = {
  id: string;
  name: string;
  description: string;
  image?: string;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  muscleGroups: string[];
  equipment: string[];
  exercises: WorkoutExercise[];
  tags: string[];
  isRecommended?: boolean;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type WorkoutExercise = {
  exerciseId: string;
  sets: number;
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  incline?: number;
  resistance?: number;
  speed?: number;
  restTime?: number;
  notes?: string;
};

export type ExerciseLog = {
  exerciseId: string;
  sets: ExerciseSet[];
  notes?: string;
};

export type ExerciseSet = {
  reps?: number;
  weight?: number;
  duration?: number;
  distance?: number;
  incline?: number;
  resistance?: number;
  speed?: number;
  completed: boolean;
};

export type WorkoutLog = {
  id: string;
  workoutId: string;
  date: string;
  duration: number;
  exercises: ExerciseLog[];
  notes?: string;
  rating?: {
    rating: number;
    feedback?: string;
  };
};

export type ActiveWorkout = {
  workoutId: string;
  startTime: string;
  currentExerciseIndex: number;
  exercises: ExerciseLog[];
  restTimerActive?: boolean;
  restTimeRemaining?: number;
  restTimerStartTime?: string;
  notes?: string;
};

export type ScheduledWorkout = {
  id: string;
  workoutId: string;
  date: string;
  time?: string;
  completed: boolean;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    days?: number[]; // 0 = Sunday, 1 = Monday, etc.
    endDate?: string;
  };
  notification?: {
    enabled: boolean;
    minutesBefore: number;
  };
};

export type MacroGoals = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  water?: number;
};

export type DailyMacros = {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  water?: number;
};

export type FoodEntry = {
  id: string;
  name: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: number;
  servingUnit: string;
  image?: string;
  barcode?: string;
  notes?: string;
  aiGenerated?: boolean;
};

export type WeightLog = {
  id: string;
  date: string;
  weight: number;
  unit: 'kg' | 'lb';
  notes?: string;
};

export type BodyMeasurement = {
  id: string;
  date: string;
  type: 'chest' | 'waist' | 'hips' | 'thigh' | 'arm' | 'calf' | 'neck' | 'shoulders' | 'custom';
  customName?: string;
  value: number;
  unit: 'cm' | 'in';
  notes?: string;
};

export type ProgressPhoto = {
  id: string;
  date: string;
  uri: string;
  type: 'front' | 'back' | 'side' | 'custom';
  notes?: string;
  weight?: number;
  measurements?: {
    [key: string]: number;
  };
};

export type FoodPhoto = {
  id: string;
  date: string;
  uri: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  analysis?: {
    foods: {
      name: string;
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
      confidence: number;
    }[];
    totalCalories?: number;
    healthScore?: number;
    recommendations?: string[];
  };
  notes?: string;
};

export type Goal = {
  id: string;
  text: string;
  description?: string;
  date: string;
  targetDate?: string;
  completed: boolean;
  completedDate?: string;
  category: 'weight' | 'workout' | 'nutrition' | 'steps' | 'other';
  type?: 'weight' | 'workout' | 'nutrition' | 'steps' | 'custom';
  timeframe?: 'weekly' | 'monthly';
  aiAnalysis: GoalAnalysis | null;
};

export type GoalAnalysis = {
  type: 'weight' | 'strength' | 'endurance' | 'nutrition' | 'other';
  target?: {
    value: number;
    unit: string;
  };
  timeframe?: {
    duration: number;
    unit: 'day' | 'week' | 'month';
  };
  recommendations: {
    workouts: string[];
    nutrition: string[];
    habits: string[];
  };
  feasibility: 'easy' | 'moderate' | 'challenging' | 'very challenging';
};

export type UserProfile = {
  name: string;
  age?: number;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  height?: number;
  heightUnit?: 'cm' | 'ft';
  weight?: number;
  weightUnit?: 'kg' | 'lb';
  activityLevel?: 'sedentary' | 'lightly-active' | 'moderately-active' | 'very-active' | 'extremely-active';
  fitnessGoal?: 'lose-weight' | 'maintain-weight' | 'gain-weight' | 'build-muscle' | 'improve-endurance' | 'improve-strength';
  profilePicture?: string;
  preferredWorkoutDuration?: number;
  preferredWorkoutDays?: number[];
  preferredWorkoutTime?: string;
  dietaryRestrictions?: string[];
  allergies?: string[];
  medicalConditions?: string[];
  preferredEquipment?: string[];
  experienceLevel?: 'beginner' | 'intermediate' | 'advanced';
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  type: 'workout' | 'goal' | 'weight' | 'food' | 'system' | 'other';
  data?: any;
};

export type ThemeSettings = {
  mode: 'light' | 'dark' | 'system';
  primaryColor?: string;
  secondaryColor?: string;
  fontFamily?: string;
};

export type AppSettings = {
  units: {
    weight: 'kg' | 'lb';
    height: 'cm' | 'ft';
    distance: 'km' | 'mi';
  };
  notifications: {
    workoutReminders: boolean;
    goalReminders: boolean;
    weightReminders: boolean;
    waterReminders: boolean;
    progressPhotos: boolean;
  };
  privacy: {
    shareWorkouts: boolean;
    shareProgress: boolean;
    allowDataCollection: boolean;
    allowPersonalization: boolean;
  };
  display: {
    showCalories: boolean;
    showMacros: boolean;
    showWeight: boolean;
  };
};