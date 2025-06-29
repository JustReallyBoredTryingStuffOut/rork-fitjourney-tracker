import { Exercise, EquipmentType, MuscleGroup, BodyRegion } from '@/types';

const bodyRegions: BodyRegion[] = [
  { name: 'upper_body', image: null },
  { name: 'lower_body', image: null },
  { name: 'core', image: null },
  { name: 'back', image: null },
];

const equipmentTypes: EquipmentType[] = [
  // Bodyweight
  { name: 'bodyweight', category: 'bodyweight' },
  
  // Free Weights
  { name: 'dumbbell', category: 'free_weights' },
  { name: 'barbell', category: 'free_weights' },
  { name: 'kettlebell', category: 'free_weights' },
  
  // Machines
  { name: 'smith_machine', category: 'machines' },
  { name: 'leg_press_machine', category: 'machines' },
  { name: 'chest_press_machine', category: 'machines' },
  { name: 'shoulder_press_machine', category: 'machines' },
  { name: 'lat_pulldown_machine', category: 'machines' },
  { name: 'seated_row_machine', category: 'machines' },
  { name: 'leg_extension_machine', category: 'machines' },
  { name: 'leg_curl_machine', category: 'machines' },
  { name: 'calf_raise_machine', category: 'machines' },
  { name: 'incline_hammer_strength_press', category: 'machines' },
  { name: 'fly_machine', category: 'machines' },
  { name: 'pec_deck_machine', category: 'machines' },
  { name: 'reverse_fly_machine', category: 'machines' },
  { name: 'ab_crunch_machine', category: 'machines' },
  { name: 'back_extension_machine', category: 'machines' },
  { name: 'hip_abductor_machine', category: 'machines' },
  { name: 'hip_adductor_machine', category: 'machines' },
  
  // Cables
  { name: 'cable_machine', category: 'cables' },
  { name: 'cable_crossover', category: 'cables' },
  { name: 'cable_fly', category: 'cables' },
  { name: 'cable_pulldown', category: 'cables' },
  { name: 'cable_row', category: 'cables' },
  { name: 'cable_curl', category: 'cables' },
  { name: 'cable_tricep_pushdown', category: 'cables' },
  { name: 'cable_shoulder_raise', category: 'cables' },
  { name: 'cable_woodchop', category: 'cables' },
  { name: 'cable_rotation', category: 'cables' },
  { name: 'cable_pull_through', category: 'cables' },
  { name: 'cable_face_pull', category: 'cables' },
  { name: 'cable_upright_row', category: 'cables' },
  { name: 'cable_shrug', category: 'cables' },
  
  // Accessories
  { name: 'bench', category: 'accessories' },
  { name: 'pull_up_bar', category: 'accessories' },
  { name: 'medicine_ball', category: 'accessories' },
  { name: 'stability_ball', category: 'accessories' },
  { name: 'foam_roller', category: 'accessories' },
  { name: 'trx', category: 'accessories' },
  { name: 'battle_ropes', category: 'accessories' },
  { name: 'resistance_band', category: 'accessories' },
  { name: 'ab_wheel', category: 'accessories' },
  { name: 'dip_bars', category: 'accessories' },
  { name: 'preacher_curl_bench', category: 'accessories' },
  { name: 'incline_bench', category: 'accessories' },
  { name: 'decline_bench', category: 'accessories' },
  { name: 'flat_bench', category: 'accessories' },
  
  // Cardio Equipment
  { name: 'treadmill', category: 'cardio_equipment' },
  { name: 'elliptical', category: 'cardio_equipment' },
  { name: 'stationary_bike', category: 'cardio_equipment' },
  { name: 'rowing_machine', category: 'cardio_equipment' },
  { name: 'stair_master', category: 'cardio_equipment' },
  { name: 'jumping_rope', category: 'cardio_equipment' },
];

const muscleGroups: MuscleGroup[] = [
  { name: 'chest', bodyRegion: bodyRegions[0] },
  { name: 'back', bodyRegion: bodyRegions[3] },
  { name: 'shoulders', bodyRegion: bodyRegions[0] },
  { name: 'biceps', bodyRegion: bodyRegions[0] },
  { name: 'triceps', bodyRegion: bodyRegions[0] },
  { name: 'forearms', bodyRegion: bodyRegions[0] },
  { name: 'quadriceps', bodyRegion: bodyRegions[1] },
  { name: 'hamstrings', bodyRegion: bodyRegions[1] },
  { name: 'glutes', bodyRegion: bodyRegions[1] },
  { name: 'calves', bodyRegion: bodyRegions[1] },
  { name: 'abs', bodyRegion: bodyRegions[2] },
  { name: 'obliques', bodyRegion: bodyRegions[2] },
  { name: 'lower_back', bodyRegion: bodyRegions[3] },
  { name: 'traps', bodyRegion: bodyRegions[3] },
  { name: 'lats', bodyRegion: bodyRegions[3] },
  { name: 'deltoids', bodyRegion: bodyRegions[0] },
];

