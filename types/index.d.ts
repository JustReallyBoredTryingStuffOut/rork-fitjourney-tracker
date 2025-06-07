// Add this to your existing types file

export interface MacroGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  imageUrl?: string;
  quantity?: string;
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
  notes: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  mealTime: string;
  foodItems?: FoodItem[];
  foodItemId?: string;
  foodName?: string;
  servingSize?: string;
  quantity?: number;
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
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  imageUrl: string;
  ingredients: string[];
  preparationTime: number; // in minutes
  dietaryRestrictions: string[]; // e.g., "vegan", "gluten-free", etc.
}