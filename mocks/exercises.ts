import { Exercise, EquipmentType, MuscleGroup, BodyRegion } from '@/types';
import { allPrimaryMuscleExercises } from './primaryMuscleExercises';
import { allAdditionalExercises } from './additionalExercises';
import { allEquipmentExercises } from './equipmentExercises';

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

export const exercises: Exercise[] = [
  ...allPrimaryMuscleExercises,
  ...allAdditionalExercises,
  ...allEquipmentExercises
];