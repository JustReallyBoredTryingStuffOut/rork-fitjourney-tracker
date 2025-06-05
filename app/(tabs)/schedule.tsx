import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Calendar, Clock, Dumbbell, Plus, Copy, Save, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react-native";
import { useRouter, Stack } from "expo-router";
import { useWorkoutStore } from "@/store/workoutStore";
import Button from "@/components/Button";
import { useTheme } from "@/context/ThemeContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const screenWidth = Dimensions.get("window").width;

export default function ScheduleScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { workoutLogs, scheduledWorkouts, copyWorkoutToCustom } = useWorkoutStore();
  
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  
  // Get dates for current view (week or month)
  const getDatesForView = () => {
    const dates = [];
    
    if (viewMode === "week") {
      // Get the first day of the week (Sunday)
      const firstDayOfWeek = new Date(selectedDate);
      const day = selectedDate.getDay();
      firstDayOfWeek.setDate(selectedDate.getDate() - day);
      
      // Generate 7 days starting from the first day of the week
      for (let i = 0; i < 7; i++) {
        const date = new Date(firstDayOfWeek);
        date.setDate(firstDayOfWeek.getDate() + i);
        dates.push(date);
      }
    } else {
      // Month view
      const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
      const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
      
      // Get the first day to display (might be from previous month)
      const firstDayToDisplay = new Date(firstDayOfMonth);
      const firstDayOfWeek = firstDayOfMonth.getDay();
      firstDayToDisplay.setDate(firstDayOfMonth.getDate() - firstDayOfWeek);
      
      // Generate days until we cover the entire month plus padding
      const totalDays = lastDayOfMonth.getDate() + firstDayOfWeek;
      const rowsNeeded = Math.ceil(totalDays / 7);
      const totalCells = rowsNeeded * 7;
      
      for (let i = 0; i < totalCells; i++) {
        const date = new Date(firstDayToDisplay);
        date.setDate(firstDayToDisplay.getDate() + i);
        dates.push(date);
      }
    }
    
    return dates;
  };
  
  // Get workout logs for a specific date
  const getWorkoutsForDate = (date: Date) => {
    return workoutLogs.filter(log => {
      const logDate = new Date(log.date);
      return (
        logDate.getDate() === date.getDate() &&
        logDate.getMonth() === date.getMonth() &&
        logDate.getFullYear() === date.getFullYear() &&
        log.completed
      );
    });
  };
  
  // Get muscle groups worked on a specific date
  const getMuscleGroupsForDate = (date: Date) => {
    const logs = getWorkoutsForDate(date);
    const muscleGroups = new Set<string>();
    
    logs.forEach(log => {
      const workout = workouts.find(w => w.id === log.workoutId);
      if (workout) {
        workout.exercises.forEach(exercise => {
          const ex = exercises.find(e => e.id === exercise.id);
          if (ex) {
            ex.muscleGroups.forEach(group => muscleGroups.add(group));
          }
        });
      }
    });
    
    return Array.from(muscleGroups);
  };
  
  // Navigate to previous week/month
  const goToPrevious = () => {
    if (viewMode === "week") {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 7);
      setSelectedDate(newDate);
    } else {
      setCurrentMonth(prev => {
        if (prev === 0) {
          setCurrentYear(prevYear => prevYear - 1);
          return 11;
        }
        return prev - 1;
      });
    }
  };
  
  // Navigate to next week/month
  const goToNext = () => {
    if (viewMode === "week") {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 7);
      setSelectedDate(newDate);
    } else {
      setCurrentMonth(prev => {
        if (prev === 11) {
          setCurrentYear(prevYear => prevYear + 1);
          return 0;
        }
        return prev + 1;
      });
    }
  };
  
  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const logs = getWorkoutsForDate(date);
    if (logs.length > 0) {
      setSelectedWorkout(logs[0].id);
    } else {
      setSelectedWorkout(null);
    }
  };
  
  // Get the title for the current view
  const getViewTitle = () => {
    if (viewMode === "week") {
      const dates = getDatesForView();
      const firstDate = dates[0];
      const lastDate = dates[dates.length - 1];
      
      const firstMonth = firstDate.toLocaleString('default', { month: 'short' });
      const lastMonth = lastDate.toLocaleString('default', { month: 'short' });
      
      if (firstMonth === lastMonth) {
        return `${firstMonth} ${firstDate.getDate()} - ${lastDate.getDate()}, ${firstDate.getFullYear()}`;
      } else {
        return `${firstMonth} ${firstDate.getDate()} - ${lastMonth} ${lastDate.getDate()}, ${firstDate.getFullYear()}`;
      }
    } else {
      return new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long', year: 'numeric' });
    }
  };
  
  // Copy workout to custom workouts
  const handleCopyWorkout = (workoutId: string) => {
    copyWorkoutToCustom(workoutId);
  };
  
  // Get the selected workout details
  const getSelectedWorkoutDetails = () => {
    if (!selectedWorkout) return null;
    
    const log = workoutLogs.find(log => log.id === selectedWorkout);
    if (!log) return null;
    
    const workout = workouts.find(w => w.id === log.workoutId);
    if (!workout) return null;
    
    return { log, workout };
  };
  
  // Extract workouts and exercises from store
  const { workouts, exercises } = useWorkoutStore();
  
  // Get dates for the current view
  const dates = getDatesForView();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: "Workout History",
          headerShown: true,
        }}
      />
      
      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <View style={styles.viewControls}>
          <TouchableOpacity onPress={goToPrevious} style={styles.navButton}>
            <ArrowLeft size={20} color={colors.primary} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.titleContainer}
            onPress={() => setViewMode(viewMode === "week" ? "month" : "week")}
          >
            <Text style={[styles.headerTitle, { color: colors.text }]}>{getViewTitle()}</Text>
            <ChevronDown size={16} color={colors.text} style={styles.titleIcon} />
          </TouchableOpacity>
          
          <TouchableOpacity onPress={goToNext} style={styles.navButton}>
            <ArrowRight size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.viewToggle}>
          <TouchableOpacity 
            style={[
              styles.toggleButton, 
              viewMode === "week" && [styles.activeToggle, { backgroundColor: colors.primary }]
            ]}
            onPress={() => setViewMode("week")}
          >
            <Text style={[
              styles.toggleText, 
              { color: viewMode === "week" ? colors.white : colors.text }
            ]}>Week</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.toggleButton, 
              viewMode === "month" && [styles.activeToggle, { backgroundColor: colors.primary }]
            ]}
            onPress={() => setViewMode("month")}
          >
            <Text style={[
              styles.toggleText, 
              { color: viewMode === "month" ? colors.white : colors.text }
            ]}>Month</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Day headers */}
          <View style={styles.dayHeaderRow}>
            {DAYS.map((day) => (
              <View key={day} style={styles.dayHeaderCell}>
                <Text style={[styles.dayHeaderText, { color: colors.textSecondary }]}>{day}</Text>
              </View>
            ))}
          </View>
          
          {/* Calendar grid */}
          <View style={styles.calendarGrid}>
            {dates.map((date, index) => {
              const isCurrentMonth = date.getMonth() === currentMonth;
              const isToday = date.toDateString() === new Date().toDateString();
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const workouts = getWorkoutsForDate(date);
              const hasWorkout = workouts.length > 0;
              const muscleGroups = getMuscleGroupsForDate(date);
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarCell,
                    !isCurrentMonth && viewMode === "month" && styles.otherMonthCell,
                    isToday && [styles.todayCell, { borderColor: colors.primary }],
                    isSelected && [styles.selectedCell, { backgroundColor: colors.highlight }],
                    { borderColor: colors.border }
                  ]}
                  onPress={() => handleDateSelect(date)}
                  disabled={!hasWorkout}
                >
                  <Text style={[
                    styles.dateText,
                    !isCurrentMonth && viewMode === "month" && { color: colors.textLight },
                    isToday && { fontWeight: "700", color: colors.primary },
                    isSelected && { color: colors.primary },
                    { color: colors.text }
                  ]}>
                    {date.getDate()}
                  </Text>
                  
                  {hasWorkout && (
                    <View style={styles.workoutIndicator}>
                      <View style={[styles.workoutDot, { backgroundColor: colors.primary }]} />
                      <Text style={[styles.workoutCount, { color: colors.primary }]}>
                        {workouts.length}
                      </Text>
                    </View>
                  )}
                  
                  {muscleGroups.length > 0 && (
                    <View style={styles.muscleGroupContainer}>
                      {muscleGroups.slice(0, 2).map((group, idx) => (
                        <Text key={idx} style={[styles.muscleGroupText, { color: colors.textSecondary }]}>
                          {group.substring(0, 3)}
                        </Text>
                      ))}
                      {muscleGroups.length > 2 && (
                        <Text style={[styles.muscleGroupText, { color: colors.textSecondary }]}>
                          +{muscleGroups.length - 2}
                        </Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        
        {/* Selected workout details */}
        {selectedWorkout ? (
          <View style={styles.workoutDetailsContainer}>
            {getSelectedWorkoutDetails() && (
              <View style={[styles.workoutDetails, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.workoutHeader}>
                  <Text style={[styles.workoutTitle, { color: colors.text }]}>
                    {getSelectedWorkoutDetails()?.workout.name}
                  </Text>
                  <Text style={[styles.workoutDate, { color: colors.textSecondary }]}>
                    {new Date(getSelectedWorkoutDetails()?.log.date || "").toLocaleDateString(undefined, {
                      weekday: "long",
                      month: "short",
                      day: "numeric"
                    })}
                  </Text>
                </View>
                
                <View style={styles.workoutStats}>
                  <View style={styles.statItem}>
                    <Clock size={16} color={colors.textSecondary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                      {getSelectedWorkoutDetails()?.log.duration} min
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Dumbbell size={16} color={colors.textSecondary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                      {getSelectedWorkoutDetails()?.log.exercises.length} exercises
                    </Text>
                  </View>
                  {getSelectedWorkoutDetails()?.log.rating && (
                    <View style={styles.ratingContainer}>
                      <Text style={[styles.ratingText, { color: colors.text }]}>
                        Rating: {getSelectedWorkoutDetails()?.log.rating.rating}/5
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.exerciseList}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
                  {getSelectedWorkoutDetails()?.log.exercises.map((exerciseLog, index) => {
                    const exercise = exercises.find(e => e.id === exerciseLog.exerciseId);
                    return (
                      <View key={index} style={[styles.exerciseItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.exerciseName, { color: colors.text }]}>
                          {exercise?.name || "Unknown Exercise"}
                        </Text>
                        <View style={styles.setsList}>
                          {exerciseLog.sets.map((set, setIndex) => (
                            <Text key={setIndex} style={[styles.setInfo, { color: colors.textSecondary }]}>
                              Set {setIndex + 1}: {set.weight} kg × {set.reps} reps
                            </Text>
                          ))}
                          {exerciseLog.sets.length === 0 && (
                            <Text style={[styles.noSetsText, { color: colors.textLight }]}>
                              No sets recorded
                            </Text>
                          )}
                        </View>
                      </View>
                    );
                  })}
                </View>
                
                {getSelectedWorkoutDetails()?.log.notes && (
                  <View style={styles.notesSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
                    <Text style={[styles.notesText, { color: colors.textSecondary }]}>
                      {getSelectedWorkoutDetails()?.log.notes}
                    </Text>
                  </View>
                )}
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.highlight }]}
                    onPress={() => handleCopyWorkout(getSelectedWorkoutDetails()?.log.id || "")}
                  >
                    <Copy size={16} color={colors.primary} />
                    <Text style={[styles.actionButtonText, { color: colors.primary }]}>
                      Save as Custom
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push(`/workout/${getSelectedWorkoutDetails()?.workout.id}`)}
                  >
                    <Dumbbell size={16} color={colors.white} />
                    <Text style={[styles.actionButtonText, { color: colors.white }]}>
                      Start Workout
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <View style={[styles.emptyIconContainer, { backgroundColor: colors.border }]}>
              <Calendar size={40} color={colors.textLight} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Workout Selected</Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Select a day with a workout to view details
            </Text>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Schedule a Workout"
          onPress={() => router.push("/add-workout-schedule")}
          icon={<Plus size={18} color="#FFFFFF" />}
          style={styles.addButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  viewControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  navButton: {
    padding: 8,
    borderRadius: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  titleIcon: {
    marginLeft: 4,
  },
  viewToggle: {
    flexDirection: "row",
    borderRadius: 8,
    overflow: "hidden",
    alignSelf: "center",
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  activeToggle: {
    borderRadius: 8,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "500",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  calendarContainer: {
    marginBottom: 20,
  },
  dayHeaderRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  dayHeaderCell: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  dayHeaderText: {
    fontSize: 12,
    fontWeight: "600",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarCell: {
    width: (screenWidth - 32) / 7,
    height: 70,
    borderWidth: 0.5,
    padding: 4,
    justifyContent: "flex-start",
  },
  otherMonthCell: {
    opacity: 0.5,
  },
  todayCell: {
    borderWidth: 2,
  },
  selectedCell: {
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
  },
  workoutIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  workoutDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  workoutCount: {
    fontSize: 12,
    fontWeight: "500",
  },
  muscleGroupContainer: {
    marginTop: 4,
  },
  muscleGroupText: {
    fontSize: 10,
    fontWeight: "500",
  },
  workoutDetailsContainer: {
    marginBottom: 80,
  },
  workoutDetails: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  workoutHeader: {
    marginBottom: 12,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
  },
  workoutStats: {
    flexDirection: "row",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  statText: {
    fontSize: 14,
    marginLeft: 4,
  },
  ratingContainer: {
    marginLeft: "auto",
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  exerciseList: {
    marginBottom: 16,
  },
  exerciseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  setsList: {
    marginLeft: 8,
  },
  setInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  noSetsText: {
    fontSize: 14,
    fontStyle: "italic",
  },
  notesSection: {
    marginBottom: 16,
  },
  notesText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    marginTop: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  buttonContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  addButton: {
    width: "100%",
  },
});