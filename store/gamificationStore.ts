import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useWorkoutStore } from "./workoutStore";
import { useHealthStore } from "./healthStore";

export type AchievementCategory = 
  | "workout" 
  | "nutrition" 
  | "weight" 
  | "steps" 
  | "streak" 
  | "special";

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  tier: AchievementTier;
  progress: number;
  target: number;
  completed: boolean;
  dateCompleted?: string;
  points: number;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  target: number;
  progress: number;
  completed: boolean;
  category: AchievementCategory;
  points: number;
  reward?: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string;
  streakDates: string[];
}

export interface Level {
  level: number;
  title: string;
  minPoints: number;
  maxPoints: number;
  icon: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  cost: number;
  icon: string;
  unlocked: boolean;
  dateUnlocked?: string;
  used: boolean;
  dateUsed?: string;
  category: "nutrition" | "workout" | "rest" | "special";
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  points: number;
  category: AchievementCategory;
}

interface GamificationState {
  // Core state
  gamificationEnabled: boolean;
  onboardingCompleted: boolean;
  achievements: Achievement[];
  unlockedAchievements: Achievement[];
  challenges: Challenge[];
  activeChallenge: Challenge | null;
  streak: Streak;
  points: number;
  level: number;
  rewards: Reward[];
  dailyQuests: DailyQuest[];
  recentlyUnlocked: Achievement[];
  showCelebration: boolean;
  celebrationAchievement: Achievement | null;
  
