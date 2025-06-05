import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, Pressable, Keyboard, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Calendar, Clock, ChevronDown, Check, ArrowLeft, X } from "lucide-react-native";
import { useWorkoutStore } from "@/store/workoutStore";
import Button from "@/components/Button";
import WorkoutCard from "@/components/WorkoutCard";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useTheme } from "@/context/ThemeContext";

export default function AddWorkoutScheduleScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { workouts, scheduleWorkout } = useWorkoutStore();
  
  const [selectedWorkoutId, setSelectedWorkoutId] = useState("");
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminder, setReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState(15); // 15 minutes before
  const [showWorkoutSelector, setShowWorkoutSelector] = useState(false);
  
  // Days of the week
  const days = [
    { id: 0, name: "Sunday" },
    { id: 1, name: "Monday" },
    { id: 2, name: "Tuesday" },
    { id: 3, name: "Wednesday" },
    { id: 4, name: "Thursday" },
    { id: 5, name: "Friday" },
    { id: 6, name: "Saturday" },
  ];
  
  // Format time for display
  const formatTime = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    return `${hours}:${formattedMinutes} ${ampm}`;
  };
  
  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || selectedTime;
    setShowTimePicker(Platform.OS === "ios");
    setSelectedTime(currentDate);
  };
  
  const handleSave = () => {
    if (!selectedWorkoutId) {
      Alert.alert("Error", "Please select a workout");
      return;
    }
    
    const newScheduledWorkout = {
      id: Date.now().toString(),
      workoutId: selectedWorkoutId,
      dayOfWeek: selectedDay,
      time: formatTime(selectedTime),
      notes: "",
      reminder,
      reminderTime,
    };
    
    scheduleWorkout(newScheduledWorkout);
    Alert.alert("Success", "Workout scheduled successfully", [
      { text: "OK", onPress: () => router.back() }
    ]);
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  const selectedWorkout = workouts.find(w => w.id === selectedWorkoutId);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: "Add to Schedule",
          headerBackTitle: "Schedule",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Schedule a Workout</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Add a workout to your weekly schedule</Text>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Workout</Text>
          
          <View style={styles.workoutSelector}>
            {selectedWorkout ? (
              <View style={styles.selectedWorkoutContainer}>
                <WorkoutCard workout={selectedWorkout} />
                <TouchableOpacity 
                  style={styles.changeButton}
                  onPress={() => setShowWorkoutSelector(true)}
                >
                  <Text style={[styles.changeButtonText, { color: colors.primary }]}>Change Workout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity 
                style={[styles.selectWorkoutButton, { backgroundColor: colors.background, borderColor: colors.border }]}
                onPress={() => setShowWorkoutSelector(true)}
              >
                <Text style={[styles.selectWorkoutText, { color: colors.textSecondary }]}>Tap to select a workout</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Day</Text>
          
          <View style={styles.daysContainer}>
            {days.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  { backgroundColor: colors.background },
                  selectedDay === day.id && [styles.selectedDayButton, { backgroundColor: colors.primary }],
                ]}
                onPress={() => setSelectedDay(day.id)}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: colors.text },
                    selectedDay === day.id && [styles.selectedDayText, { color: "#FFFFFF" }],
                  ]}
                >
                  {day.name.substring(0, 3)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Time</Text>
          
          <TouchableOpacity 
            style={[styles.timeSelector, { backgroundColor: colors.background }]}
            onPress={() => setShowTimePicker(true)}
          >
            <Clock size={20} color={colors.primary} />
            <Text style={[styles.timeText, { color: colors.text }]}>{formatTime(selectedTime)}</Text>
            <ChevronDown size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          
          {Platform.OS === 'ios' && showTimePicker && (
            <View style={[styles.iosTimePickerContainer, { backgroundColor: colors.card }]}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                is24Hour={false}
                display="spinner"
                onChange={handleTimeChange}
              />
              <Button 
                title="Done" 
                onPress={() => setShowTimePicker(false)}
                style={styles.doneButton}
              />
            </View>
          )}
          
          {Platform.OS === 'android' && showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleTimeChange}
            />
          )}
          
          {Platform.OS === 'web' && showTimePicker && (
            <View style={[styles.webTimePickerContainer, { backgroundColor: colors.card }]}>
              <input
                type="time"
                value={`${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':').map(Number);
                  const newDate = new Date(selectedTime);
                  newDate.setHours(hours);
                  newDate.setMinutes(minutes);
                  setSelectedTime(newDate);
                }}
                style={webInputStyle}
              />
              <Button 
                title="Done" 
                onPress={() => setShowTimePicker(false)}
                style={styles.doneButton}
              />
            </View>
          )}
        </View>
        
        <View style={[styles.section, { backgroundColor: colors.card, shadowColor: "#000" }]}>
          <View style={styles.reminderHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Reminder</Text>
            <TouchableOpacity 
              style={styles.reminderToggle}
              onPress={() => setReminder(!reminder)}
            >
              <View style={[
                styles.toggleButton,
                reminder ? [styles.toggleActive, { backgroundColor: colors.primary }] : [styles.toggleInactive, { backgroundColor: colors.border }]
              ]}>
                {reminder && <Check size={16} color="#FFFFFF" />}
              </View>
              <Text style={[styles.toggleText, { color: colors.text }]}>
                {reminder ? "On" : "Off"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {reminder && (
            <View style={styles.reminderTimeContainer}>
              <Text style={[styles.reminderLabel, { color: colors.text }]}>Remind me</Text>
              <View style={[styles.pickerContainer, { backgroundColor: colors.background }]}>
                <Picker
                  selectedValue={reminderTime}
                  onValueChange={(itemValue) => setReminderTime(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="5 minutes before" value={5} />
                  <Picker.Item label="10 minutes before" value={10} />
                  <Picker.Item label="15 minutes before" value={15} />
                  <Picker.Item label="30 minutes before" value={30} />
                  <Picker.Item label="1 hour before" value={60} />
                </Picker>
              </View>
            </View>
          )}
        </View>
        
        <Button
          title="Add to Schedule"
          onPress={handleSave}
          style={styles.saveButton}
        />
        
        {/* Added back button at the bottom */}
        <Button
          title="Back to Schedule"
          onPress={handleGoBack}
          variant="outline"
          style={styles.bottomBackButton}
        />
      </ScrollView>
      
      {/* Workout Selector Modal */}
      <Modal
        visible={showWorkoutSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowWorkoutSelector(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => {
            setShowWorkoutSelector(false);
            Keyboard.dismiss();
          }}
        >
          <Pressable style={[styles.modalContent, { backgroundColor: colors.background }]} onPress={e => e.stopPropagation()}>
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Workout</Text>
              <TouchableOpacity 
                onPress={() => setShowWorkoutSelector(false)}
                style={styles.modalCloseButton}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              {workouts.map((workout) => (
                <TouchableOpacity
                  key={workout.id}
                  style={[
                    styles.workoutOption,
                    { backgroundColor: colors.card },
                    selectedWorkoutId === workout.id && { borderWidth: 2, borderColor: colors.primary }
                  ]}
                  onPress={() => {
                    setSelectedWorkoutId(workout.id);
                    setShowWorkoutSelector(false);
                  }}
                >
                  <View style={styles.workoutOptionContent}>
                    <Text style={[styles.workoutOptionName, { color: colors.text }]}>{workout.name}</Text>
                    <Text style={[styles.workoutOptionDetails, { color: colors.textSecondary }]}>
                      {workout.duration} min • {workout.category} • {workout.difficulty}
                    </Text>
                  </View>
                  
                  {selectedWorkoutId === workout.id && (
                    <Check size={20} color={colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <Button
                title="Create New Workout"
                onPress={() => {
                  setShowWorkoutSelector(false);
                  router.push("/create-workout");
                }}
                variant="outline"
                style={styles.createWorkoutButton}
              />
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// Define web input style as a separate object to fix type issues
const webInputStyle = {
  fontSize: 16,
  padding: 8,
  borderRadius: 8,
  borderWidth: 1,
  marginBottom: 16,
  width: "100%",
  maxWidth: 200,
  borderColor: "#ccc"
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  workoutSelector: {
    minHeight: 120,
  },
  selectedWorkoutContainer: {
    marginBottom: 8,
  },
  changeButton: {
    alignSelf: "center",
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  changeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectWorkoutButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    height: 120,
  },
  selectWorkoutText: {
    fontSize: 16,
  },
  workoutList: {
    paddingBottom: 8,
  },
  workoutItem: {
    width: 160,
    marginRight: 12,
  },
  workoutCard: {
    borderRadius: 8,
    padding: 12,
    height: 100,
    justifyContent: "space-between",
  },
  workoutName: {
    fontSize: 16,
    fontWeight: "600",
  },
  workoutDuration: {
    fontSize: 14,
  },
  workoutCategory: {
    fontSize: 12,
    fontWeight: "500",
  },
  daysContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  dayButton: {
    width: "31%",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedDayButton: {
  },
  dayText: {
    fontSize: 14,
    fontWeight: "500",
  },
  selectedDayText: {
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  timeText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  iosTimePickerContainer: {
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    alignItems: "center",
  },
  webTimePickerContainer: {
    borderRadius: 12,
    marginTop: 8,
    padding: 16,
    alignItems: "center",
  },
  doneButton: {
    marginTop: 8,
    width: 120,
  },
  reminderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reminderToggle: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  toggleActive: {
  },
  toggleInactive: {
  },
  toggleText: {
    fontSize: 14,
  },
  reminderTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reminderLabel: {
    fontSize: 16,
    marginRight: 12,
    width: 80,
  },
  pickerContainer: {
    flex: 1,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  saveButton: {
    marginTop: 16,
  },
  bottomBackButton: {
    marginTop: 12,
  },
  backButton: {
    padding: 8,
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
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
    maxHeight: "70%",
  },
  workoutOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  workoutOptionContent: {
    flex: 1,
  },
  workoutOptionName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  workoutOptionDetails: {
    fontSize: 14,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
  },
  createWorkoutButton: {
    width: "100%",
  },
});