import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Modal,
  Pressable,
  Platform
} from "react-native";
import { useRouter, Stack } from "expo-router";
import { 
  Plus, 
  Calendar, 
  Target, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  ChevronRight,
  ArrowLeft,
  Clock,
  Droplet
} from "lucide-react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from "@/context/ThemeContext";
import { useAiStore, Goal } from "@/store/aiStore";
import Button from "@/components/Button";
import GoalPrompt from "@/components/GoalPrompt";

// Comprehensive goal examples
const GOAL_EXAMPLES = [
  "Drink 2L of water daily",
  "Walk 10,000 steps every day this week",
  "Complete 50 pushups by the end of the week",
  "Lose 0.5kg this week",
  "Go to the gym 3 times this week",
  "Meditate for 10 minutes daily",
  "Run 5km three times this week",
  "Do yoga for 20 minutes every morning",
  "Stretch for 15 minutes after each workout",
  "Eat 5 servings of vegetables daily",
  "Track all meals in the app every day",
  "Get 8 hours of sleep each night",
  "Take 10,000 steps daily for a month",
  "Complete 100 squats by end of week",
  "Reduce sugar intake to under 25g daily",
  "Increase protein intake to 120g daily",
  "Drink green tea instead of coffee",
  "Try a new workout class weekly",
  "Meal prep lunches for the entire week",
  "Do 3 HIIT workouts this week"
];

