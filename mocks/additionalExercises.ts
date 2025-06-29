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

// Additional Chest Exercises (Primary Target)
export const additionalChestExercises: Exercise[] = [
  {
    id: "ex149",
    name: "Decline Barbell Bench Press",
    description: "A chest exercise that targets the lower chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest
    equipment: [equipmentTypes[2], equipmentTypes[8]], // barbell, bench
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
    id: "ex150",
    name: "Cable Chest Fly",
    description: "An isolation exercise that targets the chest muscles with constant tension.",
    muscleGroups: [muscleGroups[0]], // chest
    equipment: [equipmentTypes[5]], // cable_machine
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
      "Single-Arm Cable Fly"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "ex151",
    name: "Diamond Push-up",
    description: "A bodyweight exercise that targets the chest with emphasis on inner chest.",
    muscleGroups: [muscleGroups[0]], // chest
    equipment: [equipmentTypes[0]], // bodyweight
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
    id: "ex152",
    name: "Pec Deck Machine",
    description: "A machine-based isolation exercise for the chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest
    equipment: [equipmentTypes[14]], // machine
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
    id: "ex153",
    name: "Resistance Band Chest Press",
    description: "A chest exercise using resistance bands for constant tension.",
    muscleGroups: [muscleGroups[0]], // chest
    equipment: [equipmentTypes[4]], // resistance_band
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
  }
];

// Additional Shoulder Exercises (Primary Target)
export const additionalShoulderExercises: Exercise[] = [
  // Removed duplicate exercises that are now in primary muscle exercises
];

