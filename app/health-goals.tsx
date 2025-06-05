import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Calendar, Award, Target, Plus, Minus, ArrowLeft } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useHealthStore } from "@/store/healthStore";
import { useMacroStore } from "@/store/macroStore";
import { HealthGoals } from "@/types";
import Button from "@/components/Button";

export default function HealthGoalsScreen() {
  const router = useRouter();
  const { healthGoals, updateHealthGoals } = useHealthStore();
  const { userProfile } = useMacroStore();
  
  const [dailySteps, setDailySteps] = useState(healthGoals.dailySteps.toString());
  const [weeklyWorkouts, setWeeklyWorkouts] = useState(healthGoals.weeklyWorkouts.toString());
  const [targetWeight, setTargetWeight] = useState(
    healthGoals.targetWeight > 0 
      ? healthGoals.targetWeight.toString() 
      : userProfile.weight.toString()
  );
  const [targetDate, setTargetDate] = useState(
    healthGoals.targetDate 
      ? new Date(healthGoals.targetDate).toISOString().split('T')[0]
      : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  
  const handleSave = () => {
    const newGoals: HealthGoals = {
      dailySteps: parseInt(dailySteps) || 10000,
      weeklyWorkouts: parseInt(weeklyWorkouts) || 4,
      targetWeight: parseFloat(targetWeight) || userProfile.weight,
      targetDate: new Date(targetDate).toISOString(),
    };
    
    updateHealthGoals(newGoals);
    Alert.alert("Success", "Health goals updated successfully");
    router.back();
  };
  
  const adjustValue = (setter: React.Dispatch<React.SetStateAction<string>>, value: string, amount: number) => {
    const currentValue = parseInt(value) || 0;
    const newValue = Math.max(0, currentValue + amount);
    setter(newValue.toString());
  };
  
  const adjustWeight = (amount: number) => {
    const currentWeight = parseFloat(targetWeight) || 0;
    const newWeight = Math.max(0, currentWeight + amount);
    setTargetWeight(newWeight.toFixed(1));
  };
  
  const handleGoBack = () => {
    router.navigate("/(tabs)");
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: "Health Goals",
          headerBackTitle: "Health",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Set Your Health Goals</Text>
        <Text style={styles.subtitle}>Define targets to track your progress</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Daily Steps Goal</Text>
          <View style={styles.numberInput}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustValue(setDailySteps, dailySteps, -1000)}
            >
              <Minus size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              value={dailySteps}
              onChangeText={setDailySteps}
              keyboardType="numeric"
            />
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustValue(setDailySteps, dailySteps, 1000)}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            Recommended: 8,000 - 12,000 steps per day
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weekly Workouts</Text>
          <View style={styles.numberInput}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustValue(setWeeklyWorkouts, weeklyWorkouts, -1)}
            >
              <Minus size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              value={weeklyWorkouts}
              onChangeText={setWeeklyWorkouts}
              keyboardType="numeric"
            />
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustValue(setWeeklyWorkouts, weeklyWorkouts, 1)}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            Recommended: 3-5 workouts per week
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target Weight (kg)</Text>
          <View style={styles.numberInput}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustWeight(-0.5)}
            >
              <Minus size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
            />
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustWeight(0.5)}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>
            Current weight: {userProfile.weight} kg
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Target Date</Text>
          <View style={styles.dateInput}>
            <Calendar size={20} color={colors.textSecondary} />
            <TextInput
              style={styles.dateTextInput}
              value={targetDate}
              onChangeText={setTargetDate}
              placeholder="YYYY-MM-DD"
            />
          </View>
          <Text style={styles.helperText}>
            Set a realistic timeframe for your goals
          </Text>
        </View>
      </View>
      
      <View style={styles.tipsContainer}>
        <View style={styles.tipHeader}>
          <Award size={20} color={colors.primary} />
          <Text style={styles.tipTitle}>Goal Setting Tips</Text>
        </View>
        
        <Text style={styles.tipText}>
          • Set specific, measurable, achievable, relevant, and time-bound (SMART) goals
        </Text>
        <Text style={styles.tipText}>
          • For weight loss, aim for 0.5-1 kg per week for sustainable results
        </Text>
        <Text style={styles.tipText}>
          • Gradually increase your step count if you're just starting out
        </Text>
        <Text style={styles.tipText}>
          • Balance your workout schedule with adequate rest days
        </Text>
      </View>
      
      <Button
        title="Save Health Goals"
        onPress={handleSave}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  numberInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  button: {
    padding: 12,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    textAlign: "center",
  },
  helperText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateTextInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: colors.text,
  },
  tipsContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tipHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 8,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
});