export default function GoalsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { 
    goals = [], // Provide default empty array to prevent undefined errors
    addGoal,
    updateGoal,
    completeGoal,
    deleteGoal,
    getGoalProgressMessage,
    getPromptForTimeframe,
    scheduleGoalReminder,
    cancelGoalReminder
  } = useAiStore();
  
  const [showGoalPrompt, setShowGoalPrompt] = useState(false);
  const [isSettingGoal, setIsSettingGoal] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState<"weekly" | "monthly">("weekly");
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  const [editedGoalText, setEditedGoalText] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Filter goals based on active tab
  const filteredGoals = goals.filter(goal => 
    activeTab === "active" ? !goal.completed : goal.completed
  );
  
  // Group active goals by timeframe
  const weeklyGoals = filteredGoals.filter(goal => goal.timeframe === "weekly");
  const monthlyGoals = filteredGoals.filter(goal => goal.timeframe === "monthly");
  
  const handleSubmitGoal = async (goalText: string, timeframe: "weekly" | "monthly", targetDate?: string, waterBottleSize?: number) => {
    setIsSettingGoal(true);
    
    try {
      // Determine goal category based on text
      const category = detectGoalCategory(goalText);
      
      // Extract target value if present
      const targetValue = extractTargetValue(goalText);
      
      // Extract time period if present
      const timePeriod = extractTimePeriod(goalText);
      
      // Create a new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        text: goalText,
        date: new Date().toISOString(),
        completed: false,
        category,
        timeframe,
        targetDate,
        progress: 0,
        milestones: [],
        lastChecked: new Date().toISOString(),
        targetValue,
        timePeriod: timePeriod || (timeframe === 'weekly' ? 'weekly' : 'monthly'),
        reminderSchedule: category === 'water' ? 'hourly' : 'daily',
        currentValue: 0,
        waterBottleSize
      };
      
      // Add the goal
      addGoal(newGoal);
      
      // Close the prompt
      setShowGoalPrompt(false);
      
      // Schedule default reminders based on goal category
      if (category === 'water') {
        // For water goals, schedule hourly reminders by default
        try {
          scheduleGoalReminder(newGoal.id, 'hourly');
        } catch (error) {
          console.error("Error scheduling water goal reminder:", error);
        }
      } else {
        // For other goals, schedule daily reminders
        try {
          scheduleGoalReminder(newGoal.id, 'daily');
        } catch (error) {
          console.error("Error scheduling daily goal reminder:", error);
        }
      }
      
      // Show confirmation
      Alert.alert(
        `${timeframe === "weekly" ? "Weekly" : "Monthly"} Goal Set`,
        "Your goal has been set successfully."
      );
      
    } catch (error) {
      console.error("Error setting goal:", error);
      Alert.alert("Error", "Failed to set goal. Please try again.");
    } finally {
      setIsSettingGoal(false);
    }
  };
  
  // Detect goal category based on text
  const detectGoalCategory = (goalText: string): string => {
    const text = goalText.toLowerCase();
    
    if (text.includes('water') || text.includes('hydrate') || text.includes('drink') || text.includes('liter') || text.includes('l of water')) {
      return 'water';
    } else if (text.includes('step') || text.includes('walk') || text.includes('walking') || text.includes('run') || text.includes('running')) {
      return 'steps';
    } else if (text.includes('workout') || text.includes('exercise') || text.includes('train') || text.includes('pushup') || text.includes('push-up') || text.includes('pull-up') || text.includes('pullup') || text.includes('squat') || text.includes('gym')) {
      return 'workout';
    } else if (text.includes('weight') || text.includes('kg') || text.includes('pound') || text.includes('lb') || text.includes('lose') || text.includes('gain')) {
      return 'weight';
    } else if (text.includes('eat') || text.includes('food') || text.includes('meal') || text.includes('diet') || text.includes('nutrition') || text.includes('calorie') || text.includes('protein') || text.includes('carb') || text.includes('fat')) {
      return 'nutrition';
    } else if (text.includes('sleep') || text.includes('rest') || text.includes('recovery') || text.includes('stress') || text.includes('meditate') || text.includes('meditation')) {
      return 'health';
    }
    
    return 'other';
  };
  
  // Extract numeric target from goal text
  const extractTargetValue = (goalText: string): number | null => {
    // Look for patterns like "X kg", "X pounds", "X steps", "X liters", etc.
    const matches = goalText.match(/(\d+(\.\d+)?)\s*(kg|pounds|lbs|steps|liters|l|minutes|min|reps|times)/i);
    
    if (matches && matches[1]) {
      return parseFloat(matches[1]);
    }
    
    // Look for just numbers
    const numericMatches = goalText.match(/(\d+(\.\d+)?)/);
    if (numericMatches && numericMatches[1]) {
      return parseFloat(numericMatches[1]);
    }
    
    return null;
  };
  
  // Extract time period from goal text (daily, weekly, etc.)
  const extractTimePeriod = (goalText: string): string => {
    const text = goalText.toLowerCase();
    
    if (text.includes('daily') || text.includes('day') || text.includes('every day')) {
      return 'daily';
    } else if (text.includes('weekly') || text.includes('week') || text.includes('every week')) {
      return 'weekly';
    } else if (text.includes('monthly') || text.includes('month') || text.includes('every month')) {
      return 'monthly';
    }
    
    // Default to the goal's timeframe
    return '';
  };
  
  const handleEditGoal = (goal: Goal) => {
    setEditingGoalId(goal.id);
    setEditedGoalText(goal.text);
  };
  
  const handleSaveGoalEdit = () => {
    if (!editingGoalId) return;
    
    if (!editedGoalText.trim()) {
      Alert.alert("Error", "Goal text cannot be empty");
      return;
    }
    
    updateGoal(editingGoalId, { text: editedGoalText });
    setEditingGoalId(null);
    setEditedGoalText("");
  };
  
  const handleCancelGoalEdit = () => {
    setEditingGoalId(null);
    setEditedGoalText("");
  };
  
  const handleToggleGoalCompletion = (goal: Goal) => {
    if (goal.completed) {
      // If already completed, mark as incomplete
      updateGoal(goal.id, { completed: false });
    } else {
      // If incomplete, mark as completed
      completeGoal(goal.id);
    }
  };
  
  const handleDeleteGoal = (goalId: string) => {
    Alert.alert(
      "Delete Goal",
      "Are you sure you want to delete this goal?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: () => {
            // Cancel any reminders for this goal
            try {
              cancelGoalReminder(goalId);
            } catch (error) {
              console.error("Error canceling goal reminder:", error);
            }
            
            // Delete the goal
            deleteGoal(goalId);
          },
          style: "destructive"
        }
      ]
    );
  };
  
  const handleEditTargetDate = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    setSelectedGoalId(goalId);
    setSelectedDate(goal.targetDate ? new Date(goal.targetDate) : new Date());
    setShowDatePicker(true);
  };
  
  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date && selectedGoalId) {
      setSelectedDate(date);
      updateGoal(selectedGoalId, { targetDate: date.toISOString() });
    }
  };
  
  // Set up header with back button
  useEffect(() => {
    // This effect sets up the header with a back button
  }, []);
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: "Goals",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          )
        }}
      />
      
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "active" && [styles.activeTab, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setActiveTab("active")}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === "active" && { color: colors.primary }
              ]}
            >
              Active
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "completed" && [styles.activeTab, { borderBottomColor: colors.primary }]
            ]}
            onPress={() => setActiveTab("completed")}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textSecondary },
                activeTab === "completed" && { color: colors.primary }
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
          {activeTab === "active" && (
            <>
              {weeklyGoals.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Goals</Text>
                  
                  {weeklyGoals.map((goal) => (
                    <View key={goal.id} style={[styles.goalCard, { backgroundColor: colors.card }]}>
                      {editingGoalId === goal.id ? (
                        // Editing mode
                        <View style={styles.goalEditContainer}>
                          <TextInput
                            style={[styles.goalEditInput, { backgroundColor: colors.background, color: colors.text }]}
                            value={editedGoalText}
                            onChangeText={setEditedGoalText}
                            multiline
                            autoFocus
                          />
                          <View style={styles.goalEditActions}>
                            <TouchableOpacity 
                              style={[styles.goalEditCancel, { backgroundColor: "rgba(255, 59, 48, 0.1)" }]}
                              onPress={handleCancelGoalEdit}
                            >
                              <X size={20} color={colors.error} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={[styles.goalEditSave, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}
                              onPress={handleSaveGoalEdit}
                            >
                              <Check size={20} color={colors.secondary} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        // Display mode
                        <>
                          <TouchableOpacity
                            style={[
                              styles.goalCheckbox,
                              goal.completed && { backgroundColor: colors.primary, borderColor: colors.primary }
                            ]}
                            onPress={() => handleToggleGoalCompletion(goal)}
                          >
                            {goal.completed && <Check size={16} color="#FFFFFF" />}
                          </TouchableOpacity>
                          
                          <View style={styles.goalContent}>
                            <Text style={[
                              styles.goalText, 
                              { color: colors.text },
                              goal.completed && styles.completedGoalText
                            ]}>
                              {goal.text}
                            </Text>
                            
                            <View style={styles.goalMeta}>
                              <Text style={[styles.goalDate, { color: colors.textSecondary }]}>
                                Set on {new Date(goal.date).toLocaleDateString()}
                              </Text>
                              
                              {goal.targetDate && (
                                <TouchableOpacity 
                                  style={styles.targetDateContainer}
                                  onPress={() => handleEditTargetDate(goal.id)}
                                >
                                  <Clock size={14} color={colors.primary} style={styles.targetDateIcon} />
                                  <Text style={[styles.targetDate, { color: colors.primary }]}>
                                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                                  </Text>
                                  <Edit size={12} color={colors.primary} style={styles.targetDateEditIcon} />
                                </TouchableOpacity>
                              )}
                              
                              {/* Water bottle size indicator for water goals */}
                              {goal.category === 'water' && goal.waterBottleSize && (
                                <View style={styles.waterBottleContainer}>
                                  <Droplet size={14} color={colors.primary} style={styles.waterBottleIcon} />
                                  <Text style={[styles.waterBottleText, { color: colors.primary }]}>
                                    Bottle size: {goal.waterBottleSize}L
                                  </Text>
                                </View>
                              )}
                            </View>
                            
                            {/* Progress bar for goal */}
                            {goal.progress !== undefined && (
                              <View style={styles.goalProgressContainer}>
                                <View 
                                  style={[
                                    styles.goalProgressBar, 
                                    { backgroundColor: colors.border }
                                  ]}
                                >
                                  <View 
                                    style={[
                                      styles.goalProgressFill, 
                                      { 
                                        backgroundColor: colors.primary,
                                        width: `${goal.progress}%` 
                                      }
                                    ]} 
                                  />
                                </View>
                                <Text style={[styles.goalProgressText, { color: colors.textSecondary }]}>
                                  {goal.progress}% complete
                                </Text>
                              </View>
                            )}
                            
                            <Text style={[styles.goalProgressMessage, { color: colors.textSecondary }]}>
                              {getGoalProgressMessage(goal)}
                            </Text>
                          </View>
                          
                          <View style={styles.goalActions}>
                            <TouchableOpacity 
                              style={[styles.goalAction, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}
                              onPress={() => handleEditGoal(goal)}
                            >
                              <Edit size={16} color={colors.primary} />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                              style={[styles.goalAction, { backgroundColor: "rgba(255, 59, 48, 0.1)" }]}
                              onPress={() => handleDeleteGoal(goal.id)}
                            >
                              <Trash2 size={16} color={colors.error} />
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                    </View>
                  ))}
                </View>
              )}
              
              {monthlyGoals.length > 0 && (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Monthly Goals</Text>
                  
                  {monthlyGoals.map((goal) => (
                    <View key={goal.id} style={[styles.goalCard, { backgroundColor: colors.card }]}>
                      {editingGoalId === goal.id ? (
                        // Editing mode
                        <View style={styles.goalEditContainer}>
                          <TextInput
                            style={[styles.goalEditInput, { backgroundColor: colors.background, color: colors.text }]}
                            value={editedGoalText}
                            onChangeText={setEditedGoalText}
                            multiline
                            autoFocus
                          />
                          <View style={styles.goalEditActions}>
                            <TouchableOpacity 
                              style={[styles.goalEditCancel, { backgroundColor: "rgba(255, 59, 48, 0.1)" }]}
                              onPress={handleCancelGoalEdit}
                            >
                              <X size={20} color={colors.error} />
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={[styles.goalEditSave, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}
                              onPress={handleSaveGoalEdit}
                            >
                              <Check size={20} color={colors.secondary} />
                            </TouchableOpacity>
                          </View>
                        </View>
                      ) : (
                        // Display mode
                        <>
                          <TouchableOpacity
                            style={[
                              styles.goalCheckbox,
                              goal.completed && { backgroundColor: colors.primary, borderColor: colors.primary }
                            ]}
                            onPress={() => handleToggleGoalCompletion(goal)}
                          >
                            {goal.completed && <Check size={16} color="#FFFFFF" />}
                          </TouchableOpacity>
                          
                          <View style={styles.goalContent}>
                            <Text style={[
                              styles.goalText, 
                              { color: colors.text },
                              goal.completed && styles.completedGoalText
                            ]}>
                              {goal.text}
                            </Text>
                            
                            <View style={styles.goalMeta}>
                              <Text style={[styles.goalDate, { color: colors.textSecondary }]}>
                                Set on {new Date(goal.date).toLocaleDateString()}
                              </Text>
                              
                              {goal.targetDate && (
                                <TouchableOpacity 
                                  style={styles.targetDateContainer}
                                  onPress={() => handleEditTargetDate(goal.id)}
                                >
                                  <Clock size={14} color={colors.primary} style={styles.targetDateIcon} />
                                  <Text style={[styles.targetDate, { color: colors.primary }]}>
                                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                                  </Text>
                                  <Edit size={12} color={colors.primary} style={styles.targetDateEditIcon} />
                                </TouchableOpacity>
                              )}
                              
                              {/* Water bottle size indicator for water goals */}
                              {goal.category === 'water' && goal.waterBottleSize && (
                                <View style={styles.waterBottleContainer}>
                                  <Droplet size={14} color={colors.primary} style={styles.waterBottleIcon} />
                                  <Text style={[styles.waterBottleText, { color: colors.primary }]}>
                                    Bottle size: {goal.waterBottleSize}L
                                  </Text>
                                </View>
                              )}
                            </View>
                            
                            {/* Progress bar for goal */}
                            {goal.progress !== undefined && (
                              <View style={styles.goalProgressContainer}>
                                <View 
                                  style={[
                                    styles.goalProgressBar, 
                                    { backgroundColor: colors.border }
                                  ]}
                                >
                                  <View 
                                    style={[
                                      styles.goalProgressFill, 
                                      { 
                                        backgroundColor: colors.primary,
                                        width: `${goal.progress}%` 
                                      }
                                    ]} 
                                  />
                                </View>
                                <Text style={[styles.goalProgressText, { color: colors.textSecondary }]}>
                                  {goal.progress}% complete
                                </Text>
                              </View>
                            )}
                            
                            <Text style={[styles.goalProgressMessage, { color: colors.textSecondary }]}>
                              {getGoalProgressMessage(goal)}
                            </Text>
                          </View>
                          
                          <View style={styles.goalActions}>
                            <TouchableOpacity 
                              style={[styles.goalAction, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}
                              onPress={() => handleEditGoal(goal)}
                            >
                              <Edit size={16} color={colors.primary} />
                            </TouchableOpacity>
                            
                            <TouchableOpacity 
                              style={[styles.goalAction, { backgroundColor: "rgba(255, 59, 48, 0.1)" }]}
                              onPress={() => handleDeleteGoal(goal.id)}
                            >
                              <Trash2 size={16} color={colors.error} />
                            </TouchableOpacity>
                          </View>
                        </>
                      )}
                    </View>
                  ))}
                </View>
              )}
              
              {weeklyGoals.length === 0 && monthlyGoals.length === 0 && (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    You don't have any active goals yet.
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                    Set a goal to track your fitness progress.
                  </Text>
                </View>
              )}
            </>
          )}
          
          {activeTab === "completed" && (
            <>
              {filteredGoals.length > 0 ? (
                <View style={styles.section}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Completed Goals</Text>
                  
                  {filteredGoals.map((goal) => (
                    <View key={goal.id} style={[styles.goalCard, { backgroundColor: colors.card }]}>
                      <TouchableOpacity
                        style={[
                          styles.goalCheckbox,
                          goal.completed && { backgroundColor: colors.primary, borderColor: colors.primary }
                        ]}
                        onPress={() => handleToggleGoalCompletion(goal)}
                      >
                        {goal.completed && <Check size={16} color="#FFFFFF" />}
                      </TouchableOpacity>
                      
                      <View style={styles.goalContent}>
                        <Text style={[
                          styles.goalText, 
                          { color: colors.text },
                          goal.completed && styles.completedGoalText
                        ]}>
                          {goal.text}
                        </Text>
                        
                        <View style={styles.goalMeta}>
                          <Text style={[styles.goalDate, { color: colors.textSecondary }]}>
                            Completed on {new Date(goal.lastChecked || goal.date).toLocaleDateString()}
                          </Text>
                          
                          <View style={[styles.goalTimeframeBadge, { backgroundColor: "rgba(74, 144, 226, 0.1)" }]}>
                            <Text style={[styles.goalTimeframeText, { color: colors.primary }]}>
                              {goal.timeframe === "weekly" ? "Weekly" : "Monthly"}
                            </Text>
                          </View>
                        </View>
                      </View>
                      
                      <TouchableOpacity 
                        style={[styles.goalAction, { backgroundColor: "rgba(255, 59, 48, 0.1)" }]}
                        onPress={() => handleDeleteGoal(goal.id)}
                      >
                        <Trash2 size={16} color={colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                    You haven't completed any goals yet.
                  </Text>
                  <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                    Complete your active goals to see them here.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
        
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => setShowGoalPrompt(true)}
        >
          <Plus size={24} color="#FFFFFF" />
        </TouchableOpacity>
        
        {/* Goal Setting Modal */}
        <GoalPrompt
          visible={showGoalPrompt}
          prompt={getPromptForTimeframe(selectedTimeframe)}
          onClose={() => setShowGoalPrompt(false)}
          onSubmit={handleSubmitGoal}
          isLoading={isSettingGoal}
          examples={GOAL_EXAMPLES}
          timeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
        />
        
        {/* Date Picker Modal */}
        {showDatePicker && (
          <>
            {Platform.OS === 'ios' && (
              <Modal
                visible={showDatePicker}
                transparent
                animationType="slide"
              >
                <View style={styles.datePickerModalContainer}>
                  <View style={[styles.datePickerModal, { backgroundColor: colors.card }]}>
                    <View style={styles.datePickerHeader}>
                      <Text style={[styles.datePickerTitle, { color: colors.text }]}>Select Target Date</Text>
                      <TouchableOpacity 
                        style={styles.datePickerCloseButton}
                        onPress={() => setShowDatePicker(false)}
                      >
                        <X size={24} color={colors.text} />
                      </TouchableOpacity>
                    </View>
                    
                    <DateTimePicker
                      value={selectedDate}
                      mode="date"
                      display="spinner"
                      onChange={handleDateChange}
                      minimumDate={new Date()}
                      style={styles.datePicker}
                    />
                    
                    <Button
                      title="Set Target Date"
                      onPress={() => setShowDatePicker(false)}
                      style={styles.datePickerButton}
                    />
                  </View>
                </View>
              </Modal>
            )}
            
            {Platform.OS === 'android' && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
              />
            )}
          </>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginRight: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 80,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  goalCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  goalCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCCCCC",
    marginRight: 12,
    marginTop: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  goalContent: {
    flex: 1,
    marginRight: 8,
  },
  goalText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  completedGoalText: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  goalMeta: {
    marginBottom: 8,
  },
  goalDate: {
    fontSize: 14,
    marginBottom: 4,
  },
  targetDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  targetDateIcon: {
    marginRight: 4,
  },
  targetDate: {
    fontSize: 14,
    fontWeight: "500",
  },
  targetDateEditIcon: {
    marginLeft: 4,
  },
  // Water bottle size styles
  waterBottleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  waterBottleIcon: {
    marginRight: 4,
  },
  waterBottleText: {
    fontSize: 14,
    fontWeight: "500",
  },
  goalTimeframeBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
  },
  goalTimeframeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  goalProgressContainer: {
    marginBottom: 8,
  },
  goalProgressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goalProgressText: {
    fontSize: 12,
  },
  goalProgressMessage: {
    fontSize: 14,
    fontStyle: "italic",
  },
  goalActions: {
    flexDirection: "column",
    alignItems: "center",
  },
  goalAction: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  goalEditContainer: {
    flex: 1,
  },
  goalEditInput: {
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  goalEditActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  goalEditCancel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  goalEditSave: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 24,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: "center",
  },
  addButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  datePickerModalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  datePickerModal: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  datePickerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  datePickerCloseButton: {
    padding: 4,
  },
  datePicker: {
    marginBottom: 16,
  },
  datePickerButton: {
    marginTop: 8,
  },
});