  // Actions
  toggleGamification: (enabled: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  initializeAchievements: () => void;
  checkAchievements: () => void;
  unlockAchievement: (achievementId: string) => void;
  updateAchievementProgress: (achievementId: string, progress: number) => void;
  
  startChallenge: (challenge: Challenge) => void;
  completeChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;
  
  updateStreak: () => void;
  resetStreak: () => void;
  
  addPoints: (points: number) => void;
  calculateLevel: (points: number) => number;
  
  unlockReward: (rewardId: string) => void;
  useReward: (rewardId: string) => void;
  
  generateDailyQuests: () => void;
  completeDailyQuest: (questId: string) => void;
  
  clearCelebration: () => void;
  
  // Getters
  getAchievementsByCategory: (category: AchievementCategory) => Achievement[];
  getRecentAchievements: (count: number) => Achievement[];
  getNextAchievements: (count: number) => Achievement[];
  getCurrentLevel: () => Level;
  getNextLevel: () => Level;
  getLevelProgress: () => number;
  getAvailableRewards: () => Reward[];
  getActiveDailyQuests: () => DailyQuest[];
  getStreakInfo: () => { 
    currentStreak: number; 
    longestStreak: number;
    nextMilestone: number;
    daysToNextReward: number;
  };
}

// Define levels
const levels: Level[] = [
  { level: 1, title: "Beginner", minPoints: 0, maxPoints: 99, icon: "🌱" },
  { level: 2, title: "Rookie", minPoints: 100, maxPoints: 249, icon: "🔰" },
  { level: 3, title: "Enthusiast", minPoints: 250, maxPoints: 499, icon: "⭐" },
  { level: 4, title: "Athlete", minPoints: 500, maxPoints: 999, icon: "🏃" },
  { level: 5, title: "Pro", minPoints: 1000, maxPoints: 1999, icon: "🏆" },
  { level: 6, title: "Champion", minPoints: 2000, maxPoints: 3499, icon: "🥇" },
  { level: 7, title: "Elite", minPoints: 3500, maxPoints: 4999, icon: "💪" },
  { level: 8, title: "Master", minPoints: 5000, maxPoints: 7499, icon: "🌟" },
  { level: 9, title: "Legend", minPoints: 7500, maxPoints: 9999, icon: "👑" },
  { level: 10, title: "Fitness Guru", minPoints: 10000, maxPoints: Infinity, icon: "🔱" },
];

// Define default achievements
const defaultAchievements: Achievement[] = [
  // Workout achievements
  {
    id: "workout-first",
    title: "First Step",
    description: "Complete your first workout",
    category: "workout",
    icon: "🏋️",
    tier: "bronze",
    progress: 0,
    target: 1,
    completed: false,
    points: 10
  },
  {
    id: "workout-5",
    title: "Getting Started",
    description: "Complete 5 workouts",
    category: "workout",
    icon: "🏋️",
    tier: "bronze",
    progress: 0,
    target: 5,
    completed: false,
    points: 25
  },
  {
    id: "workout-10",
    title: "Dedicated",
    description: "Complete 10 workouts",
    category: "workout",
    icon: "🏋️",
    tier: "silver",
    progress: 0,
    target: 10,
    completed: false,
    points: 50
  },
  {
    id: "workout-25",
    title: "Fitness Enthusiast",
    description: "Complete 25 workouts",
    category: "workout",
    icon: "🏋️",
    tier: "gold",
    progress: 0,
    target: 25,
    completed: false,
    points: 100
  },
  {
    id: "workout-50",
    title: "Fitness Addict",
    description: "Complete 50 workouts",
    category: "workout",
    icon: "🏋️",
    tier: "platinum",
    progress: 0,
    target: 50,
    completed: false,
    points: 200
  },
  {
    id: "workout-100",
    title: "Century Club",
    description: "Complete 100 workouts",
    category: "workout",
    icon: "🏋️",
    tier: "diamond",
    progress: 0,
    target: 100,
    completed: false,
    points: 500
  },
  {
    id: "workout-200",
    title: "Double Century",
    description: "Complete 200 workouts",
    category: "workout",
    icon: "🏋️‍♂️",
    tier: "diamond",
    progress: 0,
    target: 200,
    completed: false,
    points: 1000
  },
  {
    id: "workout-365",
    title: "Year-Round Athlete",
    description: "Complete 365 workouts",
    category: "workout",
    icon: "📅",
    tier: "diamond",
    progress: 0,
    target: 365,
    completed: false,
    points: 1500
  },
  {
    id: "workout-strength-10",
    title: "Strength Builder",
    description: "Complete 10 strength workouts",
    category: "workout",
    icon: "💪",
    tier: "bronze",
    progress: 0,
    target: 10,
    completed: false,
    points: 50
  },
  {
    id: "workout-strength-50",
    title: "Strength Master",
    description: "Complete 50 strength workouts",
    category: "workout",
    icon: "💪",
    tier: "gold",
    progress: 0,
    target: 50,
    completed: false,
    points: 200
  },
  {
    id: "workout-cardio-10",
    title: "Cardio Starter",
    description: "Complete 10 cardio workouts",
    category: "workout",
    icon: "🏃‍♀️",
    tier: "bronze",
    progress: 0,
    target: 10,
    completed: false,
    points: 50
  },
  {
    id: "workout-cardio-50",
    title: "Cardio King",
    description: "Complete 50 cardio workouts",
    category: "workout",
    icon: "🏃‍♀️",
    tier: "gold",
    progress: 0,
    target: 50,
    completed: false,
    points: 200
  },
  {
    id: "workout-flexibility-10",
    title: "Flexibility Focus",
    description: "Complete 10 flexibility workouts",
    category: "workout",
    icon: "🧘‍♀️",
    tier: "bronze",
    progress: 0,
    target: 10,
    completed: false,
    points: 50
  },
  {
    id: "workout-flexibility-30",
    title: "Flexibility Master",
    description: "Complete 30 flexibility workouts",
    category: "workout",
    icon: "🧘‍♀️",
    tier: "gold",
    progress: 0,
    target: 30,
    completed: false,
    points: 150
  },
  {
    id: "workout-duration-30",
    title: "Half Hour Hero",
    description: "Complete a workout lasting at least 30 minutes",
    category: "workout",
    icon: "⏱️",
    tier: "bronze",
    progress: 0,
    target: 1,
    completed: false,
    points: 15
  },
  {
    id: "workout-duration-60",
    title: "Hour of Power",
    description: "Complete a workout lasting at least 60 minutes",
    category: "workout",
    icon: "⏱️",
    tier: "silver",
    progress: 0,
    target: 1,
    completed: false,
    points: 30
  },
  {
    id: "workout-duration-90",
    title: "Endurance Champion",
    description: "Complete a workout lasting at least 90 minutes",
    category: "workout",
    icon: "⏱️",
    tier: "gold",
    progress: 0,
    target: 1,
    completed: false,
    points: 60
  },
  {
    id: "workout-variety-5",
    title: "Variety Seeker",
    description: "Complete 5 different types of workouts",
    category: "workout",
    icon: "🔄",
    tier: "silver",
    progress: 0,
    target: 5,
    completed: false,
    points: 75
  },
  {
    id: "workout-variety-10",
    title: "Jack of All Trades",
    description: "Complete 10 different types of workouts",
    category: "workout",
    icon: "🔄",
    tier: "gold",
    progress: 0,
    target: 10,
    completed: false,
    points: 150
  },
  {
    id: "workout-early-bird",
    title: "Early Bird",
    description: "Complete 5 workouts before 8 AM",
    category: "workout",
    icon: "🌅",
    tier: "silver",
    progress: 0,
    target: 5,
    completed: false,
    points: 75
  },
  {
    id: "workout-night-owl",
    title: "Night Owl",
    description: "Complete 5 workouts after 8 PM",
    category: "workout",
    icon: "🌙",
    tier: "silver",
    progress: 0,
    target: 5,
    completed: false,
    points: 75
  },
  {
    id: "workout-weekend-warrior",
    title: "Weekend Warrior",
    description: "Complete 10 workouts on weekends",
    category: "workout",
    icon: "📅",
    tier: "silver",
    progress: 0,
    target: 10,
    completed: false,
    points: 100
  },
  
  // Streak achievements
  {
    id: "streak-3",
    title: "Habit Forming",
    description: "Maintain a 3-day workout streak",
    category: "streak",
    icon: "🔥",
    tier: "bronze",
    progress: 0,
    target: 3,
    completed: false,
    points: 30
  },
  {
    id: "streak-7",
    title: "Week Warrior",
    description: "Maintain a 7-day workout streak",
    category: "streak",
    icon: "🔥",
    tier: "silver",
    progress: 0,
    target: 7,
    completed: false,
    points: 70
  },
  {
    id: "streak-14",
    title: "Consistent Athlete",
    description: "Maintain a 14-day workout streak",
    category: "streak",
    icon: "🔥",
    tier: "gold",
    progress: 0,
    target: 14,
    completed: false,
    points: 140
  },
  {
    id: "streak-30",
    title: "Unstoppable",
    description: "Maintain a 30-day workout streak",
    category: "streak",
    icon: "🔥",
    tier: "platinum",
    progress: 0,
    target: 30,
    completed: false,
    points: 300
  },
  {
    id: "streak-45",
    title: "Dedication Personified",
    description: "Maintain a 45-day workout streak",
    category: "streak",
    icon: "🔥",
    tier: "platinum",
    progress: 0,
    target: 45,
    completed: false,
    points: 450
  },
  {
    id: "streak-60",
    title: "Habit Master",
    description: "Maintain a 60-day workout streak",
    category: "streak",
    icon: "🔥",
    tier: "diamond",
    progress: 0,
    target: 60,
    completed: false,
    points: 600
  },
  {
    id: "streak-90",
    title: "Quarterly Champion",
    description: "Maintain a 90-day workout streak",
    category: "streak",
    icon: "🔥",
    tier: "diamond",
    progress: 0,
    target: 90,
    completed: false,
    points: 900
  },
  {
    id: "streak-180",
    title: "Half-Year Hero",
    description: "Maintain a 180-day workout streak",
    category: "streak",
    icon: "🔥",
    tier: "diamond",
    progress: 0,
    target: 180,
    completed: false,
    points: 1800
  },
  {
    id: "streak-365",
    title: "Year of Dedication",
    description: "Maintain a 365-day workout streak",
    category: "streak",
    icon: "🔥",
    tier: "diamond",
    progress: 0,
    target: 365,
    completed: false,
    points: 3650
  },
  {
    id: "streak-comeback",
    title: "Comeback Kid",
    description: "Resume working out after a 7+ day break",
    category: "streak",
    icon: "🔄",
    tier: "silver",
    progress: 0,
    target: 1,
    completed: false,
    points: 50
  },
  {
    id: "streak-3-weeks",
    title: "3-Week Consistency",
    description: "Work out at least 3 times per week for 4 consecutive weeks",
    category: "streak",
    icon: "📊",
    tier: "gold",
    progress: 0,
    target: 4,
    completed: false,
    points: 200
  },
  
  // Weight achievements
  {
    id: "weight-track-7",
    title: "Weight Watcher",
    description: "Track your weight for 7 consecutive days",
    category: "weight",
    icon: "⚖️",
    tier: "bronze",
    progress: 0,
    target: 7,
    completed: false,
    points: 35
  },
  {
    id: "weight-loss-1",
    title: "Progress Begins",
    description: "Lose your first kg",
    category: "weight",
    icon: "📉",
    tier: "bronze",
    progress: 0,
    target: 1,
    completed: false,
    points: 50
  },
  {
    id: "weight-loss-5",
    title: "Visible Progress",
    description: "Lose 5 kg",
    category: "weight",
    icon: "📉",
    tier: "silver",
    progress: 0,
    target: 5,
    completed: false,
    points: 100
  },
  {
    id: "weight-loss-10",
    title: "Transformation",
    description: "Lose 10 kg",
    category: "weight",
    icon: "📉",
    tier: "gold",
    progress: 0,
    target: 10,
    completed: false,
    points: 200
  },
  {
    id: "weight-loss-15",
    title: "Major Transformation",
    description: "Lose 15 kg",
    category: "weight",
    icon: "📉",
    tier: "platinum",
    progress: 0,
    target: 15,
    completed: false,
    points: 300
  },
  {
    id: "weight-loss-20",
    title: "Life-Changing Progress",
    description: "Lose 20 kg",
    category: "weight",
    icon: "📉",
    tier: "diamond",
    progress: 0,
    target: 20,
    completed: false,
    points: 500
  },
  {
    id: "weight-track-30",
    title: "Consistent Tracker",
    description: "Track your weight for 30 consecutive days",
    category: "weight",
    icon: "⚖️",
    tier: "gold",
    progress: 0,
    target: 30,
    completed: false,
    points: 150
  },
  {
    id: "weight-track-90",
    title: "Weight Tracking Pro",
    description: "Track your weight for 90 consecutive days",
    category: "weight",
    icon: "⚖️",
    tier: "platinum",
    progress: 0,
    target: 90,
    completed: false,
    points: 300
  },
  {
    id: "weight-goal-reached",
    title: "Goal Achieved",
    description: "Reach your target weight goal",
    category: "weight",
    icon: "🎯",
    tier: "diamond",
    progress: 0,
    target: 1,
    completed: false,
    points: 500
  },
  {
    id: "weight-maintain-30",
    title: "Maintenance Master",
    description: "Maintain your goal weight for 30 days",
    category: "weight",
    icon: "📊",
    tier: "platinum",
    progress: 0,
    target: 30,
    completed: false,
    points: 300
  },
  {
    id: "weight-maintain-90",
    title: "Lifestyle Change",
    description: "Maintain your goal weight for 90 days",
    category: "weight",
    icon: "📊",
    tier: "diamond",
    progress: 0,
    target: 90,
    completed: false,
    points: 600
  },
  {
    id: "weight-bmi-healthy",
    title: "Healthy Range",
    description: "Achieve a healthy BMI range",
    category: "weight",
    icon: "💚",
    tier: "gold",
    progress: 0,
    target: 1,
    completed: false,
    points: 250
  },
  
  // Steps achievements
  {
    id: "steps-5000",
    title: "Step Starter",
    description: "Walk 5,000 steps in a day",
    category: "steps",
    icon: "👣",
    tier: "bronze",
    progress: 0,
    target: 5000,
    completed: false,
    points: 20
  },
  {
    id: "steps-10000",
    title: "Step Master",
    description: "Walk 10,000 steps in a day",
    category: "steps",
    icon: "👣",
    tier: "silver",
    progress: 0,
    target: 10000,
    completed: false,
    points: 40
  },
  {
    id: "steps-15000",
    title: "Step Champion",
    description: "Walk 15,000 steps in a day",
    category: "steps",
    icon: "👣",
    tier: "gold",
    progress: 0,
    target: 15000,
    completed: false,
    points: 60
  },
  {
    id: "steps-100k",
    title: "Step Enthusiast",
    description: "Walk 100,000 steps in a week",
    category: "steps",
    icon: "👣",
    tier: "platinum",
    progress: 0,
    target: 100000,
    completed: false,
    points: 150
  },
  {
    id: "steps-20000",
    title: "Step Legend",
    description: "Walk 20,000 steps in a day",
    category: "steps",
    icon: "👣",
    tier: "platinum",
    progress: 0,
    target: 20000,
    completed: false,
    points: 100
  },
  {
    id: "steps-25000",
    title: "Step Superstar",
    description: "Walk 25,000 steps in a day",
    category: "steps",
    icon: "👣",
    tier: "diamond",
    progress: 0,
    target: 25000,
    completed: false,
    points: 150
  },
  {
    id: "steps-30000",
    title: "Walking Machine",
    description: "Walk 30,000 steps in a day",
    category: "steps",
    icon: "👣",
    tier: "diamond",
    progress: 0,
    target: 30000,
    completed: false,
    points: 200
  },
  {
    id: "steps-250k",
    title: "Step Maniac",
    description: "Walk 250,000 steps in a month",
    category: "steps",
    icon: "👣",
    tier: "platinum",
    progress: 0,
    target: 250000,
    completed: false,
    points: 300
  },
  {
    id: "steps-500k",
    title: "Step Millionaire",
    description: "Walk 500,000 steps in a month",
    category: "steps",
    icon: "👣",
    tier: "diamond",
    progress: 0,
    target: 500000,
    completed: false,
    points: 500
  },
  {
    id: "steps-1m",
    title: "Million Step Club",
    description: "Walk 1,000,000 steps total",
    category: "steps",
    icon: "👣",
    tier: "diamond",
    progress: 0,
    target: 1000000,
    completed: false,
    points: 1000
  },
  {
    id: "steps-streak-7",
    title: "Step Streak",
    description: "Walk at least 8,000 steps for 7 consecutive days",
    category: "steps",
    icon: "📊",
    tier: "silver",
    progress: 0,
    target: 7,
    completed: false,
    points: 100
  },
  {
    id: "steps-streak-30",
    title: "Step Consistency",
    description: "Walk at least 8,000 steps for 30 consecutive days",
    category: "steps",
    icon: "📊",
    tier: "platinum",
    progress: 0,
    target: 30,
    completed: false,
    points: 300
  },
  {
    id: "steps-weekend-50k",
    title: "Weekend Walker",
    description: "Walk 50,000 steps in a single weekend",
    category: "steps",
    icon: "🏞️",
    tier: "gold",
    progress: 0,
    target: 50000,
    completed: false,
    points: 150
  },
  
  // Nutrition achievements
  {
    id: "nutrition-log-first",
    title: "Nutrition Aware",
    description: "Log your first meal",
    category: "nutrition",
    icon: "🍎",
    tier: "bronze",
    progress: 0,
    target: 1,
    completed: false,
    points: 10
  },
  {
    id: "nutrition-log-week",
    title: "Nutrition Tracker",
    description: "Log all meals for 7 consecutive days",
    category: "nutrition",
    icon: "🍎",
    tier: "silver",
    progress: 0,
    target: 7,
    completed: false,
    points: 70
  },
  {
    id: "nutrition-protein-goal",
    title: "Protein Pro",
    description: "Meet your protein goal for 5 consecutive days",
    category: "nutrition",
    icon: "🥩",
    tier: "gold",
    progress: 0,
    target: 5,
    completed: false,
    points: 50
  },
  {
    id: "nutrition-log-month",
    title: "Nutrition Expert",
    description: "Log all meals for 30 consecutive days",
    category: "nutrition",
    icon: "🍎",
    tier: "platinum",
    progress: 0,
    target: 30,
    completed: false,
    points: 300
  },
  {
    id: "nutrition-balanced-10",
    title: "Balanced Diet",
    description: "Maintain balanced macros for 10 days",
    category: "nutrition",
    icon: "⚖️",
    tier: "gold",
    progress: 0,
    target: 10,
    completed: false,
    points: 100
  },
  {
    id: "nutrition-water-2l",
    title: "Hydration Starter",
    description: "Drink 2L of water daily for 7 days",
    category: "nutrition",
    icon: "💧",
    tier: "silver",
    progress: 0,
    target: 7,
    completed: false,
    points: 70
  },
  {
    id: "nutrition-water-3l",
    title: "Hydration Pro",
    description: "Drink 3L of water daily for 7 days",
    category: "nutrition",
    icon: "💧",
    tier: "gold",
    progress: 0,
    target: 7,
    completed: false,
    points: 100
  },
  {
    id: "nutrition-calorie-goal",
    title: "Calorie Controller",
    description: "Stay within your calorie goal for 14 days",
    category: "nutrition",
    icon: "🔢",
    tier: "platinum",
    progress: 0,
    target: 14,
    completed: false,
    points: 150
  },
  {
    id: "nutrition-variety",
    title: "Nutrition Variety",
    description: "Log 30 different foods in a week",
    category: "nutrition",
    icon: "🥗",
    tier: "gold",
    progress: 0,
    target: 30,
    completed: false,
    points: 100
  },
  {
    id: "nutrition-photo-10",
    title: "Food Photographer",
    description: "Take 10 food photos",
    category: "nutrition",
    icon: "📸",
    tier: "silver",
    progress: 0,
    target: 10,
    completed: false,
    points: 50
  },
  
  // Special achievements
  {
    id: "special-first-photo",
    title: "Progress Documented",
    description: "Take your first progress photo",
    category: "special",
    icon: "📸",
    tier: "bronze",
    progress: 0,
    target: 1,
    completed: false,
    points: 15
  },
  {
    id: "special-all-goals",
    title: "Goal Getter",
    description: "Set goals in all categories",
    category: "special",
    icon: "🎯",
    tier: "silver",
    progress: 0,
    target: 1,
    completed: false,
    points: 30
  },
  {
    id: "special-first-ai",
    title: "AI Assistant",
    description: "Use the AI assistant for the first time",
    category: "special",
    icon: "🤖",
    tier: "bronze",
    progress: 0,
    target: 1,
    completed: false,
    points: 10
  },
  {
    id: "special-photo-series",
    title: "Transformation Journey",
    description: "Take progress photos for 8 consecutive weeks",
    category: "special",
    icon: "📸",
    tier: "gold",
    progress: 0,
    target: 8,
    completed: false,
    points: 100
  },
  {
    id: "special-all-features",
    title: "Power User",
    description: "Use all main features of the app",
    category: "special",
    icon: "🔍",
    tier: "gold",
    progress: 0,
    target: 1,
    completed: false,
    points: 100
  },
  {
    id: "special-share-progress",
    title: "Social Sharer",
    description: "Share your progress on social media",
    category: "special",
    icon: "📱",
    tier: "silver",
    progress: 0,
    target: 1,
    completed: false,
    points: 25
  },
  {
    id: "special-first-pr",
    title: "Personal Best",
    description: "Set your first personal record",
    category: "special",
    icon: "🏅",
    tier: "silver",
    progress: 0,
    target: 1,
    completed: false,
    points: 50
  },
  {
    id: "special-5-pr",
    title: "Record Breaker",
    description: "Set 5 personal records",
    category: "special",
    icon: "🏅",
    tier: "gold",
    progress: 0,
    target: 5,
    completed: false,
    points: 100
  },
  {
    id: "special-10-pr",
    title: "Record Collector",
    description: "Set 10 personal records",
    category: "special",
    icon: "🏅",
    tier: "platinum",
    progress: 0,
    target: 10,
    completed: false,
    points: 200
  },
  {
    id: "special-complete-profile",
    title: "Identity Established",
    description: "Complete your user profile",
    category: "special",
    icon: "👤",
    tier: "bronze",
    progress: 0,
    target: 1,
    completed: false,
    points: 20
  },
  {
    id: "special-feedback",
    title: "App Improver",
    description: "Provide feedback on the app",
    category: "special",
    icon: "💬",
    tier: "bronze",
    progress: 0,
    target: 1,
    completed: false,
    points: 15
  },
  {
    id: "special-night-owl",
    title: "Night Owl",
    description: "Use the app after midnight for 5 days",
    category: "special",
    icon: "🦉",
    tier: "silver",
    progress: 0,
    target: 5,
    completed: false,
    points: 50
  },
  {
    id: "special-early-bird",
    title: "Early Bird",
    description: "Use the app before 6 AM for 5 days",
    category: "special",
    icon: "🐦",
    tier: "silver",
    progress: 0,
    target: 5,
    completed: false,
    points: 50
  },
  {
    id: "special-app-anniversary",
    title: "App Anniversary",
    description: "Use the app for 365 days",
    category: "special",
    icon: "🎂",
    tier: "diamond",
    progress: 0,
    target: 365,
    completed: false,
    points: 500
  }
];

// Define default rewards
const defaultRewards: Reward[] = [
  {
    id: "reward-cheat-day",
    title: "Cheat Day",
    description: "Enjoy a guilt-free cheat day after 5 workouts in a week",
    cost: 200,
    icon: "🍕",
    unlocked: false,
    used: false,
    category: "nutrition"
  },
  {
    id: "reward-rest-day",
    title: "Guilt-Free Rest Day",
    description: "Take an extra rest day without breaking your streak",
    cost: 150,
    icon: "😴",
    unlocked: false,
    used: false,
    category: "rest"
  },
  {
    id: "reward-custom-workout",
    title: "AI Workout Plan",
    description: "Get a personalized AI workout plan based on your goals",
    cost: 300,
    icon: "🤖",
    unlocked: false,
    used: false,
    category: "workout"
  },
  {
    id: "reward-nutrition-plan",
    title: "Custom Nutrition Plan",
    description: "Unlock a personalized nutrition plan for your goals",
    cost: 350,
    icon: "🥗",
    unlocked: false,
    used: false,
    category: "nutrition"
  },
  {
    id: "reward-dark-theme",
    title: "Dark Theme",
    description: "Unlock the premium dark theme",
    cost: 100,
    icon: "🌙",
    unlocked: false,
    used: false,
    category: "special"
  }
];

// Define default challenges
const defaultChallenges: Challenge[] = [
  {
    id: "challenge-week-workouts",
    title: "Weekly Warrior",
    description: "Complete 4 workouts this week",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    target: 4,
    progress: 0,
    completed: false,
    category: "workout",
    points: 100,
    reward: "50 bonus points"
  },
  {
    id: "challenge-steps",
    title: "Step Challenge",
    description: "Walk 50,000 steps this week",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    target: 50000,
    progress: 0,
    completed: false,
    category: "steps",
    points: 150,
    reward: "Cheat Day Reward"
  },
  {
    id: "challenge-month-streak",
    title: "Monthly Consistency",
    description: "Work out 20 days this month",
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    target: 20,
    progress: 0,
    completed: false,
    category: "streak",
    points: 300,
    reward: "Custom Workout Plan"
  }
];

// Helper function to generate daily quests
const generateDefaultDailyQuests = (): DailyQuest[] => {
  const today = new Date().toISOString();
  
  return [
    {
      id: `quest-workout-${Date.now()}`,
      title: "Daily Workout",
      description: "Complete at least one workout today",
      completed: false,
      date: today,
      points: 20,
      category: "workout"
    },
    {
      id: `quest-steps-${Date.now()}`,
      title: "Step Goal",
      description: "Reach 8,000 steps today",
      completed: false,
      date: today,
      points: 15,
      category: "steps"
    },
    {
      id: `quest-water-${Date.now()}`,
      title: "Stay Hydrated",
      description: "Log at least 2L of water today",
      completed: false,
      date: today,
      points: 10,
      category: "nutrition"
    },
    {
      id: `quest-protein-${Date.now()}`,
      title: "Protein Goal",
      description: "Meet your protein goal for today",
      completed: false,
      date: today,
      points: 15,
      category: "nutrition"
    }
  ];
};

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      // New state for gamification toggle
      gamificationEnabled: true,
      onboardingCompleted: false,
      achievements: [...defaultAchievements],
      unlockedAchievements: [],
      challenges: [...defaultChallenges],
      activeChallenge: null,
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastWorkoutDate: "",
        streakDates: []
      },
      points: 0,
      level: 1,
      rewards: [...defaultRewards],
      dailyQuests: generateDefaultDailyQuests(),
      recentlyUnlocked: [],
      showCelebration: false,
      celebrationAchievement: null,
      
      // New action to toggle gamification
      toggleGamification: (enabled) => set({ gamificationEnabled: enabled }),
      
      // New action to set onboarding completed
      setOnboardingCompleted: (completed) => set({ onboardingCompleted: completed }),
      
      initializeAchievements: () => {
        // Skip initialization if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        // This function is called when the app starts
        // It checks if achievements need to be updated based on existing data
        const { checkAchievements, generateDailyQuests, updateStreak } = get();
        
        // Check if we need to generate new daily quests
        const { dailyQuests } = get();
        if (dailyQuests.length === 0 || 
            new Date(dailyQuests[0].date).toDateString() !== new Date().toDateString()) {
          generateDailyQuests();
        }
        
        // Update streak information
        updateStreak();
        
        // Check achievements based on existing data
        checkAchievements();
      },
      
      checkAchievements: () => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        const { achievements, updateAchievementProgress, unlockAchievement } = get();
        const workoutStore = useWorkoutStore.getState();
        const healthStore = useHealthStore.getState();
        
        // Check workout achievements
        const completedWorkouts = workoutStore.workoutLogs.filter(log => log.completed).length;
        
        achievements.forEach(achievement => {
          let progress = 0;
          
          switch (achievement.id) {
            // Workout achievements
            case "workout-first":
            case "workout-5":
            case "workout-10":
            case "workout-25":
            case "workout-50":
            case "workout-100":
            case "workout-200":
            case "workout-365":
              progress = completedWorkouts;
              break;
              
            // Workout type achievements
            case "workout-strength-10":
            case "workout-strength-50":
              const strengthWorkouts = workoutStore.workoutLogs.filter(
                log => log.completed && log.type === "strength"
              ).length;
              progress = strengthWorkouts;
              break;
              
            case "workout-cardio-10":
            case "workout-cardio-50":
              const cardioWorkouts = workoutStore.workoutLogs.filter(
                log => log.completed && log.type === "cardio"
              ).length;
              progress = cardioWorkouts;
              break;
              
            case "workout-flexibility-10":
            case "workout-flexibility-30":
              const flexibilityWorkouts = workoutStore.workoutLogs.filter(
                log => log.completed && log.type === "flexibility"
              ).length;
              progress = flexibilityWorkouts;
              break;
              
            // Workout duration achievements
            case "workout-duration-30":
            case "workout-duration-60":
            case "workout-duration-90":
              // These would need to be checked when a workout is completed
              // based on the duration of the workout
              break;
              
            // Workout variety achievements
            case "workout-variety-5":
            case "workout-variety-10":
              const uniqueWorkoutTypes = new Set(
                workoutStore.workoutLogs
                  .filter(log => log.completed)
                  .map(log => log.name)
              ).size;
              progress = uniqueWorkoutTypes;
              break;
              
            // Time-based workout achievements
            case "workout-early-bird":
              const earlyWorkouts = workoutStore.workoutLogs.filter(log => {
                if (!log.completed) return false;
                const workoutTime = new Date(log.date);
                return workoutTime.getHours() < 8;
              }).length;
              progress = earlyWorkouts;
              break;
              
            case "workout-night-owl":
              const nightWorkouts = workoutStore.workoutLogs.filter(log => {
                if (!log.completed) return false;
                const workoutTime = new Date(log.date);
                return workoutTime.getHours() >= 20;
              }).length;
              progress = nightWorkouts;
              break;
              
            case "workout-weekend-warrior":
              const weekendWorkouts = workoutStore.workoutLogs.filter(log => {
                if (!log.completed) return false;
                const workoutDay = new Date(log.date).getDay();
                return workoutDay === 0 || workoutDay === 6; // Sunday or Saturday
              }).length;
              progress = weekendWorkouts;
              break;
              
            // Streak achievements
            case "streak-3":
            case "streak-7":
            case "streak-14":
            case "streak-30":
            case "streak-45":
            case "streak-60":
            case "streak-90":
            case "streak-180":
            case "streak-365":
              progress = get().streak.currentStreak;
              break;
              
            // Streak comeback achievement
            case "streak-comeback":
              // This would need special handling when a user resumes after a break
              break;
              
            // Weekly consistency achievement
            case "streak-3-weeks":
              // This would need special tracking of weekly workout counts
              break;
              
            // Weight achievements
            case "weight-track-7":
            case "weight-track-30":
            case "weight-track-90": {
              // Count consecutive days of weight tracking
              const weightLogsTrack = healthStore.weightLogs;
              if (weightLogsTrack.length > 0) {
                const sortedLogs = [...weightLogsTrack].sort(
                  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                
                let consecutiveDays = 1;
                let currentDate = new Date(sortedLogs[0].date);
                
                for (let i = 1; i < sortedLogs.length; i++) {
                  const prevDate = new Date(sortedLogs[i].date);
                  const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                  
                  if (diffDays === 1) {
                    consecutiveDays++;
                    currentDate = prevDate;
                  } else {
                    break;
                  }
                }
                
                progress = consecutiveDays;
              }
              break;
            }
              
            case "weight-loss-1":
            case "weight-loss-5":
            case "weight-loss-10":
            case "weight-loss-15":
            case "weight-loss-20": {
              // Calculate weight loss from first to latest log
              const weightLogsLoss = healthStore.weightLogs;
              if (weightLogsLoss.length >= 2) {
                const sortedLogs = [...weightLogsLoss].sort(
                  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                );
                
                const firstWeight = sortedLogs[0].weight;
                const latestWeight = sortedLogs[sortedLogs.length - 1].weight;
                const weightLoss = Math.max(0, firstWeight - latestWeight);
                
                progress = weightLoss;
              }
              break;
            }
              
            case "weight-goal-reached":
              // This would need to be checked against the user's weight goal
              break;
              
            case "weight-maintain-30":
            case "weight-maintain-90":
              // These would need special tracking of weight maintenance
              break;
              
            case "weight-bmi-healthy":
              // This would need BMI calculation
              break;
              
            // Steps achievements
            case "steps-5000":
            case "steps-10000":
            case "steps-15000":
            case "steps-20000":
            case "steps-25000":
            case "steps-30000":
              // Get today's steps
              const todaySteps = healthStore.getStepsForDate(new Date().toISOString())?.steps || 0;
              progress = todaySteps;
              break;
              
            case "steps-100k":
              // Calculate weekly steps
              const weeklySteps = healthStore.getStepsForWeek()
                .reduce((total, log) => total + log.steps, 0);
              progress = weeklySteps;
              break;
              
            case "steps-250k":
            case "steps-500k":
              // Calculate monthly steps
              const monthlySteps = healthStore.getStepsForMonth()
                .reduce((total, log) => total + log.steps, 0);
              progress = monthlySteps;
              break;
              
            case "steps-1m":
              // Calculate total steps
              const totalSteps = healthStore.stepLogs
                .reduce((total, log) => total + log.steps, 0);
              progress = totalSteps;
              break;
              
            case "steps-streak-7":
            case "steps-streak-30":
              // These would need special tracking of step streaks
              break;
              
            case "steps-weekend-50k":
              // This would need special tracking of weekend steps
              break;
              
            // Special achievements
            case "special-first-photo":
            case "special-photo-series":
              // These would need to be integrated with the photo store
              break;
              
            default:
              // Other achievements will be updated directly from their respective actions
              break;
          }
          
          // Update progress if needed
          if (progress > 0 && progress !== achievement.progress) {
            updateAchievementProgress(achievement.id, progress);
            
            // Check if achievement should be unlocked
            if (progress >= achievement.target && !achievement.completed) {
              unlockAchievement(achievement.id);
            }
          }
        });
      },
      
      unlockAchievement: (achievementId) => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => {
          const achievement = state.achievements.find(a => a.id === achievementId);
          
          if (!achievement || achievement.completed) {
            return state;
          }
          
          // Mark achievement as completed
          const updatedAchievements = state.achievements.map(a => 
            a.id === achievementId 
              ? { ...a, completed: true, dateCompleted: new Date().toISOString() } 
              : a
          );
          
          // Add to unlocked achievements
          const unlockedAchievement = updatedAchievements.find(a => a.id === achievementId)!;
          
          // Add points
          const newPoints = state.points + unlockedAchievement.points;
          
          // Calculate new level
          const newLevel = get().calculateLevel(newPoints);
          
          // Show celebration
          return {
            achievements: updatedAchievements,
            unlockedAchievements: [...state.unlockedAchievements, unlockedAchievement],
            recentlyUnlocked: [...state.recentlyUnlocked, unlockedAchievement],
            points: newPoints,
            level: newLevel,
            showCelebration: true,
            celebrationAchievement: unlockedAchievement
          };
        });
      },
      
      updateAchievementProgress: (achievementId, progress) => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => ({
          achievements: state.achievements.map(a => 
            a.id === achievementId 
              ? { ...a, progress: Math.min(progress, a.target) } 
              : a
          )
        }));
      },
      
      startChallenge: (challenge) => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => ({
          challenges: [...state.challenges, challenge],
          activeChallenge: challenge
        }));
      },
      
      completeChallenge: (challengeId) => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => {
          const challenge = state.challenges.find(c => c.id === challengeId);
          
          if (!challenge || challenge.completed) {
            return state;
          }
          
          // Mark challenge as completed
          const updatedChallenges = state.challenges.map(c => 
            c.id === challengeId 
              ? { ...c, completed: true } 
              : c
          );
          
          // Add points
          const newPoints = state.points + challenge.points;
          
          // Calculate new level
          const newLevel = get().calculateLevel(newPoints);
          
          return {
            challenges: updatedChallenges,
            points: newPoints,
            level: newLevel,
            activeChallenge: null
          };
        });
      },
      
      updateChallengeProgress: (challengeId, progress) => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => {
          const challenge = state.challenges.find(c => c.id === challengeId);
          
          if (!challenge) {
            return state;
          }
          
          const updatedChallenges = state.challenges.map(c => 
            c.id === challengeId 
              ? { 
                  ...c, 
                  progress: Math.min(progress, c.target),
                  completed: progress >= c.target ? true : c.completed
                } 
              : c
          );
          
          // If challenge is completed, add points
          if (progress >= challenge.target && !challenge.completed) {
            const newPoints = state.points + challenge.points;
            const newLevel = get().calculateLevel(newPoints);
            
            return {
              challenges: updatedChallenges,
              points: newPoints,
              level: newLevel,
              activeChallenge: null
            };
          }
          
          return {
            challenges: updatedChallenges
          };
        });
      },
      
      updateStreak: () => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => {
          const workoutStore = useWorkoutStore.getState();
          const workoutLogs = workoutStore.workoutLogs;
          
          if (workoutLogs.length === 0) {
            return state;
          }
          
          // Sort logs by date (newest first)
          const sortedLogs = [...workoutLogs]
            .filter(log => log.completed)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          if (sortedLogs.length === 0) {
            return state;
          }
          
          const lastWorkoutDate = new Date(sortedLogs[0].date);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          
          // Check if last workout was today or yesterday
          const lastWorkoutDay = new Date(lastWorkoutDate);
          lastWorkoutDay.setHours(0, 0, 0, 0);
          
          const isToday = lastWorkoutDay.getTime() === today.getTime();
          const isYesterday = lastWorkoutDay.getTime() === yesterday.getTime();
          
          // Get unique workout dates
          const workoutDates = new Set<string>();
          sortedLogs.forEach(log => {
            const date = new Date(log.date);
            workoutDates.add(date.toDateString());
          });
          
          // Convert to array and sort
          const streakDates = Array.from(workoutDates).sort((a, b) => 
            new Date(b).getTime() - new Date(a).getTime()
          );
          
          // Calculate current streak
          let currentStreak = 0;
          
          if (isToday || isYesterday) {
            currentStreak = 1; // Start with today or yesterday
            
            // Check consecutive days
            const checkDate = isToday ? yesterday : new Date(yesterday);
            checkDate.setDate(checkDate.getDate() - 1);
            
            while (true) {
              const dateString = checkDate.toDateString();
              if (streakDates.includes(dateString)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
              } else {
                break;
              }
            }
          }
          
          // Update longest streak if needed
          const longestStreak = Math.max(state.streak.longestStreak, currentStreak);
          
          return {
            streak: {
              currentStreak,
              longestStreak,
              lastWorkoutDate: sortedLogs[0].date,
              streakDates
            }
          };
        });
      },
      
      resetStreak: () => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set({
          streak: {
            currentStreak: 0,
            longestStreak: 0,
            lastWorkoutDate: "",
            streakDates: []
          }
        });
      },
      
      addPoints: (points) => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => {
          const newPoints = state.points + points;
          const newLevel = get().calculateLevel(newPoints);
          
          return {
            points: newPoints,
            level: newLevel
          };
        });
      },
      
      calculateLevel: (points) => {
        for (let i = 0; i < levels.length; i++) {
          if (points >= levels[i].minPoints && points <= levels[i].maxPoints) {
            return levels[i].level;
          }
        }
        return levels[levels.length - 1].level;
      },
      
      unlockReward: (rewardId) => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => {
          const reward = state.rewards.find(r => r.id === rewardId);
          
          if (!reward || reward.unlocked) {
            return state;
          }
          
          // Check if user has enough points
          if (state.points < reward.cost) {
            return state;
          }
          
          // Unlock reward and deduct points
          return {
            rewards: state.rewards.map(r => 
              r.id === rewardId 
                ? { ...r, unlocked: true, dateUnlocked: new Date().toISOString() } 
                : r
            ),
            points: state.points - reward.cost
          };
        });
      },
      
      useReward: (rewardId) => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => ({
          rewards: state.rewards.map(r => 
            r.id === rewardId 
              ? { ...r, used: true, dateUsed: new Date().toISOString() } 
              : r
          )
        }));
      },
      
      generateDailyQuests: () => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set({
          dailyQuests: generateDefaultDailyQuests()
        });
      },
      
      completeDailyQuest: (questId) => {
        // Skip if gamification is disabled
        if (!get().gamificationEnabled) return;
        
        set(state => {
          const quest = state.dailyQuests.find(q => q.id === questId);
          
          if (!quest || quest.completed) {
            return state;
          }
          
          // Mark quest as completed and add points
          return {
            dailyQuests: state.dailyQuests.map(q => 
              q.id === questId ? { ...q, completed: true } : q
            ),
            points: state.points + quest.points
          };
        });
      },
      
      clearCelebration: () => set({
        showCelebration: false,
        celebrationAchievement: null
      }),
      
      getAchievementsByCategory: (category) => {
        const { achievements } = get();
        return achievements.filter(a => a.category === category);
      },
      
      getRecentAchievements: (count) => {
        const { unlockedAchievements } = get();
        
        return [...unlockedAchievements]
          .sort((a, b) => {
            if (!a.dateCompleted || !b.dateCompleted) return 0;
            return new Date(b.dateCompleted).getTime() - new Date(a.dateCompleted).getTime();
          })
          .slice(0, count);
      },
      
      getNextAchievements: (count) => {
        const { achievements } = get();
        
        // Get incomplete achievements with some progress
        const inProgress = achievements
          .filter(a => !a.completed && a.progress > 0)
          .sort((a, b) => (b.progress / b.target) - (a.progress / a.target));
        
        // Get incomplete achievements with no progress
        const notStarted = achievements
          .filter(a => !a.completed && a.progress === 0);
        
        return [...inProgress, ...notStarted].slice(0, count);
      },
      
      getCurrentLevel: () => {
        const { level } = get();
        return levels.find(l => l.level === level) || levels[0];
      },
      
      getNextLevel: () => {
        const { level } = get();
        return levels.find(l => l.level === level + 1) || levels[levels.length - 1];
      },
      
      getLevelProgress: () => {
        const { points, level } = get();
        const currentLevel = levels.find(l => l.level === level) || levels[0];
        const nextLevel = levels.find(l => l.level === level + 1) || levels[levels.length - 1];
        
        const pointsInLevel = points - currentLevel.minPoints;
        const pointsToNextLevel = nextLevel.minPoints - currentLevel.minPoints;
        
        return Math.min(100, Math.floor((pointsInLevel / pointsToNextLevel) * 100));
      },
      
      getAvailableRewards: () => {
        const { rewards, points } = get();
        
        return rewards.filter(r => !r.unlocked && points >= r.cost);
      },
      
      getActiveDailyQuests: () => {
        const { dailyQuests, gamificationEnabled } = get();
        
        // Return empty array if gamification is disabled
        if (!gamificationEnabled) return [];
        
        const today = new Date().toDateString();
        
        return dailyQuests.filter(q => 
          new Date(q.date).toDateString() === today && !q.completed
        );
      },
      
      getStreakInfo: () => {
        const { streak } = get();
        
        // Calculate next milestone
        let nextMilestone = 0;
        if (streak.currentStreak < 3) nextMilestone = 3;
        else if (streak.currentStreak < 7) nextMilestone = 7;
        else if (streak.currentStreak < 14) nextMilestone = 14;
        else if (streak.currentStreak < 30) nextMilestone = 30;
        else if (streak.currentStreak < 45) nextMilestone = 45;
        else if (streak.currentStreak < 60) nextMilestone = 60;
        else if (streak.currentStreak < 90) nextMilestone = 90;
        else if (streak.currentStreak < 180) nextMilestone = 180;
        else if (streak.currentStreak < 365) nextMilestone = 365;
        else nextMilestone = Math.ceil(streak.currentStreak / 30) * 30;
        
        // Calculate days to next reward
        const daysToNextReward = nextMilestone - streak.currentStreak;
        
        return {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          nextMilestone,
          daysToNextReward
        };
      }
    }),
    {
      name: "gamification-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);