// Additional Bicep Exercises (Primary Target)
export const additionalBicepExercises: Exercise[] = [
  {
    id: "ex157",
    name: "Concentration Curl",
    description: "An isolation exercise that targets the biceps with focus on peak contraction.",
    muscleGroups: [muscleGroups[3]], // biceps
    equipment: [equipmentTypes[1]], // dumbbell
    difficulty: "beginner",
    instructions: [
      "Sit with elbow on inner thigh",
      "Hold dumbbell with arm extended",
      "Curl weight toward shoulder",
      "Lower with control"
    ],
    tips: [
      "Keep elbow stationary",
      "Focus on bicep contraction",
      "Don't swing body"
    ],
    variations: [
      "Standing Concentration Curl",
      "Seated Concentration Curl",
      "Cable Concentration Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "ex158",
    name: "Incline Dumbbell Curl",
    description: "A bicep exercise performed on an incline bench for full range of motion.",
    muscleGroups: [muscleGroups[3]], // biceps
    equipment: [equipmentTypes[1], equipmentTypes[8]], // dumbbell, bench
    difficulty: "intermediate",
    instructions: [
      "Lie on incline bench",
      "Hold dumbbells with arms extended",
      "Curl weights toward shoulders",
      "Lower with control"
    ],
    tips: [
      "Keep back flat on bench",
      "Focus on bicep contraction",
      "Control the movement"
    ],
    variations: [
      "Incline Hammer Curl",
      "Incline Spider Curl",
      "Incline Cable Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "ex159",
    name: "Spider Curl",
    description: "A bicep exercise that emphasizes the peak contraction.",
    muscleGroups: [muscleGroups[3]], // biceps
    equipment: [equipmentTypes[1]], // dumbbell
    difficulty: "intermediate",
    instructions: [
      "Lie face down on incline bench",
      "Hold dumbbells with arms extended",
      "Curl weights toward shoulders",
      "Lower with control"
    ],
    tips: [
      "Keep chest flat on bench",
      "Focus on peak contraction",
      "Control the movement"
    ],
    variations: [
      "Barbell Spider Curl",
      "Cable Spider Curl",
      "EZ Bar Spider Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Additional Tricep Exercises (Primary Target)
export const additionalTricepExercises: Exercise[] = [
  {
    id: "ex160",
    name: "Skull Crushers",
    description: "A tricep exercise performed lying down with barbell or dumbbells.",
    muscleGroups: [muscleGroups[4]], // triceps
    equipment: [equipmentTypes[2], equipmentTypes[8]], // barbell, bench
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with barbell overhead",
      "Lower bar toward forehead",
      "Extend arms back to starting position",
      "Keep elbows stationary"
    ],
    tips: [
      "Keep elbows in place",
      "Focus on tricep contraction",
      "Control the movement"
    ],
    variations: [
      "Dumbbell Skull Crushers",
      "EZ Bar Skull Crushers",
      "Cable Skull Crushers"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "ex161",
    name: "Diamond Push-up",
    description: "A bodyweight tricep exercise that emphasizes tricep engagement.",
    muscleGroups: [muscleGroups[4]], // triceps
    equipment: [equipmentTypes[0]], // bodyweight
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
      "Diamond Push-up with Clap"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Additional Back Exercises (Primary Target)
export const additionalBackExercises: Exercise[] = [
  {
    id: "ex162",
    name: "T-Bar Row",
    description: "A compound back exercise using a T-bar machine.",
    muscleGroups: [muscleGroups[1]], // back
    equipment: [equipmentTypes[14]], // machine
    difficulty: "intermediate",
    instructions: [
      "Stand over T-bar machine",
      "Grip handles with both hands",
      "Pull bar toward chest",
      "Lower with control"
    ],
    tips: [
      "Keep back straight",
      "Focus on back contraction",
      "Don't use momentum"
    ],
    variations: [
      "Wide Grip T-Bar Row",
      "Close Grip T-Bar Row",
      "Single-Arm T-Bar Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "ex163",
    name: "Face Pull",
    description: "A back exercise that targets the rear deltoids and upper back.",
    muscleGroups: [muscleGroups[1]], // back
    equipment: [equipmentTypes[5]], // cable_machine
    difficulty: "beginner",
    instructions: [
      "Stand facing cable machine",
      "Grip rope with hands at eye level",
      "Pull rope toward face",
      "Return to starting position"
    ],
    tips: [
      "Keep elbows high",
      "Focus on upper back contraction",
      "Maintain proper posture"
    ],
    variations: [
      "High Face Pull",
      "Low Face Pull",
      "Single-Arm Face Pull"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Additional Quadriceps Exercises (Primary Target)
export const additionalQuadExercises: Exercise[] = [
  {
    id: "ex164",
    name: "Leg Extension",
    description: "An isolation exercise that targets the quadriceps.",
    muscleGroups: [muscleGroups[6]], // quadriceps
    equipment: [equipmentTypes[14]], // machine
    difficulty: "beginner",
    instructions: [
      "Sit in leg extension machine",
      "Position pad against lower legs",
      "Extend legs until straight",
      "Lower with control"
    ],
    tips: [
      "Keep back flat against pad",
      "Focus on quad contraction",
      "Don't lock knees"
    ],
    variations: [
      "Single-Leg Extension",
      "Seated Leg Extension",
      "Standing Leg Extension"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "ex165",
    name: "Hack Squat",
    description: "A machine-based squat variation that targets the quadriceps.",
    muscleGroups: [muscleGroups[6]], // quadriceps
    equipment: [equipmentTypes[14]], // machine
    difficulty: "intermediate",
    instructions: [
      "Position yourself in hack squat machine",
      "Place feet shoulder-width apart",
      "Lower body until thighs are parallel",
      "Push back up to starting position"
    ],
    tips: [
      "Keep back flat against pad",
      "Focus on quad contraction",
      "Control the movement"
    ],
    variations: [
      "Wide Stance Hack Squat",
      "Narrow Stance Hack Squat",
      "Single-Leg Hack Squat"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Additional Hamstring Exercises (Primary Target)
export const additionalHamstringExercises: Exercise[] = [
  {
    id: "ex166",
    name: "Leg Curl",
    description: "An isolation exercise that targets the hamstrings.",
    muscleGroups: [muscleGroups[7]], // hamstrings
    equipment: [equipmentTypes[14]], // machine
    difficulty: "beginner",
    instructions: [
      "Lie face down on leg curl machine",
      "Position pad against lower legs",
      "Curl legs toward glutes",
      "Lower with control"
    ],
    tips: [
      "Keep hips flat on bench",
      "Focus on hamstring contraction",
      "Don't use momentum"
    ],
    variations: [
      "Standing Leg Curl",
      "Seated Leg Curl",
      "Single-Leg Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "ex167",
    name: "Glute-Ham Raise",
    description: "A bodyweight exercise that targets the hamstrings and glutes.",
    muscleGroups: [muscleGroups[7]], // hamstrings
    equipment: [equipmentTypes[0]], // bodyweight
    difficulty: "advanced",
    instructions: [
      "Position yourself in GHR machine",
      "Lower body forward with control",
      "Pull body back up using hamstrings",
      "Keep body straight throughout"
    ],
    tips: [
      "Keep body in straight line",
      "Focus on hamstring contraction",
      "Control the movement"
    ],
    variations: [
      "Assisted GHR",
      "Nordic Hamstring Curl",
      "Single-Leg GHR"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Additional Abs Exercises (Primary Target)
export const additionalAbsExercises: Exercise[] = [
  {
    id: "ex168",
    name: "Hanging Leg Raise",
    description: "An advanced abs exercise that targets the lower abs.",
    muscleGroups: [muscleGroups[10]], // abs
    equipment: [equipmentTypes[9]], // pull_up_bar
    difficulty: "advanced",
    instructions: [
      "Hang from pull-up bar",
      "Raise legs to parallel or higher",
      "Lower legs with control",
      "Keep body stable"
    ],
    tips: [
      "Keep body straight",
      "Focus on lower abs",
      "Don't swing body"
    ],
    variations: [
      "Knee Raise",
      "Straight Leg Raise",
      "Windshield Wipers"
    ],
    imageUrl: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "ex169",
    name: "Cable Woodchop",
    description: "A dynamic abs exercise that targets the obliques and core.",
    muscleGroups: [muscleGroups[10]], // abs
    equipment: [equipmentTypes[5]], // cable_machine
    difficulty: "intermediate",
    instructions: [
      "Stand with cable at high position",
      "Grip handle with both hands",
      "Rotate and pull cable across body",
      "Return to starting position"
    ],
    tips: [
      "Keep core engaged",
      "Focus on rotation",
      "Control the movement"
    ],
    variations: [
      "Low to High Woodchop",
      "High to Low Woodchop",
      "Single-Arm Woodchop"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Combine all additional exercises
export const allAdditionalExercises: Exercise[] = [
  ...additionalChestExercises,
  ...additionalShoulderExercises,
  ...additionalBicepExercises,
  ...additionalTricepExercises,
  ...additionalBackExercises,
  ...additionalQuadExercises,
  ...additionalHamstringExercises,
  ...additionalAbsExercises
]; 