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

// SMITH MACHINE EXERCISES
export const smithMachineExercises: Exercise[] = [
  {
    id: "smith_chest1",
    name: "Smith Machine Bench Press",
    description: "A chest exercise using the Smith machine for controlled movement and safety.",
    muscleGroups: [muscleGroups[0]], // chest
    equipment: [equipmentTypes[6]], // smith_machine
    difficulty: "intermediate",
    instructions: [
      "Lie on bench with Smith machine bar at chest level",
      "Grip bar slightly wider than shoulder-width",
      "Lower bar to mid-chest with control",
      "Press bar back up to starting position",
      "Keep shoulders retracted throughout movement"
    ],
    tips: [
      "The Smith machine provides stability and safety",
      "Focus on controlled movement",
      "Keep feet flat on the floor",
      "Maintain natural arch in lower back"
    ],
    variations: [
      "Smith Machine Incline Press",
      "Smith Machine Decline Press",
      "Smith Machine Close Grip Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "smith_shoulder1",
    name: "Smith Machine Shoulder Press",
    description: "A shoulder exercise using the Smith machine for overhead pressing.",
    muscleGroups: [muscleGroups[2]], // shoulders
    equipment: [equipmentTypes[6]], // smith_machine
    difficulty: "intermediate",
    instructions: [
      "Sit on bench with Smith machine bar at shoulder level",
      "Grip bar slightly wider than shoulder-width",
      "Press bar overhead until arms are fully extended",
      "Lower bar back to shoulder level with control",
      "Keep core engaged throughout movement"
    ],
    tips: [
      "Keep your back straight",
      "Don't arch your lower back",
      "Control the movement throughout",
      "Breathe steadily"
    ],
    variations: [
      "Smith Machine Military Press",
      "Smith Machine Push Press",
      "Smith Machine Behind-the-Neck Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "smith_squat1",
    name: "Smith Machine Squat",
    description: "A leg exercise using the Smith machine for controlled squatting.",
    muscleGroups: [muscleGroups[6], muscleGroups[7], muscleGroups[8]], // quads, hamstrings, glutes
    equipment: [equipmentTypes[6]], // smith_machine
    difficulty: "intermediate",
    instructions: [
      "Position Smith machine bar on upper back",
      "Stand with feet shoulder-width apart",
      "Lower body by bending knees and hips",
      "Keep chest up and knees in line with toes",
      "Return to starting position by extending legs"
    ],
    tips: [
      "Keep your core engaged",
      "Don't let knees cave inward",
      "Go as deep as your flexibility allows",
      "Keep weight in your heels"
    ],
    variations: [
      "Smith Machine Front Squat",
      "Smith Machine Split Squat",
      "Smith Machine Bulgarian Split Squat"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "smith_row1",
    name: "Smith Machine Bent-Over Row",
    description: "A back exercise using the Smith machine for rowing movement.",
    muscleGroups: [muscleGroups[1], muscleGroups[13]], // back, lats
    equipment: [equipmentTypes[6]], // smith_machine
    difficulty: "intermediate",
    instructions: [
      "Stand facing Smith machine bar",
      "Bend at hips and knees to reach bar",
      "Grip bar with hands shoulder-width apart",
      "Pull bar toward lower chest",
      "Lower bar back to starting position"
    ],
    tips: [
      "Keep your back straight",
      "Squeeze your shoulder blades together",
      "Don't use momentum",
      "Keep bar close to your body"
    ],
    variations: [
      "Smith Machine T-Bar Row",
      "Smith Machine Single-Arm Row",
      "Smith Machine Upright Row"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// CABLE EXERCISES
export const cableExercises: Exercise[] = [
  {
    id: "cable_chest1",
    name: "Cable Chest Fly",
    description: "An isolation exercise using cable machine for constant tension on chest muscles.",
    muscleGroups: [muscleGroups[0]], // chest
    equipment: [equipmentTypes[22]], // cable_fly
    difficulty: "intermediate",
    instructions: [
      "Stand between cable pulleys with handles at chest level",
      "Take a step forward with one foot",
      "Bring hands together in front of chest in arc motion",
      "Return to starting position with control",
      "Keep slight bend in elbows throughout"
    ],
    tips: [
      "Focus on chest contraction",
      "Don't let arms go behind your body",
      "Keep core engaged",
      "Maintain constant tension"
    ],
    variations: [
      "High Cable Fly",
      "Low Cable Fly",
      "Single-Arm Cable Fly",
      "Cable Crossover"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "cable_shoulder1",
    name: "Cable Lateral Raise",
    description: "A shoulder exercise using cable for lateral deltoid development.",
    muscleGroups: [muscleGroups[2]], // shoulders
    equipment: [equipmentTypes[28]], // cable_shoulder_raise
    difficulty: "intermediate",
    instructions: [
      "Stand sideways to cable machine",
      "Grip handle with arm extended down",
      "Raise arm out to side until parallel to floor",
      "Lower arm back to starting position",
      "Keep slight bend in elbow throughout"
    ],
    tips: [
      "Keep your body straight",
      "Don't swing or use momentum",
      "Focus on shoulder contraction",
      "Control the movement"
    ],
    variations: [
      "Cable Front Raise",
      "Cable Rear Delt Fly",
      "Cable Upright Row",
      "Cable Face Pull"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "cable_back1",
    name: "Cable Row",
    description: "A back exercise using cable machine for rowing movement.",
    muscleGroups: [muscleGroups[1], muscleGroups[13]], // back, lats
    equipment: [equipmentTypes[25]], // cable_row
    difficulty: "intermediate",
    instructions: [
      "Sit on floor or bench facing cable machine",
      "Grip handle with both hands",
      "Pull handle toward lower chest",
      "Squeeze shoulder blades together",
      "Return to starting position with control"
    ],
    tips: [
      "Keep your back straight",
      "Don't use momentum",
      "Focus on back contraction",
      "Keep elbows close to body"
    ],
    variations: [
      "Seated Cable Row",
      "Standing Cable Row",
      "Single-Arm Cable Row",
      "Cable Pulldown"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "cable_bicep1",
    name: "Cable Curl",
    description: "A bicep exercise using cable machine for constant tension.",
    muscleGroups: [muscleGroups[3]], // biceps
    equipment: [equipmentTypes[26]], // cable_curl
    difficulty: "intermediate",
    instructions: [
      "Stand facing cable machine",
      "Grip handle with palms facing up",
      "Curl handle toward shoulders",
      "Squeeze biceps at top of movement",
      "Lower handle back to starting position"
    ],
    tips: [
      "Keep your elbows at your sides",
      "Don't swing or use momentum",
      "Focus on bicep contraction",
      "Control the movement"
    ],
    variations: [
      "Cable Hammer Curl",
      "Cable Preacher Curl",
      "Cable Concentration Curl",
      "Cable Spider Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "cable_tricep1",
    name: "Cable Tricep Pushdown",
    description: "A tricep exercise using cable machine for pushdown movement.",
    muscleGroups: [muscleGroups[4]], // triceps
    equipment: [equipmentTypes[27]], // cable_tricep_pushdown
    difficulty: "intermediate",
    instructions: [
      "Stand facing cable machine with bar at chest level",
      "Grip bar with hands shoulder-width apart",
      "Keep elbows at your sides",
      "Push bar down until arms are extended",
      "Return to starting position with control"
    ],
    tips: [
      "Keep your elbows stationary",
      "Don't use momentum",
      "Focus on tricep contraction",
      "Keep your back straight"
    ],
    variations: [
      "Cable Overhead Extension",
      "Cable Kickback",
      "Cable Rope Pushdown",
      "Cable Single-Arm Pushdown"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "cable_face_pull1",
    name: "Cable Face Pull",
    description: "A shoulder and upper back exercise using cable machine.",
    muscleGroups: [muscleGroups[2], muscleGroups[12]], // shoulders, traps
    equipment: [equipmentTypes[31]], // cable_face_pull
    difficulty: "intermediate",
    instructions: [
      "Attach rope to high pulley",
      "Grip rope with hands facing each other",
      "Pull rope toward your face",
      "Separate hands as you pull",
      "Return to starting position"
    ],
    tips: [
      "Keep your elbows high",
      "Focus on rear deltoid contraction",
      "Don't use momentum",
      "Keep your core engaged"
    ],
    variations: [
      "Cable Rear Delt Fly",
      "Cable Upright Row",
      "Cable Shrug",
      "Cable Pull-Through"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// MACHINE EXERCISES
export const machineExercises: Exercise[] = [
  {
    id: "machine_chest1",
    name: "Chest Press Machine",
    description: "A chest exercise using a machine for controlled pressing movement.",
    muscleGroups: [muscleGroups[0]], // chest
    equipment: [equipmentTypes[8]], // chest_press_machine
    difficulty: "beginner",
    instructions: [
      "Sit on machine with back against pad",
      "Grip handles at chest level",
      "Press handles forward until arms are extended",
      "Return to starting position with control",
      "Keep back against pad throughout"
    ],
    tips: [
      "Adjust seat height for proper form",
      "Keep your back straight",
      "Don't lock out elbows",
      "Control the movement"
    ],
    variations: [
      "Incline Chest Press Machine",
      "Decline Chest Press Machine",
      "Single-Arm Chest Press Machine"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "machine_leg1",
    name: "Leg Press Machine",
    description: "A leg exercise using a machine for controlled pressing movement.",
    muscleGroups: [muscleGroups[6], muscleGroups[7], muscleGroups[8]], // quads, hamstrings, glutes
    equipment: [equipmentTypes[7]], // leg_press_machine
    difficulty: "intermediate",
    instructions: [
      "Sit on machine with back against pad",
      "Place feet on platform shoulder-width apart",
      "Press platform away until legs are extended",
      "Lower platform back to starting position",
      "Keep back against pad throughout"
    ],
    tips: [
      "Adjust seat position for proper range of motion",
      "Keep your back straight",
      "Don't lock out knees",
      "Control the movement"
    ],
    variations: [
      "Wide Stance Leg Press",
      "Narrow Stance Leg Press",
      "Single Leg Press",
      "High Foot Placement Leg Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "machine_leg_ext1",
    name: "Leg Extension Machine",
    description: "An isolation exercise for quadriceps using a machine.",
    muscleGroups: [muscleGroups[6]], // quads
    equipment: [equipmentTypes[12]], // leg_extension_machine
    difficulty: "beginner",
    instructions: [
      "Sit on machine with back against pad",
      "Place feet under roller pad",
      "Extend legs until they are straight",
      "Lower legs back to starting position",
      "Keep back against pad throughout"
    ],
    tips: [
      "Adjust seat position for proper form",
      "Focus on quadricep contraction",
      "Don't swing or use momentum",
      "Control the movement"
    ],
    variations: [
      "Single Leg Extension",
      "Seated Leg Extension",
      "Lying Leg Extension"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "machine_leg_curl1",
    name: "Leg Curl Machine",
    description: "An isolation exercise for hamstrings using a machine.",
    muscleGroups: [muscleGroups[7]], // hamstrings
    equipment: [equipmentTypes[13]], // leg_curl_machine
    difficulty: "beginner",
    instructions: [
      "Lie face down on machine",
      "Place ankles under roller pad",
      "Curl legs up toward glutes",
      "Lower legs back to starting position",
      "Keep hips pressed against pad"
    ],
    tips: [
      "Adjust pad position for proper form",
      "Focus on hamstring contraction",
      "Don't lift hips off pad",
      "Control the movement"
    ],
    variations: [
      "Seated Leg Curl",
      "Standing Leg Curl",
      "Single Leg Curl"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "machine_lat1",
    name: "Lat Pulldown Machine",
    description: "A back exercise using a machine for lat pulldown movement.",
    muscleGroups: [muscleGroups[1], muscleGroups[13]], // back, lats
    equipment: [equipmentTypes[10]], // lat_pulldown_machine
    difficulty: "beginner",
    instructions: [
      "Sit on machine with thighs secured under pads",
      "Grip bar with hands wider than shoulder-width",
      "Pull bar down to upper chest",
      "Squeeze shoulder blades together",
      "Return to starting position with control"
    ],
    tips: [
      "Keep your back straight",
      "Don't use momentum",
      "Focus on lat contraction",
      "Keep elbows pointed down"
    ],
    variations: [
      "Wide Grip Lat Pulldown",
      "Close Grip Lat Pulldown",
      "Single-Arm Lat Pulldown",
      "Behind-the-Neck Lat Pulldown"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "machine_row1",
    name: "Seated Row Machine",
    description: "A back exercise using a machine for rowing movement.",
    muscleGroups: [muscleGroups[1], muscleGroups[13]], // back, lats
    equipment: [equipmentTypes[11]], // seated_row_machine
    difficulty: "beginner",
    instructions: [
      "Sit on machine with chest against pad",
      "Grip handles with arms extended",
      "Pull handles toward lower chest",
      "Squeeze shoulder blades together",
      "Return to starting position with control"
    ],
    tips: [
      "Keep your back straight",
      "Don't use momentum",
      "Focus on back contraction",
      "Keep elbows close to body"
    ],
    variations: [
      "Wide Grip Seated Row",
      "Close Grip Seated Row",
      "Single-Arm Seated Row",
      "T-Bar Row Machine"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// KETTLEBELL EXERCISES
export const kettlebellExercises: Exercise[] = [
  {
    id: "kb_swing1",
    name: "Kettlebell Swing",
    description: "A dynamic full-body exercise using kettlebell for power and conditioning.",
    muscleGroups: [muscleGroups[6], muscleGroups[7], muscleGroups[8], muscleGroups[10]], // quads, hamstrings, glutes, abs
    equipment: [equipmentTypes[3]], // kettlebell
    difficulty: "intermediate",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Hold kettlebell with both hands between legs",
      "Hinge at hips and swing kettlebell back",
      "Explosively swing kettlebell forward to chest height",
      "Control the swing back to starting position"
    ],
    tips: [
      "Keep your back straight",
      "Use your hips, not your arms",
      "Keep the kettlebell close to your body",
      "Breathe steadily"
    ],
    variations: [
      "Single-Arm Kettlebell Swing",
      "Russian Kettlebell Swing",
      "American Kettlebell Swing",
      "Kettlebell Deadlift"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "kb_goblet1",
    name: "Kettlebell Goblet Squat",
    description: "A squat variation using kettlebell for improved form and core engagement.",
    muscleGroups: [muscleGroups[6], muscleGroups[7], muscleGroups[8], muscleGroups[10]], // quads, hamstrings, glutes, abs
    equipment: [equipmentTypes[3]], // kettlebell
    difficulty: "beginner",
    instructions: [
      "Hold kettlebell at chest level with both hands",
      "Stand with feet shoulder-width apart",
      "Lower body by bending knees and hips",
      "Keep chest up and knees in line with toes",
      "Return to starting position"
    ],
    tips: [
      "Keep the kettlebell close to your chest",
      "Keep your core engaged",
      "Go as deep as your flexibility allows",
      "Keep weight in your heels"
    ],
    variations: [
      "Kettlebell Front Squat",
      "Kettlebell Split Squat",
      "Kettlebell Bulgarian Split Squat",
      "Kettlebell Overhead Squat"
    ],
    imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    id: "kb_press1",
    name: "Kettlebell Press",
    description: "A shoulder exercise using kettlebell for overhead pressing.",
    muscleGroups: [muscleGroups[2]], // shoulders
    equipment: [equipmentTypes[3]], // kettlebell
    difficulty: "intermediate",
    instructions: [
      "Hold kettlebell at shoulder level",
      "Press kettlebell overhead until arm is extended",
      "Lower kettlebell back to shoulder level",
      "Keep core engaged throughout",
      "Alternate arms or use both"
    ],
    tips: [
      "Keep your back straight",
      "Don't arch your lower back",
      "Control the movement",
      "Breathe steadily"
    ],
    variations: [
      "Single-Arm Kettlebell Press",
      "Double Kettlebell Press",
      "Kettlebell Push Press",
      "Kettlebell Arnold Press"
    ],
    imageUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

// Combine all equipment exercises
export const allEquipmentExercises: Exercise[] = [
  ...smithMachineExercises,
  ...cableExercises,
  ...machineExercises,
  ...kettlebellExercises
]; 