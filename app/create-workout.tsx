import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  Modal,
  FlatList,
  Pressable
} from "react-native";
import { Stack, useRouter } from "expo-router";
import { 
  ArrowLeft, 
  Plus, 
  X, 
  Clock, 
  Dumbbell, 
  BarChart, 
  Tag,
  Search,
  Check
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { useWorkoutStore } from "@/store/workoutStore";
import { exercises } from "@/mocks/exercises";
import { Exercise } from "@/types";
import Button from "@/components/Button";
import ExerciseCard from "@/components/ExerciseCard";

export default function CreateWorkoutScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addWorkout } = useWorkoutStore();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("45");
  const [category, setCategory] = useState("Strength");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  
  // Get unique categories and muscle groups for filtering
  const exerciseCategories = Array.from(new Set(exercises.map(ex => ex.category)));
  const muscleGroups = Array.from(
    new Set(exercises.flatMap(ex => ex.muscleGroups))
  ).sort();
  
  // Filter exercises based on search query and filters
  const filteredExercises = exercises.filter(exercise => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        exercise.name.toLowerCase().includes(query) ||
        exercise.description.toLowerCase().includes(query) ||
        exercise.muscleGroups.some(mg => mg.toLowerCase().includes(query))
      );
    }
    return true;
  }).filter(exercise => {
    // Filter by category
    if (selectedFilter) {
      return exercise.category === selectedFilter;
    }
    return true;
  }).filter(exercise => {
    // Filter by muscle group
    if (selectedMuscleGroup) {
      return exercise.muscleGroups.includes(selectedMuscleGroup);
    }
    return true;
  });
  
  const handleAddExercise = (exercise: Exercise) => {
    if (selectedExercises.some(ex => ex.id === exercise.id)) {
      // Exercise already added, remove it
      setSelectedExercises(selectedExercises.filter(ex => ex.id !== exercise.id));
    } else {
      // Add exercise
      setSelectedExercises([...selectedExercises, exercise]);
    }
  };
  
  const handleRemoveExercise = (exerciseId: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== exerciseId));
  };
  
  const handleSaveWorkout = () => {
    if (!name) {
      Alert.alert("Error", "Please enter a workout name");
      return;
    }
    
    if (selectedExercises.length === 0) {
      Alert.alert("Error", "Please add at least one exercise");
      return;
    }
    
    const newWorkout = {
      id: Date.now().toString(),
      name,
      description: description || `Custom workout: ${name}`,
      exercises: selectedExercises.map(ex => ({ id: ex.id })),
      duration: parseInt(duration) || 45,
      difficulty: difficulty as "beginner" | "intermediate" | "advanced",
      category,
      // Add these fields to match the Workout type in the store
      estimatedDuration: parseInt(duration) || 45,
      intensity: difficulty === "beginner" ? "low" : difficulty === "intermediate" ? "medium" : "high",
      muscleGroups: Array.from(new Set(selectedExercises.flatMap(ex => ex.muscleGroups))),
      equipment: Array.from(new Set(selectedExercises.flatMap(ex => ex.equipment))),
      image: selectedExercises[0]?.image || "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    };
    
    // Add the workout to the store
    addWorkout(newWorkout);
    
    // Show success alert and navigate back to workouts
    Alert.alert(
      "Success", 
      "Workout created successfully", 
      [{ 
        text: "OK", 
        onPress: () => {
          router.push("/(tabs)/workouts");
        } 
      }]
    );
  };
  
  // Fixed: Ensure the back button works properly
  const handleGoBack = () => {
    // Check if there are unsaved changes
    if (name || description || selectedExercises.length > 0) {
      Alert.alert(
        "Discard Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Discard", 
            style: "destructive", 
            onPress: () => {
              router.push("/(tabs)/workouts");
            }
          }
        ]
      );
    } else {
      router.push("/(tabs)/workouts");
    }
  };

  // Fixed: Ensure the cancel button works properly
  const handleCancel = () => {
    // Check if there are unsaved changes
    if (name || description || selectedExercises.length > 0) {
      Alert.alert(
        "Cancel Workout Creation",
        "Are you sure you want to cancel? All changes will be lost.",
        [
          { text: "No", style: "cancel" },
          { 
            text: "Yes", 
            style: "destructive", 
            onPress: () => {
              router.push("/(tabs)/workouts");
            }
          }
        ]
      );
    } else {
      // If no changes, just go back
      router.push("/(tabs)/workouts");
    }
  };
  
  const isExerciseSelected = (exerciseId: string) => {
    return selectedExercises.some(ex => ex.id === exerciseId);
  };

  // Fixed: Improved category selection with more options
  const handleCategorySelect = () => {
    Alert.alert(
      "Select Category",
      "Choose a workout category",
      [
        { text: "Strength", onPress: () => setCategory("Strength") },
        { text: "Cardio", onPress: () => setCategory("Cardio") },
        { text: "Bodyweight", onPress: () => setCategory("Bodyweight") },
        { text: "Core", onPress: () => setCategory("Core") },
        { text: "Flexibility", onPress: () => setCategory("Flexibility") },
        { text: "HIIT", onPress: () => setCategory("HIIT") },
        { text: "Yoga", onPress: () => setCategory("Yoga") },
        { text: "Pilates", onPress: () => setCategory("Pilates") },
        { text: "CrossFit", onPress: () => setCategory("CrossFit") },
        { text: "Custom", onPress: () => {
          // Allow custom category input
          Alert.prompt(
            "Custom Category",
            "Enter a custom category name",
            [
              { text: "Cancel", style: "cancel" },
              { text: "OK", onPress: text => text && setCategory(text) }
            ],
            "plain-text"
          );
        }},
        { text: "Cancel", style: "cancel" }
      ]
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: "Create Workout",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the workouts screen"
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          // Add a more visible back button text
          headerBackTitle: "Back",
          // Ensure the header is visible
          headerShown: true,
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Workout Details</Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter workout name"
              placeholderTextColor={colors.textSecondary}
              value={name}
              onChangeText={setName}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              placeholder="Enter workout description"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>
          
          <View style={styles.row}>
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Duration (min)</Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
                placeholder="45"
                placeholderTextColor={colors.textSecondary}
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
              />
            </View>
            
            <View style={[styles.inputContainer, styles.halfWidth]}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Category</Text>
              <View style={[styles.pickerContainer, { backgroundColor: colors.background, borderColor: colors.border }]}>
                <TouchableOpacity 
                  style={styles.pickerButton}
                  onPress={handleCategorySelect}
                >
                  <Text style={[styles.pickerButtonText, { color: colors.text }]}>{category}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: colors.text }]}>Difficulty</Text>
            <View style={styles.difficultyContainer}>
              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  difficulty === "beginner" && [styles.difficultyButtonActive, { backgroundColor: colors.primary, borderColor: colors.primary }],
                ]}
                onPress={() => setDifficulty("beginner")}
              >
                <Text
                  style={[
                    styles.difficultyButtonText,
                    { color: colors.text },
                    difficulty === "beginner" && [styles.difficultyButtonTextActive, { color: "#FFFFFF" }],
                  ]}
                >
                  Beginner
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  difficulty === "intermediate" && [styles.difficultyButtonActive, { backgroundColor: colors.primary, borderColor: colors.primary }],
                ]}
                onPress={() => setDifficulty("intermediate")}
              >
                <Text
                  style={[
                    styles.difficultyButtonText,
                    { color: colors.text },
                    difficulty === "intermediate" && [styles.difficultyButtonTextActive, { color: "#FFFFFF" }],
                  ]}
                >
                  Intermediate
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.difficultyButton,
                  { backgroundColor: colors.background, borderColor: colors.border },
                  difficulty === "advanced" && [styles.difficultyButtonActive, { backgroundColor: colors.primary, borderColor: colors.primary }],
                ]}
                onPress={() => setDifficulty("advanced")}
              >
                <Text
                  style={[
                    styles.difficultyButtonText,
                    { color: colors.text },
                    difficulty === "advanced" && [styles.difficultyButtonTextActive, { color: "#FFFFFF" }],
                  ]}
                >
                  Advanced
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowExerciseModal(true)}
            >
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>Add Exercise</Text>
            </TouchableOpacity>
          </View>
          
          {selectedExercises.length === 0 ? (
            <View style={styles.emptyExercises}>
              <Dumbbell size={40} color={colors.textLight} />
              <Text style={[styles.emptyExercisesText, { color: colors.textSecondary }]}>
                No exercises added yet. Tap "Add Exercise" to build your workout.
              </Text>
            </View>
          ) : (
            <View style={styles.exercisesList}>
              {selectedExercises.map((exercise, index) => (
                <View key={exercise.id} style={[styles.exerciseItem, { backgroundColor: colors.background }]}>
                  <View style={[styles.exerciseNumber, { backgroundColor: colors.primary }]}>
                    <Text style={styles.exerciseNumberText}>{index + 1}</Text>
                  </View>
                  
                  <View style={styles.exerciseContent}>
                    <Text style={[styles.exerciseName, { color: colors.text }]}>{exercise.name}</Text>
                    <Text style={[styles.exerciseCategory, { color: colors.textSecondary }]}>
                      {exercise.category} • {exercise.muscleGroups.join(", ")}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveExercise(exercise.id)}
                  >
                    <X size={20} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Workout"
            onPress={handleSaveWorkout}
            style={styles.saveButton}
          />
          {/* Fixed: Make the cancel button more prominent */}
          <Button
            title="Cancel"
            onPress={handleCancel}
            variant="outline"
            style={styles.cancelButton}
          />
        </View>
      </ScrollView>
      
      {/* Exercise Selection Modal */}
      <Modal
        visible={showExerciseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowExerciseModal(false)}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: colors.background }]} onPress={e => e.stopPropagation()}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <TouchableOpacity 
                onPress={() => setShowExerciseModal(false)}
                style={styles.modalCloseButton}
              >
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Exercises</Text>
              <TouchableOpacity 
                onPress={() => setShowExerciseModal(false)}
                style={styles.modalDoneButton}
              >
                <Text style={[styles.modalDoneText, { color: colors.primary }]}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.searchContainer}>
              <View style={[styles.searchInputContainer, { backgroundColor: colors.card }]}>
                <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
                <TextInput
                  style={[styles.searchInput, { color: colors.text }]}
                  placeholder="Search exercises..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery("")}>
                    <X size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                ) : null}
              </View>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
              >
                <TouchableOpacity 
                  style={[
                    styles.filterChip,
                    { backgroundColor: colors.card },
                    selectedFilter === null && [styles.filterChipActive, { backgroundColor: colors.primary }]
                  ]}
                  onPress={() => setSelectedFilter(null)}
                >
                  <Text style={[
                    styles.filterChipText,
                    { color: colors.text },
                    selectedFilter === null && [styles.filterChipTextActive, { color: "#FFFFFF" }]
                  ]}>
                    All Types
                  </Text>
                </TouchableOpacity>
                
                {exerciseCategories.map(category => (
                  <TouchableOpacity 
                    key={category}
                    style={[
                      styles.filterChip,
                      { backgroundColor: colors.card },
                      selectedFilter === category && [styles.filterChipActive, { backgroundColor: colors.primary }]
                    ]}
                    onPress={() => setSelectedFilter(category)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      { color: colors.text },
                      selectedFilter === category && [styles.filterChipTextActive, { color: "#FFFFFF" }]
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
              >
                <TouchableOpacity 
                  style={[
                    styles.filterChip,
                    { backgroundColor: colors.card },
                    selectedMuscleGroup === null && [styles.filterChipActive, { backgroundColor: colors.primary }]
                  ]}
                  onPress={() => setSelectedMuscleGroup(null)}
                >
                  <Text style={[
                    styles.filterChipText,
                    { color: colors.text },
                    selectedMuscleGroup === null && [styles.filterChipTextActive, { color: "#FFFFFF" }]
                  ]}>
                    All Muscles
                  </Text>
                </TouchableOpacity>
                
                {muscleGroups.map(muscleGroup => (
                  <TouchableOpacity 
                    key={muscleGroup}
                    style={[
                      styles.filterChip,
                      { backgroundColor: colors.card },
                      selectedMuscleGroup === muscleGroup && [styles.filterChipActive, { backgroundColor: colors.primary }]
                    ]}
                    onPress={() => setSelectedMuscleGroup(muscleGroup)}
                  >
                    <Text style={[
                      styles.filterChipText,
                      { color: colors.text },
                      selectedMuscleGroup === muscleGroup && [styles.filterChipTextActive, { color: "#FFFFFF" }]
                    ]}>
                      {muscleGroup}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            
            <FlatList
              data={filteredExercises}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={[
                    styles.exerciseListItem,
                    { backgroundColor: colors.card },
                    isExerciseSelected(item.id) && { borderWidth: 2, borderColor: colors.primary }
                  ]}
                  onPress={() => handleAddExercise(item)}
                >
                  <View style={styles.exerciseListItemContent}>
                    <Text style={[styles.exerciseListItemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.exerciseListItemDetails, { color: colors.textSecondary }]}>
                      {item.category} • {item.muscleGroups.join(", ")}
                    </Text>
                  </View>
                  
                  {isExerciseSelected(item.id) && (
                    <View style={[styles.selectedCheckmark, { backgroundColor: colors.primary }]}>
                      <Check size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.exerciseListContainer}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfWidth: {
    width: "48%",
  },
  pickerContainer: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: "hidden",
  },
  pickerButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pickerButtonText: {
    fontSize: 16,
  },
  difficultyContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderWidth: 1,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  difficultyButtonActive: {
  },
  difficultyButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  difficultyButtonTextActive: {
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontWeight: "500",
    marginLeft: 4,
  },
  emptyExercises: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyExercisesText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
  },
  exercisesList: {
    marginTop: 8,
  },
  exerciseItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  exerciseNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  exerciseNumberText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  exerciseContent: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
  },
  removeButton: {
    padding: 8,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 40,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    maxHeight: "90%",
    height: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalCloseButton: {
    padding: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalDoneButton: {
    padding: 8,
  },
  modalDoneText: {
    fontSize: 16,
    fontWeight: "500",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
  },
  filtersContainer: {
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  filterChipActive: {
  },
  filterChipText: {
    fontSize: 14,
  },
  filterChipTextActive: {
  },
  exerciseListContainer: {
    padding: 16,
  },
  exerciseListItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  exerciseListItemContent: {
    flex: 1,
  },
  exerciseListItemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  exerciseListItemDetails: {
    fontSize: 14,
  },
  selectedCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});