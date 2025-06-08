import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Alert } from "react-native";
import { Calendar, Clock, Dumbbell, Plus, Copy, Save, ArrowLeft, ArrowRight, ChevronDown, Edit, Trash2 } from "lucide-react-native";
import { useRouter, Stack } from "expo-router";
import { useWorkoutStore } from "@/store/workoutStore";
import Button from "@/components/Button";
import { useTheme } from "@/context/ThemeContext";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const screenWidth = Dimensions.get("window").width;

export default function ScheduleScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { 
    workoutLogs, 
    scheduledWorkouts, 
    workouts, 
    exercises, 
    copyWorkoutToCustom,
    removeScheduledWorkout,
    deleteWorkoutLog
  } = useWorkoutStore();
  
  const [viewMode, setViewMode] = useState<"week" | "month">("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);
  const [selectedScheduledWorkout, setSelectedScheduledWorkout] = useState<string | null>(null);
  const [showScheduledWorkouts, setShowScheduledWorkouts] = useState(true);
  const [showCompletedWorkouts, setShowCompletedWorkouts] = useState(true);
  
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
  
  // Get scheduled workouts for a specific day of the week
  const getScheduledWorkoutsForDay = (dayOfWeek: number) => {
    return scheduledWorkouts.filter(sw => sw.dayOfWeek === dayOfWeek);
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
    
    // Reset selections
    setSelectedWorkout(null);
    setSelectedScheduledWorkout(null);
    
    // Check for completed workouts on this date
    const logs = getWorkoutsForDate(date);
    if (logs.length > 0 && showCompletedWorkouts) {
      setSelectedWorkout(logs[0].id);
    }
    
    // Check for scheduled workouts on this day of the week
    const scheduledForDay = getScheduledWorkoutsForDay(date.getDay());
    if (scheduledForDay.length > 0 && showScheduledWorkouts) {
      setSelectedScheduledWorkout(scheduledForDay[0].id);
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
    const newId = copyWorkoutToCustom(workoutId);
    if (newId) {
      Alert.alert(
        "Success", 
        "Workout copied to your custom workouts",
        [{ text: "OK" }]
      );
    }
  };
  
  // Delete scheduled workout
  const handleDeleteScheduledWorkout = (id: string) => {
    Alert.alert(
      "Delete Scheduled Workout",
      "Are you sure you want to remove this workout from your schedule?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            try {
              // Call the removeScheduledWorkout function from the store
              removeScheduledWorkout(id);
              
              // Clear the selected scheduled workout if it was the one deleted
              if (selectedScheduledWorkout === id) {
                setSelectedScheduledWorkout(null);
              }
              
              // Check if there are other scheduled workouts for this day
              const otherScheduled = scheduledWorkouts
                .filter(sw => sw.id !== id && sw.dayOfWeek === selectedDate.getDay());
              
              if (otherScheduled.length > 0) {
                setSelectedScheduledWorkout(otherScheduled[0].id);
              }
              
              // Show success message
              Alert.alert("Success", "Workout removed from schedule");
            } catch (error) {
              console.error("Error removing scheduled workout:", error);
              Alert.alert("Error", "Failed to remove workout from schedule");
            }
          }
        }
      ]
    );
  };
  
  // Delete completed workout log
  const handleDeleteCompletedWorkout = (id: string) => {
    Alert.alert(
      "Delete Workout Log",
      "Are you sure you want to delete this completed workout? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            try {
              // Call the deleteWorkoutLog function from the store
              deleteWorkoutLog(id);
              
              // Clear the selected workout if it was the one deleted
              if (selectedWorkout === id) {
                setSelectedWorkout(null);
              }
              
              // Check if there are other completed workouts for this date
              const otherCompleted = workoutLogs
                .filter(log => {
                  const logDate = new Date(log.date);
                  return log.id !== id && 
                    logDate.getDate() === selectedDate.getDate() &&
                    logDate.getMonth() === selectedDate.getMonth() &&
                    logDate.getFullYear() === selectedDate.getFullYear() &&
                    log.completed;
                });
              
              if (otherCompleted.length > 0) {
                setSelectedWorkout(otherCompleted[0].id);
              }
              
              // Show success message
              Alert.alert("Success", "Workout log deleted successfully");
            } catch (error) {
              console.error("Error deleting workout log:", error);
              Alert.alert("Error", "Failed to delete workout log");
            }
          }
        }
      ]
    );
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
  
  // Get the selected scheduled workout details
  const getSelectedScheduledWorkoutDetails = () => {
    if (!selectedScheduledWorkout) return null;
    
    const scheduled = scheduledWorkouts.find(sw => sw.id === selectedScheduledWorkout);
    if (!scheduled) return null;
    
    const workout = workouts.find(w => w.id === scheduled.workoutId);
    if (!workout) return null;
    
    return { scheduled, workout };
  };
  
  // Get dates for the current view
  const dates = getDatesForView();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: "Workout Schedule",
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
        
        <View style={styles.filterOptions}>
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              showScheduledWorkouts && { borderColor: colors.primary }
            ]}
            onPress={() => setShowScheduledWorkouts(!showScheduledWorkouts)}
          >
            <Text style={[
              styles.filterText, 
              { color: showScheduledWorkouts ? colors.primary : colors.textSecondary }
            ]}>Scheduled</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              showCompletedWorkouts && { borderColor: colors.primary }
            ]}
            onPress={() => setShowCompletedWorkouts(!showCompletedWorkouts)}
          >
            <Text style={[
              styles.filterText, 
              { color: showCompletedWorkouts ? colors.primary : colors.textSecondary }
            ]}>Completed</Text>
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
              const completedWorkouts = getWorkoutsForDate(date);
              const hasCompletedWorkout = completedWorkouts.length > 0;
              const scheduledWorkoutsForDay = getScheduledWorkoutsForDay(date.getDay());
              const hasScheduledWorkout = scheduledWorkoutsForDay.length > 0;
              const muscleGroups = getMuscleGroupsForDate(date);
              
              // Determine if this cell has any content to show based on filters
              const hasContent = (hasCompletedWorkout && showCompletedWorkouts) || 
                               (hasScheduledWorkout && showScheduledWorkouts);
              
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
                >
                  <View style={styles.dateContainer}>
                    <Text style={[
                      styles.dateText,
                      !isCurrentMonth && viewMode === "month" && { color: colors.textLight },
                      isToday && { fontWeight: "700", color: colors.primary },
                      isSelected && { color: colors.primary },
                      { color: colors.text }
                    ]}>
                      {date.getDate()}
                    </Text>
                    
                    {/* Indicators for scheduled and completed workouts */}
                    <View style={styles.workoutIndicators}>
                      {hasScheduledWorkout && showScheduledWorkouts && (
                        <View style={[styles.indicatorDot, { backgroundColor: colors.secondary }]} />
                      )}
                      {hasCompletedWorkout && showCompletedWorkouts && (
                        <View style={[styles.indicatorDot, { backgroundColor: colors.primary }]} />
                      )}
                    </View>
                  </View>
                  
                  {/* Show workout count if there are any */}
                  {hasContent && (
                    <View style={styles.workoutCountContainer}>
                      {showCompletedWorkouts && hasCompletedWorkout && (
                        <Text 
                          style={[styles.workoutCount, { color: colors.primary }]} 
                          numberOfLines={1} 
                          ellipsizeMode="tail"
                        >
                          {completedWorkouts.length} done
                        </Text>
                      )}
                      {showScheduledWorkouts && hasScheduledWorkout && (
                        <Text 
                          style={[styles.workoutCount, { color: colors.secondary }]} 
                          numberOfLines={1} 
                          ellipsizeMode="tail"
                        >
                          {scheduledWorkoutsForDay.length} planned
                        </Text>
                      )}
                    </View>
                  )}
                  
                  {/* Show muscle groups for completed workouts */}
                  {showCompletedWorkouts && muscleGroups.length > 0 && (
                    <View style={styles.muscleGroupContainer}>
                      {muscleGroups.slice(0, 2).map((group, idx) => (
                        <Text 
                          key={idx} 
                          style={[styles.muscleGroupText, { color: colors.textSecondary }]}
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {group.substring(0, 3)}
                        </Text>
                      ))}
                      {muscleGroups.length > 2 && (
                        <Text 
                          style={[styles.muscleGroupText, { color: colors.textSecondary }]}
                          numberOfLines={1}
                        >
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
        
        {/* Scheduled Workout Details */}
        {selectedScheduledWorkout && showScheduledWorkouts && (
          <View style={styles.workoutDetailsContainer}>
            {getSelectedScheduledWorkoutDetails() && (
              <View style={[styles.workoutDetails, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutTitleContainer}>
                    <Text style={[styles.scheduledLabel, { color: colors.secondary }]}>SCHEDULED</Text>
                    <Text style={[styles.workoutTitle, { color: colors.text }]}>
                      {getSelectedScheduledWorkoutDetails()?.workout.name}
                    </Text>
                  </View>
                  <Text style={[styles.workoutDate, { color: colors.textSecondary }]}>
                    {DAYS[getSelectedScheduledWorkoutDetails()?.scheduled.dayOfWeek || 0]} at {getSelectedScheduledWorkoutDetails()?.scheduled.time}
                  </Text>
                </View>
                
                <View style={styles.workoutStats}>
                  <View style={styles.statItem}>
                    <Clock size={16} color={colors.textSecondary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                      {getSelectedScheduledWorkoutDetails()?.workout.estimatedDuration || "30"} min
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Dumbbell size={16} color={colors.textSecondary} />
                    <Text style={[styles.statText, { color: colors.textSecondary }]}>
                      {getSelectedScheduledWorkoutDetails()?.workout.exercises.length} exercises
                    </Text>
                  </View>
                  {getSelectedScheduledWorkoutDetails()?.scheduled.reminder && (
                    <View style={styles.reminderContainer}>
                      <Text style={[styles.reminderText, { color: colors.textSecondary }]}>
                        Reminder: {getSelectedScheduledWorkoutDetails()?.scheduled.reminderTime} min before
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.exerciseList}>
                  <Text style={[styles.sectionTitle, { color: colors.text }]}>Exercises</Text>
                  {getSelectedScheduledWorkoutDetails()?.workout.exercises.map((exerciseInfo, index) => {
                    const exercise = exercises.find(e => e.id === exerciseInfo.id);
                    return (
                      <View key={index} style={[styles.exerciseItem, { borderBottomColor: colors.border }]}>
                        <Text style={[styles.exerciseName, { color: colors.text }]}>
                          {exercise?.name || "Unknown Exercise"}
                        </Text>
                        <Text style={[styles.exerciseDetails, { color: colors.textSecondary }]}>
                          {exerciseInfo.sets} sets × {exerciseInfo.reps} reps
                        </Text>
                      </View>
                    );
                  })}
                </View>
                
                {getSelectedScheduledWorkoutDetails()?.scheduled.notes && (
                  <View style={styles.notesSection}>
                    <Text style={[styles.sectionTitle, { color: colors.text }]}>Notes</Text>
                    <Text style={[styles.notesText, { color: colors.textSecondary }]}>
                      {getSelectedScheduledWorkoutDetails()?.scheduled.notes}
                    </Text>
                  </View>
                )}
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.error }]}
                    onPress={() => {
                      if (getSelectedScheduledWorkoutDetails()?.scheduled.id) {
                        handleDeleteScheduledWorkout(getSelectedScheduledWorkoutDetails()?.scheduled.id || "");
                      }
                    }}
                  >
                    <Trash2 size={16} color={colors.white} />
                    <Text style={[styles.actionButtonText, { color: colors.white }]}>
                      Remove
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.primary }]}
                    onPress={() => router.push(`/workout/${getSelectedScheduledWorkoutDetails()?.workout.id}`)}
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
        )}
        
        {/* Completed Workout Details */}
        {selectedWorkout && showCompletedWorkouts && (
          <View style={styles.workoutDetailsContainer}>
            {getSelectedWorkoutDetails() && (
              <View style={[styles.workoutDetails, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutTitleContainer}>
                    <Text style={[styles.completedLabel, { color: colors.primary }]}>COMPLETED</Text>
                    <Text style={[styles.workoutTitle, { color: colors.text }]}>
                      {getSelectedWorkoutDetails()?.workout.name}
                    </Text>
                  </View>
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
                    style={[styles.actionButton, { backgroundColor: colors.error }]}
                    onPress={() => {
                      if (getSelectedWorkoutDetails()?.log.id) {
                        handleDeleteCompletedWorkout(getSelectedWorkoutDetails()?.log.id || "");
                      }
                    }}
                  >
                    <Trash2 size={16} color={colors.white} />
                    <Text style={[styles.actionButtonText, { color: colors.white }]}>
                      Delete Log
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: colors.highlight }]}
                    onPress={() => handleCopyWorkout(getSelectedWorkoutDetails()?.log.workoutId || "")}
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
        )}
        
        {/* Empty state when no workout is selected */}
        {!selectedWorkout && !selectedScheduledWorkout && (
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
    marginBottom: 12,
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
  filterOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  filterButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterText: {
    fontSize: 12,
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
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  workoutIndicators: {
    flexDirection: "row",
    gap: 4,
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  workoutCountContainer: {
    marginTop: 4,
  },
  workoutCount: {
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 2,
  },
  muscleGroupContainer: {
    marginTop: 2,
  },
  muscleGroupText: {
    fontSize: 10,
    fontWeight: "500",
  },
  workoutDetailsContainer: {
    marginBottom: 16,
  },
  workoutDetails: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  workoutHeader: {
    marginBottom: 12,
  },
  workoutTitleContainer: {
    marginBottom: 4,
  },
  scheduledLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  completedLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: "700",
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
  reminderContainer: {
    marginLeft: "auto",
  },
  reminderText: {
    fontSize: 14,
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
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
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
    gap: 8,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
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