import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal, Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Search as SearchIcon, X, ArrowLeft, Filter, SlidersHorizontal, Dumbbell } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useWorkoutStore } from "@/store/workoutStore";
import WorkoutCard from "@/components/WorkoutCard";
import { Exercise, Workout, BodyRegion, MuscleGroup, EquipmentType } from "@/types";
import ExerciseCard from "@/components/ExerciseCard";

export default function SearchScreen() {
  const router = useRouter();
  const { 
    workouts, 
    exercises,
    getBodyRegions,
    getMuscleGroups,
    getEquipmentTypes,
    getFilteredExercises
  } = useWorkoutStore();
  
  const [query, setQuery] = useState("");
  const [workoutResults, setWorkoutResults] = useState<Workout[]>([]);
  const [exerciseResults, setExerciseResults] = useState<Exercise[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filterType, setFilterType] = useState<"all" | "workouts" | "exercises">("all");
  const [filterBodyRegion, setFilterBodyRegion] = useState<BodyRegion | null>(null);
  const [filterMuscleGroup, setFilterMuscleGroup] = useState<MuscleGroup | null>(null);
  const [filterEquipment, setFilterEquipment] = useState<EquipmentType | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
  
  // Get filter options
  const bodyRegions = getBodyRegions();
  const muscleGroups = getMuscleGroups(filterBodyRegion || undefined);
  const equipmentTypes = getEquipmentTypes();
  const difficulties = ["beginner", "intermediate", "advanced"];
  
  useEffect(() => {
    if (query.trim().length > 0) {
      // For exercises, use the filtered exercises function
      const exerciseFilters = {
        bodyRegion: filterBodyRegion || undefined,
        muscleGroup: filterMuscleGroup || undefined,
        equipment: filterEquipment || undefined,
        difficulty: filterDifficulty as 'beginner' | 'intermediate' | 'advanced' || undefined,
        searchQuery: query,
      };
      
      const matchedExercises = filterType === "workouts" 
        ? [] 
        : getFilteredExercises(exerciseFilters);
      
      // For workouts, filter manually
      const lowerQuery = query.toLowerCase();
      const matchedWorkouts = filterType === "exercises" 
        ? [] 
        : workouts.filter(workout => 
            (filterDifficulty === null || workout.difficulty === filterDifficulty) &&
            (
              workout.name.toLowerCase().includes(lowerQuery) || 
              workout.description.toLowerCase().includes(lowerQuery) ||
              workout.category.toLowerCase().includes(lowerQuery) ||
              workout.exercises.some(ex => 
                ex.name.toLowerCase().includes(lowerQuery) ||
                ex.muscleGroups.some(mg => mg.toLowerCase().includes(lowerQuery))
              )
            )
          );
      
      setWorkoutResults(matchedWorkouts);
      setExerciseResults(matchedExercises);
    } else {
      setWorkoutResults([]);
      setExerciseResults([]);
    }
  }, [query, filterType, filterBodyRegion, filterMuscleGroup, filterEquipment, filterDifficulty]);

  const clearSearch = () => {
    setQuery("");
    setWorkoutResults([]);
    setExerciseResults([]);
  };
  
  const clearFilters = () => {
    setFilterType("all");
    setFilterBodyRegion(null);
    setFilterMuscleGroup(null);
    setFilterEquipment(null);
    setFilterDifficulty(null);
  };
  
  const applyFilters = () => {
    setShowFilterModal(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  type SearchResultItem = 
    | { type: "workoutHeader" }
    | { type: "exerciseHeader" }
    | { type: "workout"; data: Workout }
    | { type: "exercise"; data: Exercise };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleGoBack}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <SearchIcon size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search workouts, exercises, or muscle groups..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            autoFocus
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <X size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <SlidersHorizontal size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        {query.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Search Workouts & Exercises</Text>
            <Text style={styles.emptyStateText}>
              Search by name, muscle group, or equipment type
            </Text>
          </View>
        ) : workoutResults.length === 0 && exerciseResults.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No results found</Text>
            <Text style={styles.emptyStateText}>
              Try searching for different keywords or adjusting your filters
            </Text>
          </View>
        ) : (
          <FlatList
            data={[
              ...(workoutResults.length > 0 ? [{ type: "workoutHeader" } as SearchResultItem] : []),
              ...workoutResults.map(item => ({ type: "workout", data: item } as SearchResultItem)),
              ...(exerciseResults.length > 0 ? [{ type: "exerciseHeader" } as SearchResultItem] : []),
              ...exerciseResults.map(item => ({ type: "exercise", data: item } as SearchResultItem)),
            ]}
            keyExtractor={(item, index) => {
              if (item.type === "workoutHeader") return "workoutHeader";
              if (item.type === "exerciseHeader") return "exerciseHeader";
              return item.type === "workout" ? `workout-${(item as {type: string, data: Workout}).data.id}` : 
                     item.type === "exercise" ? `exercise-${(item as {type: string, data: Exercise}).data.id}` : 
                     index.toString();
            }}
            renderItem={({ item }) => {
              if (item.type === "workoutHeader") {
                return (
                  <Text style={styles.sectionHeader}>Workouts ({workoutResults.length})</Text>
                );
              }
              if (item.type === "exerciseHeader") {
                return (
                  <Text style={styles.sectionHeader}>Exercises ({exerciseResults.length})</Text>
                );
              }
              if (item.type === "workout") {
                return <WorkoutCard workout={(item as {type: string, data: Workout}).data} />;
              }
              if (item.type === "exercise") {
                return <ExerciseCard exercise={(item as {type: string, data: Exercise}).data} />;
              }
              return null;
            }}
            contentContainerStyle={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowFilterModal(false)}
        >
          <Pressable style={styles.modalContent} onPress={e => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Results</Text>
              <TouchableOpacity 
                onPress={() => setShowFilterModal(false)}
                style={styles.modalCloseButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.filterSectionTitle}>Type</Text>
              <View style={styles.filterTypeContainer}>
                <TouchableOpacity 
                  style={[
                    styles.filterTypeButton,
                    filterType === "all" && styles.filterTypeButtonActive
                  ]}
                  onPress={() => setFilterType("all")}
                >
                  <Text style={[
                    styles.filterTypeText,
                    filterType === "all" && styles.filterTypeTextActive
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.filterTypeButton,
                    filterType === "workouts" && styles.filterTypeButtonActive
                  ]}
                  onPress={() => setFilterType("workouts")}
                >
                  <Text style={[
                    styles.filterTypeText,
                    filterType === "workouts" && styles.filterTypeTextActive
                  ]}>
                    Workouts
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.filterTypeButton,
                    filterType === "exercises" && styles.filterTypeButtonActive
                  ]}
                  onPress={() => setFilterType("exercises")}
                >
                  <Text style={[
                    styles.filterTypeText,
                    filterType === "exercises" && styles.filterTypeTextActive
                  ]}>
                    Exercises
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text style={styles.filterSectionTitle}>Body Region</Text>
              <View style={styles.filterCategoryContainer}>
                <TouchableOpacity 
                  style={[
                    styles.filterCategoryChip,
                    filterBodyRegion === null && styles.filterCategoryChipActive
                  ]}
                  onPress={() => {
                    setFilterBodyRegion(null);
                    setFilterMuscleGroup(null);
                  }}
                >
                  <Text style={[
                    styles.filterCategoryText,
                    filterBodyRegion === null && styles.filterCategoryTextActive
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>
                
                {bodyRegions.map(region => (
                  <TouchableOpacity 
                    key={region}
                    style={[
                      styles.filterCategoryChip,
                      filterBodyRegion === region && styles.filterCategoryChipActive
                    ]}
                    onPress={() => {
                      setFilterBodyRegion(region);
                      setFilterMuscleGroup(null);
                    }}
                  >
                    <Text style={[
                      styles.filterCategoryText,
                      filterBodyRegion === region && styles.filterCategoryTextActive
                    ]}>
                      {region}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {filterBodyRegion && (
                <>
                  <Text style={styles.filterSectionTitle}>Muscle Group</Text>
                  <View style={styles.filterCategoryContainer}>
                    <TouchableOpacity 
                      style={[
                        styles.filterCategoryChip,
                        filterMuscleGroup === null && styles.filterCategoryChipActive
                      ]}
                      onPress={() => setFilterMuscleGroup(null)}
                    >
                      <Text style={[
                        styles.filterCategoryText,
                        filterMuscleGroup === null && styles.filterCategoryTextActive
                      ]}>
                        All
                      </Text>
                    </TouchableOpacity>
                    
                    {muscleGroups.map(group => (
                      <TouchableOpacity 
                        key={group}
                        style={[
                          styles.filterCategoryChip,
                          filterMuscleGroup === group && styles.filterCategoryChipActive
                        ]}
                        onPress={() => setFilterMuscleGroup(group)}
                      >
                        <Text style={[
                          styles.filterCategoryText,
                          filterMuscleGroup === group && styles.filterCategoryTextActive
                        ]}>
                          {group}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
              
              <Text style={styles.filterSectionTitle}>Equipment</Text>
              <View style={styles.filterCategoryContainer}>
                <TouchableOpacity 
                  style={[
                    styles.filterCategoryChip,
                    filterEquipment === null && styles.filterCategoryChipActive
                  ]}
                  onPress={() => setFilterEquipment(null)}
                >
                  <Text style={[
                    styles.filterCategoryText,
                    filterEquipment === null && styles.filterCategoryTextActive
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>
                
                {equipmentTypes.map(equipment => (
                  <TouchableOpacity 
                    key={equipment}
                    style={[
                      styles.filterCategoryChip,
                      filterEquipment === equipment && styles.filterCategoryChipActive
                    ]}
                    onPress={() => setFilterEquipment(equipment)}
                  >
                    <Text style={[
                      styles.filterCategoryText,
                      filterEquipment === equipment && styles.filterCategoryTextActive
                    ]}>
                      {equipment}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Text style={styles.filterSectionTitle}>Difficulty</Text>
              <View style={styles.filterDifficultyContainer}>
                <TouchableOpacity 
                  style={[
                    styles.filterDifficultyChip,
                    filterDifficulty === null && styles.filterDifficultyChipActive
                  ]}
                  onPress={() => setFilterDifficulty(null)}
                >
                  <Text style={[
                    styles.filterDifficultyText,
                    filterDifficulty === null && styles.filterDifficultyTextActive
                  ]}>
                    All
                  </Text>
                </TouchableOpacity>
                
                {difficulties.map(difficulty => (
                  <TouchableOpacity 
                    key={difficulty}
                    style={[
                      styles.filterDifficultyChip,
                      filterDifficulty === difficulty && styles.filterDifficultyChipActive
                    ]}
                    onPress={() => setFilterDifficulty(difficulty)}
                  >
                    <Text style={[
                      styles.filterDifficultyText,
                      filterDifficulty === difficulty && styles.filterDifficultyTextActive
                    ]}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.clearFiltersButton}
                onPress={clearFilters}
              >
                <Text style={styles.clearFiltersText}>Clear All</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.applyFiltersButton}
                onPress={applyFilters}
              >
                <Text style={styles.applyFiltersText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    height: "100%",
  },
  clearButton: {
    padding: 4,
  },
  filterButton: {
    marginLeft: 12,
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
  },
  resultsList: {
    paddingBottom: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: "70%",
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  filterTypeContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  filterTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    backgroundColor: colors.card,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  filterTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  filterTypeText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
  },
  filterTypeTextActive: {
    color: "#FFFFFF",
  },
  filterCategoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  filterCategoryChip: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  filterCategoryChipActive: {
    backgroundColor: colors.primary,
  },
  filterCategoryText: {
    fontSize: 14,
    color: colors.text,
  },
  filterCategoryTextActive: {
    color: "#FFFFFF",
  },
  filterDifficultyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  filterDifficultyChip: {
    backgroundColor: colors.card,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  filterDifficultyChipActive: {
    backgroundColor: colors.primary,
  },
  filterDifficultyText: {
    fontSize: 14,
    color: colors.text,
  },
  filterDifficultyTextActive: {
    color: "#FFFFFF",
  },
  modalFooter: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  clearFiltersButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
  },
  clearFiltersText: {
    fontSize: 16,
    color: colors.text,
  },
  applyFiltersButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  applyFiltersText: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "500",
  },
});