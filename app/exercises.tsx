import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Search, X, ChevronRight, Activity, Plus, ArrowLeft, BarChart2, History, Info } from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { useWorkoutStore } from "@/store/workoutStore";
import BodyRegionSelector from "@/components/BodyRegionSelector";
import RegionMuscleSelector from "@/components/RegionMuscleSelector";
import EquipmentTypeSelector from "@/components/EquipmentTypeSelector";
import { Exercise } from "@/types";
import { equipmentCategories, equipment } from "@/mocks/filterData";

export default function ExercisesScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { exercises: workoutExercises } = useWorkoutStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  const [selectedEquipmentCategory, setSelectedEquipmentCategory] = useState<string | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>(workoutExercises);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [activeTab, setActiveTab] = useState<'history' | 'records' | 'about'>('history');
  
  // Get workout data from store for modal
  const { 
    getExercisePR, 
    getRecentExerciseHistory
  } = useWorkoutStore();
  
  // Get personal record and exercise history for modal
  const personalRecord = selectedExercise ? getExercisePR(selectedExercise.id) : null;
  const exerciseHistory = selectedExercise ? getRecentExerciseHistory(selectedExercise.id, 5) : [];
  
  // Update filtered exercises when search query or filters change
  useEffect(() => {
    let filtered = workoutExercises;
    
    // Apply hierarchical filters
    if (selectedRegion) {
      filtered = filtered.filter(exercise => 
        exercise.muscleGroups.some(muscle => {
          const region = getMuscleRegionMapping(muscle.name);
          return region === selectedRegion;
        })
      );
    }
    
    if (selectedMuscle) {
      // Check if selectedMuscle is an equipment category
      const isEquipmentCategory = equipmentCategories.some(category => category.name === selectedMuscle);
      
      if (isEquipmentCategory) {
        // Filter by equipment category
        filtered = filtered.filter(exercise => 
          exercise.equipment.some(eq => 
            getEquipmentCategoryMapping(eq.name) === selectedMuscle
          )
        );
      } else {
        // Filter by muscle group - map UI muscle key to exercise muscle name
        const exerciseMuscleName = mapUIMuscleToExerciseMuscle(selectedMuscle);
        
        filtered = filtered.filter(exercise => {
          const hasMuscle = exercise.muscleGroups.some(muscle => {
            const matches = muscle.name.toLowerCase() === exerciseMuscleName.toLowerCase();
            return matches;
          });
          return hasMuscle;
        });
      }
    }
    
    // Apply equipment category filter
    if (selectedEquipmentCategory) {
      filtered = filtered.filter(exercise => 
        exercise.equipment.some(eq => 
          getEquipmentCategoryMapping(eq.name) === selectedEquipmentCategory
        )
      );
    }
    
    // Apply specific equipment filter
    if (selectedEquipment) {
      filtered = filtered.filter(exercise => 
        exercise.equipment.some(eq => 
          eq.name.toLowerCase() === selectedEquipment.toLowerCase()
        )
      );
    }
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(exercise => 
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroups.some(muscle => 
          muscle.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        exercise.equipment.some(eq => 
          eq.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    setFilteredExercises(filtered);
  }, [selectedRegion, selectedMuscle, selectedEquipmentCategory, selectedEquipment, searchQuery, workoutExercises]);
  
  const handleRegionSelect = (regionKey: string) => {
    setSelectedRegion(selectedRegion === regionKey ? null : regionKey);
    setSelectedMuscle(null); // Reset muscle selection when region changes
  };
  
  const handleMuscleSelect = (muscleKey: string) => {
    setSelectedMuscle(selectedMuscle === muscleKey ? null : muscleKey);
  };
  
  const handleEquipmentCategorySelect = (category: string) => {
    setSelectedEquipmentCategory(selectedEquipmentCategory === category ? null : category);
    setSelectedEquipment(null); // Reset specific equipment when category changes
  };
  
  const handleEquipmentSelect = (equipment: string) => {
    setSelectedEquipment(selectedEquipment === equipment ? null : equipment);
  };
  
  const clearFilters = () => {
    setSelectedRegion(null);
    setSelectedMuscle(null);
    setSelectedEquipmentCategory(null);
    setSelectedEquipment(null);
    setSearchQuery('');
  };
  
  // Helper functions for filtering
  const getMuscleRegionMapping = (muscleName: string): string => {
    if (!muscleName) return 'full_body';
    
    const upperBodyMuscles = ['chest', 'shoulders', 'biceps', 'triceps', 'forearms', 'back', 'lats', 'traps', 'deltoids'];
    const lowerBodyMuscles = ['quadriceps', 'hamstrings', 'glutes', 'calves', 'hip_flexors'];
    const coreMuscles = ['abs', 'obliques', 'lower_back'];
    
    if (upperBodyMuscles.includes(muscleName.toLowerCase())) return 'upper';
    if (lowerBodyMuscles.includes(muscleName.toLowerCase())) return 'lower';
    if (coreMuscles.includes(muscleName.toLowerCase())) return 'core';
    return 'full_body';
  };
  
  const mapUIMuscleToExerciseMuscle = (uiMuscleKey: string): string => {
    if (!uiMuscleKey) return '';
    
    const muscleMapping: { [key: string]: string } = {
      'shoulders': 'shoulders',
      'back': 'back',
      'chest': 'chest',
      'triceps': 'triceps',
      'biceps': 'biceps',
      'forearms': 'forearms',
      'neck': 'neck',
      'traps': 'traps',
      'quads': 'quadriceps',
      'hamstrings': 'hamstrings',
      'glutes': 'glutes',
      'calves': 'calves',
      'hipflexors': 'hip_flexors',
      'adductors': 'adductors',
      'abs': 'abs',
      'obliques': 'obliques',
      'lowerback': 'lower_back'
    };
    return muscleMapping[uiMuscleKey] || uiMuscleKey;
  };
  
  const getEquipmentCategoryMapping = (equipmentName: string): string => {
    if (!equipmentName) return '';
    
    const bodyweightEquipment = ['bodyweight'];
    const freeWeightEquipment = ['dumbbell', 'barbell', 'kettlebell'];
    const machineEquipment = [
      'smith_machine', 'leg_press_machine', 'chest_press_machine', 'shoulder_press_machine', 
      'lat_pulldown_machine', 'seated_row_machine', 'leg_extension_machine', 'leg_curl_machine', 
      'calf_raise_machine', 'incline_hammer_strength_press', 'fly_machine', 'pec_deck_machine',
      'reverse_fly_machine', 'ab_crunch_machine', 'back_extension_machine', 'hip_abductor_machine',
      'hip_adductor_machine'
    ];
    const cableEquipment = [
      'cable_machine', 'cable_crossover', 'cable_fly', 'cable_pulldown', 'cable_row', 
      'cable_curl', 'cable_tricep_pushdown', 'cable_shoulder_raise', 'cable_woodchop',
      'cable_rotation', 'cable_pull_through', 'cable_face_pull', 'cable_upright_row', 'cable_shrug'
    ];
    const accessoryEquipment = [
      'bench', 'pull_up_bar', 'medicine_ball', 'stability_ball', 'foam_roller', 'trx', 
      'battle_ropes', 'resistance_band', 'ab_wheel', 'dip_bars', 'preacher_curl_bench',
      'incline_bench', 'decline_bench', 'flat_bench'
    ];
    const cardioEquipment = ['treadmill', 'elliptical', 'stationary_bike', 'rowing_machine', 'stair_master', 'jumping_rope'];
    
    if (bodyweightEquipment.includes(equipmentName.toLowerCase())) return 'bodyweight';
    if (freeWeightEquipment.includes(equipmentName.toLowerCase())) return 'free_weights';
    if (machineEquipment.includes(equipmentName.toLowerCase())) return 'machines';
    if (cableEquipment.includes(equipmentName.toLowerCase())) return 'cables';
    if (cardioEquipment.includes(equipmentName.toLowerCase())) return 'cardio_equipment';
    return 'accessories';
  };
  
  const handleExerciseNamePress = (exercise: Exercise) => {
    console.log('Exercise name pressed:', exercise.name);
    console.log('Current modal state before:', showModal);
    
    // Only show modal for "Cable chest fly" for testing
    if (exercise.name === "Cable chest fly") {
      setSelectedExercise(exercise);
      setShowModal(true);
      setActiveTab('about');
      console.log('Modal state set to true for Cable chest fly');
    } else {
      console.log('Modal not shown for:', exercise.name);
    }
    
    // Force a re-render by updating state
    setTimeout(() => {
      console.log('Modal state after timeout:', showModal);
    }, 100);
  };
  
  const closeModal = () => {
    setShowModal(false);
    setSelectedExercise(null);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>All Exercises</Text>
        <View style={styles.headerSpacer} />
      </View>
      
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={[styles.searchInputContainer, { backgroundColor: colors.background }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <X size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        {(selectedRegion || selectedMuscle || selectedEquipmentCategory || selectedEquipment) && (
          <TouchableOpacity 
            style={[styles.clearFiltersButton, { backgroundColor: colors.primary }]}
            onPress={clearFilters}
          >
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        <BodyRegionSelector
          selectedRegion={selectedRegion}
          onSelectRegion={handleRegionSelect}
        />
        
        <RegionMuscleSelector
          selectedRegion={selectedRegion}
          selectedMuscle={selectedMuscle}
          onSelectMuscle={handleMuscleSelect}
        />
        
        <EquipmentTypeSelector
          selectedEquipmentCategory={selectedEquipmentCategory}
          selectedEquipment={selectedEquipment}
          onSelectEquipmentCategory={handleEquipmentCategorySelect}
          onSelectEquipment={handleEquipmentSelect}
        />
        
        <ScrollView style={styles.exercisesList} contentContainerStyle={styles.exercisesListContainer}>
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <TouchableOpacity
                key={exercise.id}
                style={[styles.exerciseCard, { backgroundColor: colors.card }]}
                onPress={() => router.push(`/exercise/${exercise.id}`)}
              >
                <View style={styles.exerciseInfo}>
                  <TouchableOpacity onPress={() => handleExerciseNamePress(exercise)} style={styles.exerciseNameContainer}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
                    <Info size={16} color={colors.primary} style={styles.infoIcon} />
                  </TouchableOpacity>
                  <Text style={[styles.exerciseDescription, { color: colors.textSecondary }]}>
                    {exercise.description}
                  </Text>
                  <View style={styles.exerciseTags}>
                    {exercise.muscleGroups.map((group) => (
                      <View
                        key={group.name}
                        style={[styles.exerciseTag, { backgroundColor: colors.primary + '20' }]}
                      >
                        <Text style={[styles.exerciseTagText, { color: colors.primary }]}>
                          {group.name.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Text>
                      </View>
                    ))}
                    {exercise.isCustom && (
                      <View
                        style={[styles.exerciseTag, { backgroundColor: colors.warning + '20' }]}
                      >
                        <Text style={[styles.exerciseTagText, { color: colors.warning }]}>
                          Custom
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Activity size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                {searchQuery ? "No exercises found matching your search" : "No exercises available"}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* Floating Create Custom Exercise Button */}
      <TouchableOpacity
        style={[styles.floatingButton, { backgroundColor: colors.primary }]}
        onPress={() => router.push('/create-custom-exercise')}
        activeOpacity={0.8}
      >
        <Plus size={24} color="#FFFFFF" />
        <Text style={styles.floatingButtonText}>Create Custom Exercise</Text>
      </TouchableOpacity>

      {/* Exercise Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={[styles.modalOverlay, { backgroundColor: 'rgba(255, 0, 255, 0.9)' }]}>
          <View style={[styles.modalContainer, { backgroundColor: '#FFFF00' }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: '#FF0000', fontSize: 24, fontWeight: 'bold' }]}>
                CABLE CHEST FLY MODAL TEST
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
            
            <View style={{ padding: 20 }}>
              <Text style={[styles.aboutDescription, { color: '#FF0000', fontSize: 18 }]}>
                This is a test modal for Cable chest fly!
              </Text>
              
              <Text style={[styles.aboutTitle, { color: '#FF0000', marginTop: 20, fontSize: 20 }]}>
                Exercise: {selectedExercise?.name}
              </Text>
              
              <Text style={[styles.aboutDescription, { color: '#FF0000', marginTop: 10 }]}>
                {selectedExercise?.description || 'No description available'}
              </Text>
              
              <TouchableOpacity 
                style={[styles.clearFiltersButton, { backgroundColor: '#FF0000', marginTop: 20, padding: 15 }]}
                onPress={closeModal}
              >
                <Text style={[styles.clearFiltersText, { fontSize: 18 }]}>CLOSE MODAL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Helper function to get badge color
const getBadgeColor = (difficulty: "beginner" | "intermediate" | "advanced" | undefined) => {
  switch (difficulty) {
    case "beginner":
      return "#4CD964";
    case "intermediate":
      return "#FFCC00";
    case "advanced":
      return "#FF3B30";
    default:
      return "#5E5CE6";
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  exercisesList: {
    flex: 1,
  },
  exercisesListContainer: {
    paddingBottom: 20,
  },
  exerciseCard: {
    flexDirection: 'row',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoIcon: {
    marginLeft: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  exerciseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exerciseTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  exerciseTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  modalContainer: {
    width: '90%',
    maxHeight: '85%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1001,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    padding: 12,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderColor: '#3498db',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  tabContent: {
    flex: 1,
    minHeight: 300,
  },
  historyTab: {
    flex: 1,
  },
  historyItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyItemDate: {
    width: 100,
  },
  historyItemDateText: {
    fontSize: 12,
  },
  historyItemWorkout: {
    fontSize: 14,
    fontWeight: '600',
  },
  historyItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  historyItemDetail: {
    width: '33.33%',
  },
  historyItemDetailLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  historyItemDetailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  recordsTab: {
    flex: 1,
  },
  recordCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: 16,
  },
  recordCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recordCardValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  recordCardDate: {
    fontSize: 12,
    color: '#666666',
  },
  recordsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  recordGridItem: {
    width: '48%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
  },
  recordGridItemTitle: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  recordGridItemValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  aboutTab: {
    flex: 1,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  aboutDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  aboutDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aboutDetailItem: {
    width: '48%',
  },
  aboutDetailTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  aboutDetailTag: {
    padding: 4,
    borderRadius: 8,
  },
  aboutDetailTagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  aboutDetailTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  aboutDifficultyBadge: {
    padding: 4,
    borderRadius: 8,
  },
  aboutDifficultyText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyStateSubtext: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
}); 