import { Workout, WorkoutExercise, Exercise } from "@/types";
import { findAndCreateWorkoutExercise } from "./workoutValidation";

/**
 * Creates a new workout with proper validation
 */
export function createWorkout(
  id: string,
  name: string,
  description: string,
  exercises: Exercise[],
  exerciseConfigs: Array<{
    exerciseName: string;
    sets: number;
    reps: number;
    restTime?: number;
    duration?: number;
  }>,
  options: {
    duration?: number;
    estimatedDuration?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
    intensity?: 'low' | 'medium' | 'high';
    imageUrl?: string;
  } = {}
): Workout {
  const workoutExercises: WorkoutExercise[] = exerciseConfigs.map(config => 
    findAndCreateWorkoutExercise(
      exercises,
      config.exerciseName,
      0, // fallback index
      config.sets,
      config.reps,
      config.restTime || 60,
      config.duration
    )
  );

  return {
    id,
    name,
    description,
    exercises: workoutExercises,
    duration: options.duration || workoutExercises.length * 5, // Estimate 5 min per exercise
    estimatedDuration: options.estimatedDuration || workoutExercises.length * 5,
    difficulty: options.difficulty || 'intermediate',
    category: options.category || 'Strength',
    intensity: options.intensity || 'medium',
    imageUrl: options.imageUrl,
  };
}

/**
 * Creates a workout from a template with proper validation
 */
export function createWorkoutFromTemplate(
  template: {
    name: string;
    description: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: number;
      restTime?: number;
      duration?: number;
    }>;
    duration?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    category?: string;
    intensity?: 'low' | 'medium' | 'high';
    imageUrl?: string;
  },
  exercises: Exercise[],
  id?: string
): Workout {
  return createWorkout(
    id || `w${Date.now()}`,
    template.name,
    template.description,
    exercises,
    template.exercises.map(ex => ({
      exerciseName: ex.name,
      sets: ex.sets,
      reps: ex.reps,
      restTime: ex.restTime,
      duration: ex.duration
    })),
    {
      duration: template.duration,
      estimatedDuration: template.duration,
      difficulty: template.difficulty,
      category: template.category,
      intensity: template.intensity,
      imageUrl: template.imageUrl,
    }
  );
}

/**
 * Validates and creates a workout exercise from various input formats
 */
export function createWorkoutExerciseFromInput(
  input: string | Exercise | any,
  exercises: Exercise[],
  sets: number = 3,
  reps: number = 12,
  restTime: number = 60,
  duration?: number
): WorkoutExercise {
  if (typeof input === 'string') {
    // Input is exercise name
    return findAndCreateWorkoutExercise(exercises, input, 0, sets, reps, restTime, duration);
  } else if (input && typeof input === 'object' && input.id) {
    // Input is exercise object or workout exercise
    if ('sets' in input && 'reps' in input) {
      // Already a workout exercise
      return input as WorkoutExercise;
    } else {
      // Exercise object that needs conversion
      return {
        id: input.id,
        sets,
        reps,
        restTime,
        ...(duration && { duration })
      };
    }
  } else {
    throw new Error('Invalid exercise input provided');
  }
}

/**
 * Template for common workout types
 */
export const WORKOUT_TEMPLATES = {
  pushDay: {
    name: "Push Day",
    description: "Focus on chest, shoulders, and triceps",
    exercises: [
      { name: "Barbell Bench Press", sets: 4, reps: 8, restTime: 120 },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, restTime: 90 },
      { name: "Dumbbell Shoulder Press", sets: 3, reps: 12, restTime: 90 },
      { name: "Tricep Pushdown", sets: 3, reps: 15, restTime: 60 }
    ],
    duration: 50,
    difficulty: 'intermediate' as const,
    category: 'Strength',
    intensity: 'high' as const
  },
  
  pullDay: {
    name: "Pull Day", 
    description: "Focus on back and biceps",
    exercises: [
      { name: "Pull-up", sets: 4, reps: 8, restTime: 120 },
      { name: "Barbell Row", sets: 3, reps: 10, restTime: 90 },
      { name: "Lat Pulldown", sets: 3, reps: 12, restTime: 90 },
      { name: "Bicep Curl", sets: 3, reps: 15, restTime: 60 }
    ],
    duration: 50,
    difficulty: 'intermediate' as const,
    category: 'Strength',
    intensity: 'high' as const
  },
  
  legDay: {
    name: "Leg Day",
    description: "Focus on lower body development",
    exercises: [
      { name: "Squat", sets: 4, reps: 8, restTime: 120 },
      { name: "Romanian Deadlift", sets: 3, reps: 10, restTime: 120 },
      { name: "Leg Press", sets: 3, reps: 12, restTime: 90 },
      { name: "Leg Curl", sets: 3, reps: 15, restTime: 60 }
    ],
    duration: 50,
    difficulty: 'intermediate' as const,
    category: 'Strength',
    intensity: 'high' as const
  },
  
  quickCardio: {
    name: "Quick Cardio",
    description: "Fast cardio session",
    exercises: [
      { name: "Jumping Jacks", sets: 3, reps: 25, restTime: 30, duration: 30 },
      { name: "Mountain Climbers", sets: 3, reps: 30, restTime: 30, duration: 30 },
      { name: "High Knees", sets: 3, reps: 30, restTime: 30, duration: 30 }
    ],
    duration: 15,
    difficulty: 'beginner' as const,
    category: 'Cardio',
    intensity: 'medium' as const
  }
}; 