// CHEST EXERCISES (Primary Target)
export const chestExercises: Exercise[] = [
  {
    id: "chest1",
    name: "Push-up",
    description: "A classic bodyweight exercise that primarily targets the chest.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[0]],
    difficulty: "beginner",
    instructions: [
      "Start in a plank position with hands slightly wider than shoulder-width",
      "Lower your body until your chest nearly touches the floor",
      "Push your body back up to the starting position",
      "Keep your core tight and body in a straight line throughout the movement"
    ],
    tips: [
      "Keep your elbows at a 45-degree angle to your body",
      "Don't let your hips sag or rise",
      "Breathe in as you lower, breathe out as you push up"
    ],
    variations: [
      "Incline Push-up",
      "Decline Push-up",
      "Diamond Push-up",
      "Wide Push-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest2",
    name: "Barbell Bench Press",
    description: "A compound exercise that primarily targets the chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[2], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with feet flat on floor",
      "Grip barbell slightly wider than shoulder-width",
      "Lower bar to mid-chest",
      "Press bar back up to starting position"
    ],
    tips: [
      "Keep shoulders retracted",
      "Maintain natural arch in lower back",
      "Control the bar throughout the movement"
    ],
    variations: [
      "Incline Bench Press",
      "Decline Bench Press",
      "Close Grip Bench Press",
      "Wide Grip Bench Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest3",
    name: "Dumbbell Bench Press",
    description: "A chest exercise using dumbbells for greater range of motion.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with dumbbells at chest level",
      "Press weights up until arms are extended",
      "Lower weights back to chest with control",
      "Keep core engaged throughout"
    ],
    tips: [
      "Keep wrists straight",
      "Don't arch lower back",
      "Control the weights throughout"
    ],
    variations: [
      "Incline Dumbbell Press",
      "Decline Dumbbell Press",
      "Single-Arm Dumbbell Press",
      "Neutral Grip Dumbbell Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest4",
    name: "Dumbbell Fly",
    description: "An isolation exercise that targets the chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with dumbbells extended above chest",
      "Lower weights in arc motion",
      "Bring weights back to starting position",
      "Keep slight bend in elbows"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on chest contraction",
      "Don't let weights go too low"
    ],
    variations: [
      "Incline Dumbbell Fly",
      "Decline Dumbbell Fly",
      "Standing Dumbbell Fly",
      "Cable Chest Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest5",
    name: "Cable Chest Fly",
    description: "An isolation exercise using cable machine for constant tension.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[5]],
    difficulty: "intermediate",
    instructions: [
      "Stand between cable pulleys",
      "Grip handles at chest level",
      "Bring hands together in front of chest",
      "Return to starting position with control"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on chest contraction",
      "Don't let arms go behind body"
    ],
    variations: [
      "High Cable Fly",
      "Low Cable Fly",
      "Single-Arm Cable Fly",
      "Incline Cable Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest6",
    name: "Decline Barbell Bench Press",
    description: "A chest exercise that targets the lower chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[2], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on decline bench with feet secured",
      "Grip barbell slightly wider than shoulder-width",
      "Lower bar to lower chest",
      "Press bar back up to starting position"
    ],
    tips: [
      "Keep shoulders retracted",
      "Control the descent",
      "Focus on lower chest contraction"
    ],
    variations: [
      "Decline Dumbbell Press",
      "Decline Fly",
      "Decline Push-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest7",
    name: "Incline Barbell Bench Press",
    description: "A chest exercise that targets the upper chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[2], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Set bench to 30-45 degree angle",
      "Lie on bench with barbell at chest level",
      "Press bar up until arms are extended",
      "Lower bar back to chest with control"
    ],
    tips: [
      "Keep wrists straight",
      "Don't arch lower back",
      "Control the weight throughout"
    ],
    variations: [
      "Incline Dumbbell Press",
      "Incline Fly",
      "Incline Push-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest8",
    name: "Diamond Push-up",
    description: "A bodyweight exercise that targets the chest with emphasis on inner chest.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[0]],
    difficulty: "intermediate",
    instructions: [
      "Start in plank position with hands forming diamond shape",
      "Lower body until chest nearly touches hands",
      "Push back up to starting position",
      "Keep core engaged throughout"
    ],
    tips: [
      "Keep elbows close to body",
      "Focus on inner chest contraction",
      "Maintain proper form"
    ],
    variations: [
      "Incline Diamond Push-up",
      "Decline Diamond Push-up",
      "Diamond Push-up with Clap"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest9",
    name: "Pec Deck Machine",
    description: "A machine-based isolation exercise for the chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[14]],
    difficulty: "beginner",
    instructions: [
      "Sit in pec deck machine",
      "Grip handles at chest level",
      "Bring arms together in front of chest",
      "Return to starting position with control"
    ],
    tips: [
      "Keep back flat against pad",
      "Focus on chest contraction",
      "Don't use momentum"
    ],
    variations: [
      "Reverse Pec Deck",
      "Single-Arm Pec Deck",
      "Standing Pec Deck"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest10",
    name: "Resistance Band Chest Press",
    description: "A chest exercise using resistance bands for constant tension.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[4]],
    difficulty: "beginner",
    instructions: [
      "Anchor resistance band behind you",
      "Hold handles at chest level",
      "Press forward until arms are extended",
      "Return to starting position with control"
    ],
    tips: [
      "Keep core engaged",
      "Maintain proper posture",
      "Focus on chest contraction"
    ],
    variations: [
      "Single-Arm Band Press",
      "Band Chest Fly",
      "Standing Band Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest11",
    name: "Smith Machine Bench Press",
    description: "A chest exercise using Smith machine for controlled movement.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[6], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench under Smith machine",
      "Grip bar slightly wider than shoulder-width",
      "Lower bar to chest",
      "Press bar back up to starting position"
    ],
    tips: [
      "Keep shoulders retracted",
      "Control the movement",
      "Focus on chest contraction"
    ],
    variations: [
      "Smith Machine Incline Press",
      "Smith Machine Decline Press",
      "Smith Machine Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest12",
    name: "Close Grip Bench Press",
    description: "A chest exercise with narrow grip that emphasizes inner chest.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[2], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with hands close together",
      "Grip barbell with hands 6-8 inches apart",
      "Lower bar to chest",
      "Press bar back up to starting position"
    ],
    tips: [
      "Keep elbows close to body",
      "Focus on inner chest contraction",
      "Control the movement"
    ],
    variations: [
      "Close Grip Dumbbell Press",
      "Close Grip Push-up",
      "Close Grip Cable Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest13",
    name: "Wide Grip Bench Press",
    description: "A chest exercise with wide grip that emphasizes outer chest.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[2], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with hands wide apart",
      "Grip barbell with hands wider than shoulder-width",
      "Lower bar to chest",
      "Press bar back up to starting position"
    ],
    tips: [
      "Keep shoulders retracted",
      "Focus on outer chest contraction",
      "Control the movement"
    ],
    variations: [
      "Wide Grip Dumbbell Press",
      "Wide Grip Push-up",
      "Wide Grip Cable Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest14",
    name: "Medicine Ball Chest Pass",
    description: "A dynamic chest exercise using medicine ball.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[10]],
    difficulty: "intermediate",
    instructions: [
      "Stand with medicine ball at chest level",
      "Throw ball forward with chest muscles",
      "Catch ball and repeat",
      "Keep core engaged throughout"
    ],
    tips: [
      "Focus on chest contraction",
      "Use proper throwing form",
      "Control the catch"
    ],
    variations: [
      "Wall Ball Chest Pass",
      "Partner Chest Pass",
      "Single-Arm Chest Pass"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest15",
    name: "Stability Ball Push-up",
    description: "A chest exercise using stability ball for instability training.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[0], equipmentTypes[11]],
    difficulty: "advanced",
    instructions: [
      "Place hands on stability ball",
      "Assume plank position",
      "Perform push-up with ball under hands",
      "Keep core engaged throughout"
    ],
    tips: [
      "Keep body in straight line",
      "Focus on chest contraction",
      "Control the movement"
    ],
    variations: [
      "Stability Ball Chest Press",
      "Stability Ball Fly",
      "Single-Arm Stability Ball Push-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest16",
    name: "Incline Dumbbell Fly",
    description: "An isolation exercise that targets the upper chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on incline bench with dumbbells extended",
      "Lower weights in arc motion",
      "Bring weights back to starting position",
      "Keep slight bend in elbows"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on upper chest contraction",
      "Don't let weights go too low"
    ],
    variations: [
      "Decline Dumbbell Fly",
      "Flat Dumbbell Fly",
      "Cable Incline Fly",
      "Single-Arm Incline Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest17",
    name: "Decline Dumbbell Fly",
    description: "An isolation exercise that targets the lower chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on decline bench with dumbbells extended",
      "Lower weights in arc motion",
      "Bring weights back to starting position",
      "Keep slight bend in elbows"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on lower chest contraction",
      "Don't let weights go too low"
    ],
    variations: [
      "Incline Dumbbell Fly",
      "Flat Dumbbell Fly",
      "Cable Decline Fly",
      "Single-Arm Decline Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest18",
    name: "Close Grip Bench Press",
    description: "A bench press variation that emphasizes the inner chest and triceps.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[2], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with hands close together",
      "Lower bar to mid-chest",
      "Press bar back up to starting position",
      "Keep elbows close to body"
    ],
    tips: [
      "Keep elbows close to body",
      "Focus on inner chest contraction",
      "Control the bar throughout"
    ],
    variations: [
      "Close Grip Dumbbell Press",
      "Close Grip Incline Press",
      "Close Grip Decline Press",
      "Close Grip Cable Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest19",
    name: "Wide Grip Bench Press",
    description: "A bench press variation that emphasizes the outer chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[2], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with hands wider than shoulder-width",
      "Lower bar to mid-chest",
      "Press bar back up to starting position",
      "Keep shoulders retracted"
    ],
    tips: [
      "Keep shoulders retracted",
      "Focus on outer chest contraction",
      "Control the bar throughout"
    ],
    variations: [
      "Wide Grip Dumbbell Press",
      "Wide Grip Incline Press",
      "Wide Grip Decline Press",
      "Wide Grip Cable Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest20",
    name: "Single-Arm Dumbbell Press",
    description: "A unilateral chest exercise for balanced development.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with one dumbbell at chest level",
      "Press weight up until arm is extended",
      "Lower weight back to chest with control",
      "Repeat with other arm"
    ],
    tips: [
      "Keep core engaged",
      "Focus on chest contraction",
      "Maintain balance"
    ],
    variations: [
      "Single-Arm Incline Press",
      "Single-Arm Decline Press",
      "Single-Arm Cable Press",
      "Single-Arm Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest21",
    name: "Resistance Band Chest Press",
    description: "A chest exercise using resistance bands for constant tension.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[4]],
    difficulty: "beginner",
    instructions: [
      "Anchor resistance band behind you",
      "Hold handles at chest level",
      "Press handles forward",
      "Return to starting position"
    ],
    tips: [
      "Keep core engaged",
      "Focus on chest contraction",
      "Control the movement"
    ],
    variations: [
      "Band Incline Press",
      "Band Decline Press",
      "Single-Arm Band Press",
      "Band Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest22",
    name: "Smith Machine Bench Press",
    description: "A bench press using Smith machine for controlled movement.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[6], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie on bench under Smith machine",
      "Grip bar at chest level",
      "Press bar up until arms are extended",
      "Lower with control"
    ],
    tips: [
      "Keep core engaged",
      "Focus on chest contraction",
      "Control the movement"
    ],
    variations: [
      "Smith Machine Incline Press",
      "Smith Machine Decline Press",
      "Smith Machine Fly",
      "Smith Machine Close Grip Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest23",
    name: "Plyometric Push-up",
    description: "An explosive push-up that builds power and strength.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[0]],
    difficulty: "advanced",
    instructions: [
      "Start in plank position",
      "Lower body quickly",
      "Explosively push up",
      "Land softly and repeat"
    ],
    tips: [
      "Use explosive power",
      "Land softly",
      "Keep core engaged"
    ],
    variations: [
      "Clap Push-up",
      "Plyometric Incline Push-up",
      "Plyometric Decline Push-up",
      "Single-Arm Plyometric Push-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest24",
    name: "Cable Crossover",
    description: "A cable exercise that targets the chest with constant tension.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[5]],
    difficulty: "intermediate",
    instructions: [
      "Stand between cable pulleys",
      "Grip handles at chest level",
      "Bring hands together in front of chest",
      "Return to starting position"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on chest contraction",
      "Don't let arms go behind body"
    ],
    variations: [
      "High Cable Crossover",
      "Low Cable Crossover",
      "Single-Arm Cable Crossover",
      "Cable Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "chest25",
    name: "Medicine Ball Chest Pass",
    description: "A functional chest exercise using medicine ball.",
    muscleGroups: [muscleGroups[0]], // chest only
    equipment: [equipmentTypes[10]],
    difficulty: "intermediate",
    instructions: [
      "Stand with medicine ball at chest level",
      "Explosively throw ball forward",
      "Catch ball and repeat",
      "Keep core engaged throughout"
    ],
    tips: [
      "Use explosive power",
      "Focus on chest contraction",
      "Control the catch"
    ],
    variations: [
      "Medicine Ball Chest Throw",
      "Medicine Ball Slam",
      "Medicine Ball Push-up",
      "Single-Arm Medicine Ball Pass"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// SHOULDER EXERCISES (Primary Target)
export const shoulderExercises: Exercise[] = [
  {
    id: "shoulder1",
    name: "Dumbbell Shoulder Press",
    description: "An overhead pressing movement that primarily targets the shoulders.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Sit or stand with dumbbells at shoulder height",
      "Press the weights overhead until arms are fully extended",
      "Lower the weights back to shoulder height with control",
      "Keep core engaged throughout the movement"
    ],
    tips: [
      "Don't arch your back",
      "Keep your wrists straight",
      "Breathe steadily throughout the movement"
    ],
    variations: [
      "Arnold Press",
      "Seated Shoulder Press",
      "Standing Shoulder Press",
      "Single-Arm Shoulder Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder2",
    name: "Dumbbell Lateral Raise",
    description: "An isolation exercise that targets the lateral deltoids.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Stand with dumbbells at sides",
      "Raise arms to shoulder level",
      "Lower weights with control",
      "Keep slight bend in elbows"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on shoulder contraction",
      "Don't swing body"
    ],
    variations: [
      "Seated Lateral Raise",
      "Cable Lateral Raise",
      "Single-Arm Lateral Raise",
      "Bent-Over Lateral Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder3",
    name: "Dumbbell Front Raise",
    description: "An isolation exercise that targets the anterior deltoids.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1]],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells in front of thighs",
      "Raise arms to shoulder level",
      "Lower weights with control",
      "Keep arms straight"
    ],
    tips: [
      "Keep arms straight",
      "Focus on front delt contraction",
      "Don't swing body"
    ],
    variations: [
      "Alternating Front Raise",
      "Cable Front Raise",
      "Barbell Front Raise",
      "Plate Front Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder4",
    name: "Dumbbell Rear Delt Fly",
    description: "An isolation exercise that targets the rear deltoids.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Bend forward at hips",
      "Hold dumbbells with arms extended",
      "Raise arms to sides",
      "Lower with control"
    ],
    tips: [
      "Keep back straight",
      "Focus on rear delt contraction",
      "Don't use momentum"
    ],
    variations: [
      "Seated Rear Delt Fly",
      "Cable Rear Delt Fly",
      "Face-Down Rear Delt Fly",
      "Incline Rear Delt Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder5",
    name: "Cable Lateral Raise",
    description: "A shoulder exercise using cable machine for constant tension.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[5]],
    difficulty: "intermediate",
    instructions: [
      "Stand with cable at side",
      "Grip handle with arm extended",
      "Raise arm to shoulder level",
      "Lower with control"
    ],
    tips: [
      "Keep slight bend in elbow",
      "Focus on shoulder contraction",
      "Don't swing body"
    ],
    variations: [
      "Single-Arm Cable Raise",
      "Cable Front Raise",
      "Cable Rear Delt Fly",
      "Cable Shoulder Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder6",
    name: "Barbell Upright Row",
    description: "A compound exercise that targets the shoulders and traps.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[2]],
    difficulty: "intermediate",
    instructions: [
      "Stand with barbell in front",
      "Grip bar with hands close together",
      "Pull bar up to chin level",
      "Lower with control"
    ],
    tips: [
      "Keep bar close to body",
      "Focus on shoulder contraction",
      "Don't swing body"
    ],
    variations: [
      "Dumbbell Upright Row",
      "Cable Upright Row",
      "Wide Grip Upright Row",
      "EZ Bar Upright Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder7",
    name: "Arnold Press",
    description: "A shoulder press variation that targets all deltoid heads.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Start with dumbbells at shoulder level, palms facing you",
      "Rotate wrists and press overhead",
      "Lower weights back to starting position",
      "Rotate wrists back to starting position"
    ],
    tips: [
      "Control the rotation",
      "Focus on shoulder contraction",
      "Keep core engaged"
    ],
    variations: [
      "Seated Arnold Press",
      "Standing Arnold Press",
      "Single-Arm Arnold Press",
      "Cable Arnold Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder8",
    name: "Military Press",
    description: "A classic shoulder press using barbell.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[2]],
    difficulty: "intermediate",
    instructions: [
      "Stand with barbell at shoulder level",
      "Press bar overhead until arms are extended",
      "Lower bar back to shoulder level",
      "Keep core engaged throughout"
    ],
    tips: [
      "Keep back straight",
      "Focus on shoulder contraction",
      "Don't arch back"
    ],
    variations: [
      "Seated Military Press",
      "Standing Military Press",
      "Push Press",
      "Behind-the-Neck Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder9",
    name: "Cable Shoulder Press",
    description: "A shoulder exercise using cable machine for constant tension.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[5]],
    difficulty: "intermediate",
    instructions: [
      "Stand with cables at shoulder height",
      "Grip handles at shoulder level",
      "Press handles overhead",
      "Lower with control"
    ],
    tips: [
      "Keep core engaged",
      "Don't arch back",
      "Focus on shoulder contraction"
    ],
    variations: [
      "Single-Arm Cable Press",
      "Seated Cable Press",
      "Cable Arnold Press",
      "Cable Military Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder10",
    name: "Pike Push-up",
    description: "A bodyweight shoulder exercise that targets the deltoids.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[0]],
    difficulty: "intermediate",
    instructions: [
      "Start in downward dog position",
      "Lower head toward ground",
      "Push back up to starting position",
      "Keep core engaged throughout"
    ],
    tips: [
      "Keep shoulders over hands",
      "Focus on shoulder contraction",
      "Maintain proper form"
    ],
    variations: [
      "Incline Pike Push-up",
      "Decline Pike Push-up",
      "Handstand Push-up",
      "Wall-Assisted Handstand Push-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder11",
    name: "Handstand Push-up",
    description: "An advanced bodyweight shoulder exercise.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[0]],
    difficulty: "advanced",
    instructions: [
      "Kick up into handstand position",
      "Lower body toward ground",
      "Push back up to handstand",
      "Keep body straight throughout"
    ],
    tips: [
      "Keep core engaged",
      "Focus on shoulder strength",
      "Maintain balance"
    ],
    variations: [
      "Wall-Assisted Handstand Push-up",
      "Pike Push-up",
      "Negative Handstand Push-up",
      "Freestanding Handstand Push-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder12",
    name: "Resistance Band Lateral Raise",
    description: "A shoulder exercise using resistance bands.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[4]],
    difficulty: "beginner",
    instructions: [
      "Stand on resistance band",
      "Hold handles at sides",
      "Raise arms to shoulder level",
      "Lower with control"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on shoulder contraction",
      "Don't swing body"
    ],
    variations: [
      "Band Front Raise",
      "Band Rear Delt Fly",
      "Band Shoulder Press",
      "Single-Arm Band Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder13",
    name: "Smith Machine Shoulder Press",
    description: "A shoulder exercise using Smith machine for controlled movement.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[6]],
    difficulty: "intermediate",
    instructions: [
      "Sit or stand under Smith machine",
      "Grip bar at shoulder level",
      "Press bar overhead",
      "Lower with control"
    ],
    tips: [
      "Keep core engaged",
      "Focus on shoulder contraction",
      "Control the movement"
    ],
    variations: [
      "Seated Smith Press",
      "Standing Smith Press",
      "Smith Machine Upright Row",
      "Smith Machine Lateral Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder14",
    name: "Plate Front Raise",
    description: "A shoulder exercise using weight plate.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[2]],
    difficulty: "beginner",
    instructions: [
      "Hold weight plate in front of body",
      "Raise plate to shoulder level",
      "Lower with control",
      "Keep arms straight"
    ],
    tips: [
      "Keep arms straight",
      "Focus on front delt contraction",
      "Don't swing body"
    ],
    variations: [
      "Alternating Plate Raise",
      "Plate Lateral Raise",
      "Plate Upright Row",
      "Single-Arm Plate Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder15",
    name: "Face Pull",
    description: "A shoulder exercise that targets the rear deltoids and upper back.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[5]],
    difficulty: "beginner",
    instructions: [
      "Stand facing cable machine",
      "Grip rope with hands at eye level",
      "Pull rope toward face",
      "Return to starting position"
    ],
    tips: [
      "Keep elbows high",
      "Focus on rear delt contraction",
      "Maintain proper posture"
    ],
    variations: [
      "High Face Pull",
      "Low Face Pull",
      "Single-Arm Face Pull",
      "Band Face Pull"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder16",
    name: "Seated Dumbbell Press",
    description: "A seated shoulder press for better stability and focus.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Sit on bench with back support",
      "Hold dumbbells at shoulder level",
      "Press weights overhead",
      "Lower with control"
    ],
    tips: [
      "Keep back against bench",
      "Focus on shoulder contraction",
      "Control the movement"
    ],
    variations: [
      "Seated Arnold Press",
      "Seated Military Press",
      "Seated Single-Arm Press",
      "Seated Cable Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder17",
    name: "Cable Front Raise",
    description: "A front raise using cable machine for constant tension.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[5]],
    difficulty: "intermediate",
    instructions: [
      "Stand with cable behind you",
      "Grip handle with arm extended",
      "Raise arm to shoulder level",
      "Lower with control"
    ],
    tips: [
      "Keep arm straight",
      "Focus on front delt contraction",
      "Don't swing body"
    ],
    variations: [
      "Single-Arm Cable Front Raise",
      "Cable Lateral Raise",
      "Cable Rear Delt Fly",
      "Cable Upright Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder18",
    name: "Dumbbell Upright Row",
    description: "An upright row using dumbbells for shoulder development.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Stand with dumbbells in front",
      "Pull weights up to chin level",
      "Lower with control",
      "Keep weights close to body"
    ],
    tips: [
      "Keep weights close to body",
      "Focus on shoulder contraction",
      "Don't swing body"
    ],
    variations: [
      "Barbell Upright Row",
      "Cable Upright Row",
      "EZ Bar Upright Row",
      "Plate Upright Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder19",
    name: "Seated Lateral Raise",
    description: "A seated lateral raise for better isolation.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Sit on bench with back support",
      "Hold dumbbells at sides",
      "Raise arms to shoulder level",
      "Lower with control"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on lateral delt contraction",
      "Don't swing body"
    ],
    variations: [
      "Standing Lateral Raise",
      "Cable Lateral Raise",
      "Single-Arm Lateral Raise",
      "Bent-Over Lateral Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder20",
    name: "Cable Rear Delt Fly",
    description: "A rear delt fly using cable machine for constant tension.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[5]],
    difficulty: "intermediate",
    instructions: [
      "Stand with cable in front",
      "Cross arms and grip handles",
      "Pull arms back and out",
      "Return to starting position"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on rear delt contraction",
      "Don't arch back"
    ],
    variations: [
      "Dumbbell Rear Delt Fly",
      "Seated Rear Delt Fly",
      "Face-Down Rear Delt Fly",
      "Incline Rear Delt Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder21",
    name: "Push Press",
    description: "An explosive shoulder press using leg drive.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[2]],
    difficulty: "advanced",
    instructions: [
      "Stand with barbell at shoulder level",
      "Dip slightly at knees",
      "Explosively press bar overhead",
      "Lower with control"
    ],
    tips: [
      "Use leg drive for power",
      "Keep core engaged",
      "Control the descent"
    ],
    variations: [
      "Dumbbell Push Press",
      "Kettlebell Push Press",
      "Single-Arm Push Press",
      "Cable Push Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder22",
    name: "Band Shoulder Press",
    description: "A shoulder press using resistance bands.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[4]],
    difficulty: "beginner",
    instructions: [
      "Stand on resistance band",
      "Hold handles at shoulder level",
      "Press handles overhead",
      "Lower with control"
    ],
    tips: [
      "Keep core engaged",
      "Focus on shoulder contraction",
      "Control the movement"
    ],
    variations: [
      "Seated Band Press",
      "Single-Arm Band Press",
      "Band Arnold Press",
      "Band Military Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder23",
    name: "Seated Rear Delt Fly",
    description: "A seated rear delt fly for better isolation.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Sit on bench with back support",
      "Bend forward slightly",
      "Hold dumbbells with arms extended",
      "Raise arms to sides"
    ],
    tips: [
      "Keep back straight",
      "Focus on rear delt contraction",
      "Don't use momentum"
    ],
    variations: [
      "Standing Rear Delt Fly",
      "Cable Rear Delt Fly",
      "Face-Down Rear Delt Fly",
      "Incline Rear Delt Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder24",
    name: "Single-Arm Shoulder Press",
    description: "A unilateral shoulder press for balanced development.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Stand with one dumbbell at shoulder level",
      "Press weight overhead",
      "Lower with control",
      "Repeat with other arm"
    ],
    tips: [
      "Keep core engaged",
      "Focus on shoulder contraction",
      "Maintain balance"
    ],
    variations: [
      "Seated Single-Arm Press",
      "Cable Single-Arm Press",
      "Kettlebell Single-Arm Press",
      "Band Single-Arm Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "shoulder25",
    name: "Incline Rear Delt Fly",
    description: "A rear delt fly performed on an incline bench.",
    muscleGroups: [muscleGroups[2]], // shoulders only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Lie face down on incline bench",
      "Hold dumbbells with arms extended",
      "Raise arms to sides",
      "Lower with control"
    ],
    tips: [
      "Keep chest flat on bench",
      "Focus on rear delt contraction",
      "Don't use momentum"
    ],
    variations: [
      "Seated Rear Delt Fly",
      "Standing Rear Delt Fly",
      "Cable Rear Delt Fly",
      "Face-Down Rear Delt Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Combine all exercises
export const allPrimaryMuscleExercises: Exercise[] = [
  ...chestExercises,
  ...shoulderExercises,
  // Add basic exercises for other muscle groups
  {
    id: "back1",
    name: "Pull-up",
    description: "A compound exercise that primarily targets the back muscles.",
    muscleGroups: [muscleGroups[1]], // back only
    equipment: [equipmentTypes[9]],
    difficulty: "intermediate",
    instructions: [
      "Grip pull-up bar with hands wider than shoulder-width",
      "Hang with arms fully extended",
      "Pull body up until chin is over the bar",
      "Lower body back to starting position"
    ],
    tips: [
      "Keep core engaged",
      "Focus on back contraction",
      "Control the movement"
    ],
    variations: [
      "Assisted Pull-up",
      "Wide Grip Pull-up",
      "Close Grip Pull-up",
      "Neutral Grip Pull-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "back2",
    name: "Barbell Row",
    description: "A compound exercise that targets the back muscles.",
    muscleGroups: [muscleGroups[1]], // back only
    equipment: [equipmentTypes[2]],
    difficulty: "intermediate",
    instructions: [
      "Bend forward at hips with barbell in front",
      "Pull bar toward lower chest",
      "Lower bar back to starting position",
      "Keep back straight throughout"
    ],
    tips: [
      "Keep back straight",
      "Focus on back contraction",
      "Don't use momentum"
    ],
    variations: [
      "Dumbbell Row",
      "Cable Row",
      "T-Bar Row",
      "Single-Arm Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "bicep1",
    name: "Bicep Curl",
    description: "An isolation exercise that targets the biceps.",
    muscleGroups: [muscleGroups[3]], // biceps only
    equipment: [equipmentTypes[1]],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells at sides",
      "Curl weights toward shoulders",
      "Lower weights back to starting position",
      "Keep elbows stationary"
    ],
    tips: [
      "Keep elbows at sides",
      "Focus on bicep contraction",
      "Don't swing body"
    ],
    variations: [
      "Barbell Curl",
      "Cable Curl",
      "Hammer Curl",
      "Concentration Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "tricep1",
    name: "Tricep Pushdown",
    description: "An isolation exercise that targets the triceps.",
    muscleGroups: [muscleGroups[4]], // triceps only
    equipment: [equipmentTypes[5]],
    difficulty: "beginner",
    instructions: [
      "Stand with cable at chest level",
      "Push handles down until arms are extended",
      "Return to starting position",
      "Keep elbows at sides"
    ],
    tips: [
      "Keep elbows at sides",
      "Focus on tricep contraction",
      "Control the movement"
    ],
    variations: [
      "Rope Pushdown",
      "Single-Arm Pushdown",
      "Overhead Tricep Extension",
      "Diamond Push-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "quad1",
    name: "Squat",
    description: "A compound exercise that primarily targets the quadriceps.",
    muscleGroups: [muscleGroups[6]], // quadriceps only
    equipment: [equipmentTypes[2]],
    difficulty: "intermediate",
    instructions: [
      "Stand with barbell on upper back",
      "Lower body by bending knees",
      "Return to standing position",
      "Keep chest up throughout"
    ],
    tips: [
      "Keep chest up",
      "Knees in line with toes",
      "Go parallel or below"
    ],
    variations: [
      "Bodyweight Squat",
      "Dumbbell Squat",
      "Front Squat",
      "Goblet Squat"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "hamstring1",
    name: "Deadlift",
    description: "A compound exercise that targets the hamstrings and back.",
    muscleGroups: [muscleGroups[7]], // hamstrings only
    equipment: [equipmentTypes[2]],
    difficulty: "intermediate",
    instructions: [
      "Stand with barbell in front",
      "Bend at hips and knees",
      "Grip bar and stand up",
      "Keep back straight throughout"
    ],
    tips: [
      "Keep back straight",
      "Drive through heels",
      "Keep bar close to body"
    ],
    variations: [
      "Romanian Deadlift",
      "Dumbbell Deadlift",
      "Sumo Deadlift",
      "Single-Leg Deadlift"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "glute1",
    name: "Hip Thrust",
    description: "An isolation exercise that targets the glutes.",
    muscleGroups: [muscleGroups[8]], // glutes only
    equipment: [equipmentTypes[2], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Sit on ground with back against bench",
      "Place barbell across hips",
      "Thrust hips up until body is straight",
      "Lower back to starting position"
    ],
    tips: [
      "Keep core engaged",
      "Focus on glute contraction",
      "Don't arch lower back"
    ],
    variations: [
      "Bodyweight Hip Thrust",
      "Dumbbell Hip Thrust",
      "Single-Leg Hip Thrust",
      "Band Hip Thrust"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "calf1",
    name: "Standing Calf Raise",
    description: "An isolation exercise that targets the calves.",
    muscleGroups: [muscleGroups[9]], // calves only
    equipment: [equipmentTypes[1]],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells at sides",
      "Raise heels off ground",
      "Lower heels back to ground",
      "Keep knees straight"
    ],
    tips: [
      "Keep knees straight",
      "Focus on calf contraction",
      "Full range of motion"
    ],
    variations: [
      "Seated Calf Raise",
      "Machine Calf Raise",
      "Single-Leg Calf Raise",
      "Cable Calf Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "abs1",
    name: "Crunches",
    description: "An isolation exercise that targets the abdominal muscles.",
    muscleGroups: [muscleGroups[10]], // abs only
    equipment: [equipmentTypes[0]],
    difficulty: "beginner",
    instructions: [
      "Lie on back with knees bent",
      "Place hands behind head",
      "Lift shoulders off ground",
      "Lower back to starting position"
    ],
    tips: [
      "Keep lower back on ground",
      "Focus on abs contraction",
      "Don't pull on neck"
    ],
    variations: [
      "Bicycle Crunches",
      "Reverse Crunches",
      "Cable Crunches",
      "Decline Crunches"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "oblique1",
    name: "Russian Twist",
    description: "An exercise that targets the oblique muscles.",
    muscleGroups: [muscleGroups[11]], // obliques only
    equipment: [equipmentTypes[0]],
    difficulty: "intermediate",
    instructions: [
      "Sit with knees bent and feet off ground",
      "Rotate torso from side to side",
      "Keep core engaged throughout",
      "Maintain balance"
    ],
    tips: [
      "Keep core engaged",
      "Rotate from waist",
      "Don't swing arms"
    ],
    variations: [
      "Weighted Russian Twist",
      "Cable Russian Twist",
      "Medicine Ball Twist",
      "Seated Russian Twist"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  // Additional Back Exercises
  {
    id: "back3",
    name: "Lat Pulldown",
    description: "A machine exercise that targets the latissimus dorsi.",
    muscleGroups: [muscleGroups[1]], // back only
    equipment: [equipmentTypes[14]],
    difficulty: "beginner",
    instructions: [
      "Sit at lat pulldown machine",
      "Grip bar with wide grip",
      "Pull bar down to upper chest",
      "Return to starting position"
    ],
    tips: [
      "Keep chest up",
      "Focus on back contraction",
      "Don't swing body"
    ],
    variations: [
      "Close Grip Pulldown",
      "Wide Grip Pulldown",
      "Single-Arm Pulldown",
      "Neutral Grip Pulldown"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "back4",
    name: "Dumbbell Row",
    description: "A single-arm row exercise for back development.",
    muscleGroups: [muscleGroups[1]], // back only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "intermediate",
    instructions: [
      "Place knee and hand on bench",
      "Hold dumbbell with other hand",
      "Pull weight toward hip",
      "Lower with control"
    ],
    tips: [
      "Keep back straight",
      "Focus on back contraction",
      "Don't rotate torso"
    ],
    variations: [
      "Standing Dumbbell Row",
      "Seated Dumbbell Row",
      "Cable Row",
      "T-Bar Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  // Additional Bicep Exercises
  {
    id: "bicep2",
    name: "Hammer Curl",
    description: "A bicep exercise with neutral grip.",
    muscleGroups: [muscleGroups[3]], // biceps only
    equipment: [equipmentTypes[1]],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells at sides",
      "Curl weights with palms facing each other",
      "Lower weights back to starting position",
      "Keep elbows stationary"
    ],
    tips: [
      "Keep elbows at sides",
      "Focus on bicep contraction",
      "Don't swing body"
    ],
    variations: [
      "Seated Hammer Curl",
      "Incline Hammer Curl",
      "Cable Hammer Curl",
      "Single-Arm Hammer Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "bicep3",
    name: "Barbell Curl",
    description: "A classic bicep exercise using barbell.",
    muscleGroups: [muscleGroups[3]], // biceps only
    equipment: [equipmentTypes[2]],
    difficulty: "intermediate",
    instructions: [
      "Stand with barbell at thighs",
      "Curl bar toward shoulders",
      "Lower bar back to starting position",
      "Keep elbows at sides"
    ],
    tips: [
      "Keep elbows at sides",
      "Focus on bicep contraction",
      "Don't swing body"
    ],
    variations: [
      "EZ Bar Curl",
      "Wide Grip Curl",
      "Close Grip Curl",
      "Preacher Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  // Additional Tricep Exercises
  {
    id: "tricep2",
    name: "Overhead Tricep Extension",
    description: "A tricep exercise performed overhead.",
    muscleGroups: [muscleGroups[4]], // triceps only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Stand with dumbbell overhead",
      "Lower weight behind head",
      "Extend arms back to starting position",
      "Keep elbows stationary"
    ],
    tips: [
      "Keep elbows in place",
      "Focus on tricep contraction",
      "Control the movement"
    ],
    variations: [
      "Cable Overhead Extension",
      "Barbell Overhead Extension",
      "Seated Overhead Extension",
      "Single-Arm Overhead Extension"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "tricep3",
    name: "Diamond Push-up",
    description: "A bodyweight tricep exercise.",
    muscleGroups: [muscleGroups[4]], // triceps only
    equipment: [equipmentTypes[0]],
    difficulty: "intermediate",
    instructions: [
      "Start in plank with hands forming diamond",
      "Lower body until chest nearly touches hands",
      "Push back up to starting position",
      "Keep elbows close to body"
    ],
    tips: [
      "Keep elbows close to body",
      "Focus on tricep contraction",
      "Maintain proper form"
    ],
    variations: [
      "Incline Diamond Push-up",
      "Decline Diamond Push-up",
      "Diamond Push-up with Clap",
      "Single-Arm Diamond Push-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  // Additional Leg Exercises
  {
    id: "quad2",
    name: "Leg Press",
    description: "A machine exercise that targets the quadriceps.",
    muscleGroups: [muscleGroups[6]], // quadriceps only
    equipment: [equipmentTypes[7]],
    difficulty: "intermediate",
    instructions: [
      "Sit in leg press machine",
      "Place feet on platform",
      "Press platform away from body",
      "Return to starting position"
    ],
    tips: [
      "Keep back against seat",
      "Focus on quad contraction",
      "Control the movement"
    ],
    variations: [
      "Wide Stance Leg Press",
      "Close Stance Leg Press",
      "Single-Leg Press",
      "High Foot Placement"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "quad3",
    name: "Lunges",
    description: "A bodyweight exercise that targets the quadriceps.",
    muscleGroups: [muscleGroups[6]], // quadriceps only
    equipment: [equipmentTypes[0]],
    difficulty: "beginner",
    instructions: [
      "Stand with feet together",
      "Step forward with one leg",
      "Lower body until both knees are bent",
      "Return to starting position"
    ],
    tips: [
      "Keep chest up",
      "Knee in line with toe",
      "Go parallel or below"
    ],
    variations: [
      "Walking Lunges",
      "Dumbbell Lunges",
      "Reverse Lunges",
      "Side Lunges"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "hamstring2",
    name: "Leg Curl",
    description: "A machine exercise that targets the hamstrings.",
    muscleGroups: [muscleGroups[7]], // hamstrings only
    equipment: [equipmentTypes[14]],
    difficulty: "intermediate",
    instructions: [
      "Lie face down on leg curl machine",
      "Curl legs toward glutes",
      "Lower legs back to starting position",
      "Keep hips on bench"
    ],
    tips: [
      "Keep hips on bench",
      "Focus on hamstring contraction",
      "Control the movement"
    ],
    variations: [
      "Seated Leg Curl",
      "Standing Leg Curl",
      "Single-Leg Curl",
      "Cable Leg Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "hamstring3",
    name: "Romanian Deadlift",
    description: "A deadlift variation that targets the hamstrings.",
    muscleGroups: [muscleGroups[7]], // hamstrings only
    equipment: [equipmentTypes[2]],
    difficulty: "intermediate",
    instructions: [
      "Stand with barbell at thighs",
      "Hinge at hips and lower bar",
      "Keep legs straight",
      "Return to starting position"
    ],
    tips: [
      "Keep legs straight",
      "Focus on hamstring stretch",
      "Keep bar close to body"
    ],
    variations: [
      "Dumbbell Romanian Deadlift",
      "Single-Leg Romanian Deadlift",
      "Cable Romanian Deadlift",
      "Kettlebell Romanian Deadlift"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "glute2",
    name: "Squat",
    description: "A compound exercise that targets the glutes.",
    muscleGroups: [muscleGroups[8]], // glutes only
    equipment: [equipmentTypes[0]],
    difficulty: "beginner",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower body by bending knees",
      "Return to standing position",
      "Keep chest up throughout"
    ],
    tips: [
      "Keep chest up",
      "Knees in line with toes",
      "Go parallel or below"
    ],
    variations: [
      "Dumbbell Squat",
      "Barbell Squat",
      "Sumo Squat",
      "Pistol Squat"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "glute3",
    name: "Glute Bridge",
    description: "A bodyweight exercise that targets the glutes.",
    muscleGroups: [muscleGroups[8]], // glutes only
    equipment: [equipmentTypes[0]],
    difficulty: "beginner",
    instructions: [
      "Lie on back with knees bent",
      "Lift hips off ground",
      "Lower hips back to ground",
      "Keep core engaged"
    ],
    tips: [
      "Keep core engaged",
      "Focus on glute contraction",
      "Don't arch lower back"
    ],
    variations: [
      "Single-Leg Glute Bridge",
      "Weighted Glute Bridge",
      "Band Glute Bridge",
      "Elevated Glute Bridge"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "calf2",
    name: "Seated Calf Raise",
    description: "A seated calf exercise.",
    muscleGroups: [muscleGroups[9]], // calves only
    equipment: [equipmentTypes[1], equipmentTypes[8]],
    difficulty: "beginner",
    instructions: [
      "Sit with dumbbells on knees",
      "Raise heels off ground",
      "Lower heels back to ground",
      "Keep knees bent"
    ],
    tips: [
      "Keep knees bent",
      "Focus on calf contraction",
      "Full range of motion"
    ],
    variations: [
      "Machine Seated Calf Raise",
      "Barbell Seated Calf Raise",
      "Single-Leg Seated Calf Raise",
      "Cable Seated Calf Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "calf3",
    name: "Donkey Calf Raise",
    description: "A calf exercise that targets the gastrocnemius.",
    muscleGroups: [muscleGroups[9]], // calves only
    equipment: [equipmentTypes[0]],
    difficulty: "intermediate",
    instructions: [
      "Bend forward at hips",
      "Place hands on support",
      "Raise heels off ground",
      "Lower heels back to ground"
    ],
    tips: [
      "Keep legs straight",
      "Focus on calf contraction",
      "Full range of motion"
    ],
    variations: [
      "Weighted Donkey Calf Raise",
      "Single-Leg Donkey Calf Raise",
      "Machine Donkey Calf Raise",
      "Cable Donkey Calf Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "abs2",
    name: "Plank",
    description: "An isometric exercise that targets the core.",
    muscleGroups: [muscleGroups[10]], // abs only
    equipment: [equipmentTypes[0]],
    difficulty: "beginner",
    instructions: [
      "Start in push-up position",
      "Hold body in straight line",
      "Keep core engaged",
      "Maintain position"
    ],
    tips: [
      "Keep body straight",
      "Focus on core engagement",
      "Don't let hips sag"
    ],
    variations: [
      "Side Plank",
      "Forearm Plank",
      "Plank with Leg Lift",
      "Plank with Arm Reach"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "abs3",
    name: "Bicycle Crunches",
    description: "A dynamic core exercise.",
    muscleGroups: [muscleGroups[10]], // abs only
    equipment: [equipmentTypes[0]],
    difficulty: "intermediate",
    instructions: [
      "Lie on back with hands behind head",
      "Lift shoulders off ground",
      "Alternate bringing knees to opposite elbows",
      "Keep lower back on ground"
    ],
    tips: [
      "Keep lower back on ground",
      "Focus on abs contraction",
      "Don't pull on neck"
    ],
    variations: [
      "Weighted Bicycle Crunches",
      "Slow Bicycle Crunches",
      "Reverse Bicycle Crunches",
      "Cable Bicycle Crunches"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "oblique2",
    name: "Side Plank",
    description: "An isometric exercise that targets the obliques.",
    muscleGroups: [muscleGroups[11]], // obliques only
    equipment: [equipmentTypes[0]],
    difficulty: "intermediate",
    instructions: [
      "Lie on side with forearm on ground",
      "Lift hips off ground",
      "Hold body in straight line",
      "Keep core engaged"
    ],
    tips: [
      "Keep body straight",
      "Focus on oblique engagement",
      "Don't let hips drop"
    ],
    variations: [
      "Side Plank with Leg Lift",
      "Side Plank with Arm Reach",
      "Weighted Side Plank",
      "Dynamic Side Plank"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "oblique3",
    name: "Woodchopper",
    description: "A dynamic exercise that targets the obliques.",
    muscleGroups: [muscleGroups[11]], // obliques only
    equipment: [equipmentTypes[5]],
    difficulty: "intermediate",
    instructions: [
      "Stand with cable at high position",
      "Rotate torso and pull cable down",
      "Follow through across body",
      "Return to starting position"
    ],
    tips: [
      "Rotate from waist",
      "Focus on oblique contraction",
      "Keep core engaged"
    ],
    variations: [
      "Dumbbell Woodchopper",
      "Medicine Ball Woodchopper",
      "Low to High Woodchopper",
      "Single-Arm Woodchopper"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  // Forearm Exercises
  {
    id: "forearm1",
    name: "Wrist Curl",
    description: "An isolation exercise that targets the forearm flexors.",
    muscleGroups: [muscleGroups[5]], // forearms only
    equipment: [equipmentTypes[1]],
    difficulty: "beginner",
    instructions: [
      "Sit with forearms on thighs",
      "Hold dumbbells with palms up",
      "Curl wrists up",
      "Lower weights back down"
    ],
    tips: [
      "Keep forearms on thighs",
      "Focus on wrist movement",
      "Control the movement"
    ],
    variations: [
      "Barbell Wrist Curl",
      "Cable Wrist Curl",
      "Standing Wrist Curl",
      "Reverse Wrist Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "forearm2",
    name: "Reverse Wrist Curl",
    description: "An isolation exercise that targets the forearm extensors.",
    muscleGroups: [muscleGroups[5]], // forearms only
    equipment: [equipmentTypes[1]],
    difficulty: "beginner",
    instructions: [
      "Sit with forearms on thighs",
      "Hold dumbbells with palms down",
      "Curl wrists up",
      "Lower weights back down"
    ],
    tips: [
      "Keep forearms on thighs",
      "Focus on wrist movement",
      "Control the movement"
    ],
    variations: [
      "Barbell Reverse Wrist Curl",
      "Cable Reverse Wrist Curl",
      "Standing Reverse Wrist Curl",
      "Behind Back Wrist Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "forearm3",
    name: "Farmer's Walk",
    description: "A functional exercise that targets the forearms and grip.",
    muscleGroups: [muscleGroups[5]], // forearms only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Hold heavy dumbbells at sides",
      "Walk forward with good posture",
      "Keep core engaged",
      "Maintain grip throughout"
    ],
    tips: [
      "Keep good posture",
      "Focus on grip strength",
      "Don't let shoulders round"
    ],
    variations: [
      "Single-Arm Farmer's Walk",
      "Barbell Farmer's Walk",
      "Kettlebell Farmer's Walk",
      "Plate Pinch Walk"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  // Lower Back Exercises
  {
    id: "lowerback1",
    name: "Back Extension",
    description: "An isolation exercise that targets the lower back.",
    muscleGroups: [muscleGroups[12]], // lower back only
    equipment: [equipmentTypes[0]],
    difficulty: "beginner",
    instructions: [
      "Lie face down on ground",
      "Lift chest and legs off ground",
      "Hold position briefly",
      "Lower back to starting position"
    ],
    tips: [
      "Keep core engaged",
      "Focus on lower back contraction",
      "Don't hyperextend"
    ],
    variations: [
      "Weighted Back Extension",
      "Machine Back Extension",
      "Single-Leg Back Extension",
      "Cable Back Extension"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "lowerback2",
    name: "Good Morning",
    description: "A compound exercise that targets the lower back and hamstrings.",
    muscleGroups: [muscleGroups[12]], // lower back only
    equipment: [equipmentTypes[2]],
    difficulty: "intermediate",
    instructions: [
      "Stand with barbell on upper back",
      "Hinge at hips and bend forward",
      "Return to standing position",
      "Keep back straight throughout"
    ],
    tips: [
      "Keep back straight",
      "Focus on hip hinge",
      "Don't round back"
    ],
    variations: [
      "Dumbbell Good Morning",
      "Cable Good Morning",
      "Single-Leg Good Morning",
      "Band Good Morning"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "lowerback3",
    name: "Bird Dog",
    description: "A stability exercise that targets the lower back.",
    muscleGroups: [muscleGroups[12]], // lower back only
    equipment: [equipmentTypes[0]],
    difficulty: "beginner",
    instructions: [
      "Start on hands and knees",
      "Extend opposite arm and leg",
      "Hold position briefly",
      "Return to starting position"
    ],
    tips: [
      "Keep core engaged",
      "Maintain balance",
      "Don't let hips rotate"
    ],
    variations: [
      "Weighted Bird Dog",
      "Dynamic Bird Dog",
      "Single-Arm Bird Dog",
      "Single-Leg Bird Dog"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  // Trap Exercises
  {
    id: "trap1",
    name: "Shrug",
    description: "An isolation exercise that targets the trapezius.",
    muscleGroups: [muscleGroups[13]], // traps only
    equipment: [equipmentTypes[1]],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells at sides",
      "Shrug shoulders up toward ears",
      "Lower shoulders back down",
      "Keep arms straight"
    ],
    tips: [
      "Keep arms straight",
      "Focus on shoulder movement",
      "Don't rotate shoulders"
    ],
    variations: [
      "Barbell Shrug",
      "Cable Shrug",
      "Behind Back Shrug",
      "Upright Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "trap2",
    name: "Upright Row",
    description: "A compound exercise that targets the traps and shoulders.",
    muscleGroups: [muscleGroups[13]], // traps only
    equipment: [equipmentTypes[2]],
    difficulty: "intermediate",
    instructions: [
      "Stand with barbell at thighs",
      "Pull bar up toward chin",
      "Lower bar back to thighs",
      "Keep bar close to body"
    ],
    tips: [
      "Keep bar close to body",
      "Focus on trap contraction",
      "Don't swing body"
    ],
    variations: [
      "Dumbbell Upright Row",
      "Cable Upright Row",
      "EZ Bar Upright Row",
      "Wide Grip Upright Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "trap3",
    name: "Face Pull",
    description: "A cable exercise that targets the upper traps and rear delts.",
    muscleGroups: [muscleGroups[13]], // traps only
    equipment: [equipmentTypes[5]],
    difficulty: "intermediate",
    instructions: [
      "Stand with cable at chest level",
      "Pull rope toward face",
      "Separate hands at end",
      "Return to starting position"
    ],
    tips: [
      "Keep elbows high",
      "Focus on trap contraction",
      "Don't arch back"
    ],
    variations: [
      "Band Face Pull",
      "Single-Arm Face Pull",
      "Seated Face Pull",
      "High Cable Face Pull"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  // Lat Exercises
  {
    id: "lat1",
    name: "Pull-up",
    description: "A compound exercise that primarily targets the lats.",
    muscleGroups: [muscleGroups[14]], // lats only
    equipment: [equipmentTypes[9]],
    difficulty: "intermediate",
    instructions: [
      "Grip pull-up bar with hands wider than shoulder-width",
      "Hang with arms fully extended",
      "Pull body up until chin is over the bar",
      "Lower body back to starting position"
    ],
    tips: [
      "Keep core engaged",
      "Focus on lat contraction",
      "Control the movement"
    ],
    variations: [
      "Assisted Pull-up",
      "Wide Grip Pull-up",
      "Close Grip Pull-up",
      "Neutral Grip Pull-up"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "lat2",
    name: "Lat Pulldown",
    description: "A machine exercise that targets the latissimus dorsi.",
    muscleGroups: [muscleGroups[14]], // lats only
    equipment: [equipmentTypes[14]],
    difficulty: "beginner",
    instructions: [
      "Sit at lat pulldown machine",
      "Grip bar with wide grip",
      "Pull bar down to upper chest",
      "Return to starting position"
    ],
    tips: [
      "Keep chest up",
      "Focus on lat contraction",
      "Don't swing body"
    ],
    variations: [
      "Close Grip Pulldown",
      "Wide Grip Pulldown",
      "Single-Arm Pulldown",
      "Neutral Grip Pulldown"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "lat3",
    name: "Cable Row",
    description: "A cable exercise that targets the lats.",
    muscleGroups: [muscleGroups[14]], // lats only
    equipment: [equipmentTypes[5]],
    difficulty: "intermediate",
    instructions: [
      "Sit at cable row machine",
      "Grip handles and pull toward chest",
      "Squeeze shoulder blades together",
      "Return to starting position"
    ],
    tips: [
      "Keep chest up",
      "Focus on lat contraction",
      "Squeeze shoulder blades"
    ],
    variations: [
      "Wide Grip Cable Row",
      "Close Grip Cable Row",
      "Single-Arm Cable Row",
      "Seated Cable Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  // Deltoid Exercises (already covered in shoulders, but adding specific deltoid exercises)
  {
    id: "deltoid1",
    name: "Lateral Raise",
    description: "An isolation exercise that targets the lateral deltoids.",
    muscleGroups: [muscleGroups[15]], // deltoids only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Stand with dumbbells at sides",
      "Raise arms to shoulder level",
      "Lower arms back to sides",
      "Keep slight bend in elbows"
    ],
    tips: [
      "Keep slight bend in elbows",
      "Focus on lateral delt contraction",
      "Don't swing body"
    ],
    variations: [
      "Seated Lateral Raise",
      "Cable Lateral Raise",
      "Single-Arm Lateral Raise",
      "Bent-Over Lateral Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "deltoid2",
    name: "Front Raise",
    description: "An isolation exercise that targets the anterior deltoids.",
    muscleGroups: [muscleGroups[15]], // deltoids only
    equipment: [equipmentTypes[1]],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells at thighs",
      "Raise arms to shoulder level",
      "Lower arms back to thighs",
      "Keep arms straight"
    ],
    tips: [
      "Keep arms straight",
      "Focus on front delt contraction",
      "Don't swing body"
    ],
    variations: [
      "Barbell Front Raise",
      "Cable Front Raise",
      "Single-Arm Front Raise",
      "Plate Front Raise"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "deltoid3",
    name: "Rear Delt Fly",
    description: "An isolation exercise that targets the posterior deltoids.",
    muscleGroups: [muscleGroups[15]], // deltoids only
    equipment: [equipmentTypes[1]],
    difficulty: "intermediate",
    instructions: [
      "Bend forward at hips",
      "Hold dumbbells with arms extended",
      "Raise arms to sides",
      "Lower arms back to starting position"
    ],
    tips: [
      "Keep back straight",
      "Focus on rear delt contraction",
      "Don't use momentum"
    ],
    variations: [
      "Seated Rear Delt Fly",
      "Cable Rear Delt Fly",
      "Face-Down Rear Delt Fly",
      "Incline Rear Delt Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
]; 