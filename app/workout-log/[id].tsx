import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Modal
} from "react-native";
import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Edit3, 
  X, 
  Plus,
  Minus,
  Trash2
} from "lucide-react-native";
import { useTheme } from "@/context/ThemeContext";
import { useWorkoutStore } from "@/store/workoutStore";
import Button from "@/components/Button";
import { WorkoutSet } from "@/types";

export default function WorkoutLogDetailsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { id } = useLocalSearchParams();
  const { 
    getWorkoutLog, 
    workouts, 
    exercises,
    workoutLogs,
    updateWorkoutLog,
    updateWorkoutLogSet,
    addWorkoutLogSet,
    removeWorkoutLogSet,
    deleteWorkoutLog
  } = useWorkoutStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingSet, setEditingSet] = useState<{
    exerciseIndex: number;
    setIndex: number;
    weight: string;
    reps: string;
  } | null>(null);
  const [workoutNotes, setWorkoutNotes] = useState("");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const workoutLog = getWorkoutLog(id as string);
  const workout = workoutLog ? workouts.find(w => w.id === workoutLog.workoutId) : null;
  
  console.log('Workout Log Screen - ID received:', id);
  console.log('All workout logs:', workoutLogs.map(log => ({ id: log.id, workoutId: log.workoutId, date: log.date })));
  console.log('Workout Log found:', workoutLog ? 'Yes' : 'No');
  console.log('Workout found:', workout ? 'Yes' : 'No');
  if (workoutLog) {
    console.log('Found workout log:', { id: workoutLog.id, workoutId: workoutLog.workoutId, date: workoutLog.date });
  }
  
  React.useEffect(() => {
    if (workoutLog) {
      setWorkoutNotes(workoutLog.notes || "");
    }
  }, [workoutLog]);
  
  if (!workoutLog || !workout) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen 
          options={{
            title: "Workout Details",
            headerLeft: () => (
              <TouchableOpacity 
                onPress={() => router.back()} 
                style={styles.headerButton}
              >
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: colors.text }]}>Workout log not found</Text>
          <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
            The workout log you're looking for could not be found. It may have been deleted or the link is invalid.
          </Text>
          <Button
            title="Go Back to Schedule"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </View>
    );
  }

  const handleSaveNotes = () => {
    updateWorkoutLog(workoutLog.id, { notes: workoutNotes });
    setIsEditing(false);
    setHasUnsavedChanges(false);
    Alert.alert("Success", "Workout notes updated successfully!");
  };

  const handleNotesChange = (text: string) => {
    setWorkoutNotes(text);
    if (text !== workoutLog?.notes) {
      setHasUnsavedChanges(true);
    }
  };

  const handleEditSet = (exerciseIndex: number, setIndex: number) => {
    const set = workoutLog.exercises[exerciseIndex].sets[setIndex];
    setEditingSet({
      exerciseIndex,
      setIndex,
      weight: set.weight?.toString() || "",
      reps: set.reps?.toString() || ""
    });
  };

  const handleSaveSet = () => {
    if (!editingSet) return;
    
    const weight = parseFloat(editingSet.weight) || 0;
    const reps = parseInt(editingSet.reps) || 0;
    
    updateWorkoutLogSet(workoutLog.id, editingSet.exerciseIndex, editingSet.setIndex, {
      weight,
      reps
    });
    
    setEditingSet(null);
    setHasUnsavedChanges(true); // Mark as having unsaved changes for the main save button
    Alert.alert("Success", "Set updated successfully!");
  };

  const saveAllChanges = () => {
    if (workoutNotes !== workoutLog?.notes) {
      updateWorkoutLog(workoutLog.id, { notes: workoutNotes });
    }
    setHasUnsavedChanges(false);
    setIsEditing(false);
    Alert.alert("Success", "All changes saved successfully!");
  };

  const handleAddSet = (exerciseIndex: number) => {
    const exercise = workoutLog.exercises[exerciseIndex];
    const lastSet = exercise.sets[exercise.sets.length - 1];
    
    const newSet: WorkoutSet = {
      weight: lastSet?.weight || 0,
      reps: lastSet?.reps || 0,
      completed: true
    };
    
    addWorkoutLogSet(workoutLog.id, exerciseIndex, newSet);
    setHasUnsavedChanges(true);
    Alert.alert("Success", "New set added!");
  };

  const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
    Alert.alert(
      "Remove Set",
      "Are you sure you want to remove this set?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            removeWorkoutLogSet(workoutLog.id, exerciseIndex, setIndex);
            setHasUnsavedChanges(true);
            Alert.alert("Success", "Set removed!");
          }
        }
      ]
    );
  };

  const handleDeleteWorkout = () => {
    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this entire workout? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteWorkoutLog(workoutLog.id);
            router.replace("/(tabs)/schedule");
            Alert.alert("Success", "Workout deleted successfully!");
          }
        }
      ]
    );
  };

  const getExerciseDetails = (exerciseId: string) => {
    return exercises.find(ex => ex.id === exerciseId);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const logDate = new Date(workoutLog.date);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: "Workout Details",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleDeleteWorkout} 
              style={styles.headerButton}
            >
              <Trash2 size={20} color={colors.error || "#FF6B6B"} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content}>
        {/* Workout Header */}
        <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.workoutTitle, { color: colors.text }]}>
            {workout.name}
          </Text>
          
          <View style={styles.workoutMeta}>
            <View style={styles.metaItem}>
              <Calendar size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {logDate.toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Clock size={16} color={colors.textSecondary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                {formatDuration(workoutLog.duration)}
              </Text>
            </View>
          </View>

          {workoutLog.rating && workoutLog.rating.difficulty && (
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingText, { color: colors.text }]}>
                Rating: {"★".repeat(workoutLog.rating.difficulty)} ({workoutLog.rating.difficulty}/5)
              </Text>
            </View>
          )}
        </View>

        {/* Exercise List */}
        <View style={styles.exercisesContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
          
          {workoutLog.exercises.map((exerciseLog, exerciseIndex) => {
            const exerciseDetails = getExerciseDetails(exerciseLog.exerciseId);
            
            return (
              <View 
                key={exerciseIndex} 
                style={[styles.exerciseCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <Text style={[styles.exerciseName, { color: colors.text }]}>
                  {exerciseDetails?.name || "Unknown Exercise"}
                </Text>
                
                {/* Sets Header */}
                <View style={[styles.setsHeader, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.setHeaderText, { color: colors.textSecondary }]}>Set</Text>
                  <Text style={[styles.setHeaderText, { color: colors.textSecondary }]}>Weight</Text>
                  <Text style={[styles.setHeaderText, { color: colors.textSecondary }]}>Reps</Text>
                  <Text style={[styles.setHeaderText, { color: colors.textSecondary }]}>Actions</Text>
                </View>
                
                {/* Sets List */}
                {exerciseLog.sets.map((set, setIndex) => (
                  <View key={setIndex} style={styles.setRow}>
                    <Text style={[styles.setNumber, { color: colors.text }]}>
                      {setIndex + 1}
                    </Text>
                    <Text style={[styles.setValue, { color: colors.text }]}>
                      {set.weight || 0} kg
                    </Text>
                    <Text style={[styles.setValue, { color: colors.text }]}>
                      {set.reps || 0}
                    </Text>
                    <View style={styles.setActions}>
                      <TouchableOpacity
                        onPress={() => handleEditSet(exerciseIndex, setIndex)}
                        style={[styles.actionButton, { backgroundColor: colors.primary }]}
                      >
                        <Edit3 size={12} color="#FFFFFF" />
                      </TouchableOpacity>
                      
                      {exerciseLog.sets.length > 1 && (
                        <TouchableOpacity
                          onPress={() => handleRemoveSet(exerciseIndex, setIndex)}
                          style={[styles.actionButton, { backgroundColor: colors.error || "#FF6B6B" }]}
                        >
                          <Minus size={12} color="#FFFFFF" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                ))}
                
                {/* Add Set Button */}
                <TouchableOpacity
                  onPress={() => handleAddSet(exerciseIndex)}
                  style={[styles.addSetButton, { borderColor: colors.primary }]}
                >
                  <Plus size={16} color={colors.primary} />
                  <Text style={[styles.addSetText, { color: colors.primary }]}>
                    Add Set
                  </Text>
                </TouchableOpacity>
                
                {/* Exercise Notes */}
                {exerciseLog.notes && (
                  <View style={[styles.exerciseNotes, { backgroundColor: colors.backgroundLight }]}>
                    <Text style={[styles.notesLabel, { color: colors.textSecondary }]}>
                      Exercise Notes:
                    </Text>
                    <Text style={[styles.notesText, { color: colors.text }]}>
                      {exerciseLog.notes}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Workout Notes */}
        <View style={[styles.notesSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.notesSectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Workout Notes</Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              style={styles.editNotesButton}
            >
              <Edit3 size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          {isEditing ? (
            <View>
              <TextInput
                style={[styles.notesInput, { 
                  backgroundColor: colors.card, 
                  color: colors.text,
                  borderColor: colors.border
                }]}
                value={workoutNotes}
                onChangeText={handleNotesChange}
                placeholder="Add workout notes..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
              <View style={styles.notesActions}>
                <Button
                  title="Cancel"
                  onPress={() => {
                    setWorkoutNotes(workoutLog.notes || "");
                    setIsEditing(false);
                  }}
                  variant="secondary"
                  style={styles.notesActionButton}
                />
                <Button
                  title="Save"
                  onPress={saveAllChanges}
                  style={styles.notesActionButton}
                />
              </View>
            </View>
          ) : (
            <Text style={[styles.notesDisplay, { color: colors.text }]}>
              {workoutLog.notes || "No notes added"}
            </Text>
          )}
        </View>

        {/* Save All Changes Button */}
        {hasUnsavedChanges && (
          <View style={[styles.saveAllContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.saveAllText, { color: colors.textSecondary }]}>
              You have unsaved changes
            </Text>
            <Button
              title="Save All Changes"
              onPress={saveAllChanges}
              style={styles.saveAllButton}
            />
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <Button
            title="← Back"
            onPress={() => router.back()}
            variant="secondary"
            style={styles.backMainButton}
          />
          
          <Button
            title={hasUnsavedChanges ? "💾 Save Recent Changes" : "✅ All Changes Saved"}
            onPress={saveAllChanges}
            style={styles.saveRecentButton}
            disabled={!hasUnsavedChanges}
          />
        </View>
      </ScrollView>

      {/* Edit Set Modal */}
      <Modal
        visible={editingSet !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setEditingSet(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Edit Set
              </Text>
              <TouchableOpacity onPress={() => setEditingSet(null)}>
                <X size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Weight (kg)</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card, 
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={editingSet?.weight || ""}
                  onChangeText={(text) => setEditingSet(prev => prev ? {...prev, weight: text} : null)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: colors.text }]}>Reps</Text>
                <TextInput
                  style={[styles.input, { 
                    backgroundColor: colors.card, 
                    color: colors.text,
                    borderColor: colors.border
                  }]}
                  value={editingSet?.reps || ""}
                  onChangeText={(text) => setEditingSet(prev => prev ? {...prev, reps: text} : null)}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>
            </View>
            
            <View style={[styles.modalActions, { borderTopColor: colors.border }]}>
              <Button
                title="Cancel"
                onPress={() => setEditingSet(null)}
                variant="secondary"
                style={styles.modalActionButton}
              />
              <Button
                title="Save"
                onPress={handleSaveSet}
                style={styles.modalActionButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  workoutTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  workoutMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 14,
    marginLeft: 4,
  },
  ratingContainer: {
    marginTop: 8,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  exercisesContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
  },
  exerciseCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  setsHeader: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  setHeaderText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  setRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  setNumber: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "500",
  },
  setValue: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
  },
  setActions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  actionButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  addSetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: "dashed",
    marginTop: 8,
  },
  addSetText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "500",
  },
  exerciseNotes: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  notesSection: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  notesSectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  editNotesButton: {
    padding: 4,
  },
  notesInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 100,
  },
  notesActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  notesActionButton: {
    minWidth: 80,
  },
  notesDisplay: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 16,
    padding: 0,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalBody: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
  },
  modalActionButton: {
    minWidth: 80,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 14,
    marginBottom: 8,
  },
  backButton: {
    minWidth: 120,
  },
  saveAllContainer: {
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    margin: 16,
    marginTop: 0,
  },
  saveAllText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  saveAllButton: {
    alignSelf: 'center',
    minWidth: 200,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  backMainButton: {
    minWidth: 120,
  },
  saveRecentButton: {
    minWidth: 120,
  },
});