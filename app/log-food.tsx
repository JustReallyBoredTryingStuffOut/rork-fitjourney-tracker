import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Plus, Minus, Clock, Coffee, UtensilsCrossed, Soup, ArrowLeft } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useMacroStore } from "@/store/macroStore";
import { MacroLog } from "@/types";
import Button from "@/components/Button";
import NoteInput from "@/components/NoteInput";
import { Picker } from "@react-native-picker/picker";

export default function LogFoodScreen() {
  const router = useRouter();
  const { addMacroLog } = useMacroStore();
  
  const [calories, setCalories] = useState("0");
  const [protein, setProtein] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [fat, setFat] = useState("0");
  const [notes, setNotes] = useState("");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  
  // Get current time in HH:MM format
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const [mealTime, setMealTime] = useState(`${hours}:${minutes}`);
  
  const handleSave = () => {
    const newLog: MacroLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      notes,
      mealType,
      mealTime,
    };
    
    addMacroLog(newLog);
    Alert.alert(
      "Success", 
      "Food logged successfully",
      [
        {
          text: "OK",
          onPress: () => router.back()
        }
      ]
    );
  };
  
  const adjustValue = (setter: React.Dispatch<React.SetStateAction<string>>, value: string, amount: number) => {
    const currentValue = parseInt(value) || 0;
    const newValue = Math.max(0, currentValue + amount);
    setter(newValue.toString());
  };
  
  const getMealTypeIcon = () => {
    switch (mealType) {
      case "breakfast":
        return <Coffee size={20} color={colors.primary} />;
      case "lunch":
        return <UtensilsCrossed size={20} color={colors.primary} />;
      case "dinner":
        return <UtensilsCrossed size={20} color={colors.primary} />;
      case "snack":
        return <Soup size={20} color={colors.primary} />;
      default:
        return <Coffee size={20} color={colors.primary} />;
    }
  };
  
  const handleGoBack = () => {
    if (parseInt(calories) > 0 || parseInt(protein) > 0 || parseInt(carbs) > 0 || parseInt(fat) > 0 || notes.trim().length > 0) {
      Alert.alert(
        "Discard Changes",
        "You have unsaved changes. Are you sure you want to go back?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };
  
  const handleCancel = () => {
    handleGoBack();
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: "Log Food",
          headerBackTitle: "Nutrition",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back"
              accessibilityHint="Returns to the previous screen"
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Log Your Nutrition</Text>
        <Text style={styles.subtitle}>Track your macros and calories</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.mealInfoContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Type</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={mealType}
                onValueChange={(itemValue) => setMealType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Breakfast" value="breakfast" />
                <Picker.Item label="Lunch" value="lunch" />
                <Picker.Item label="Dinner" value="dinner" />
                <Picker.Item label="Snack" value="snack" />
              </Picker>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Meal Time</Text>
            <View style={styles.timeInputContainer}>
              <Clock size={20} color={colors.textSecondary} style={styles.timeIcon} />
              <TextInput
                style={styles.timeInput}
                value={mealTime}
                onChangeText={setMealTime}
                placeholder="HH:MM"
                keyboardType="numbers-and-punctuation"
              />
            </View>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Calories</Text>
          <View style={styles.numberInput}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustValue(setCalories, calories, -50)}
            >
              <Minus size={20} color={colors.text} />
            </TouchableOpacity>
            
            <TextInput
              style={styles.input}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustValue(setCalories, calories, 50)}
            >
              <Plus size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.macroContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Protein (g)</Text>
            <View style={styles.numberInput}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setProtein, protein, -1)}
              >
                <Minus size={20} color={colors.text} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.input}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
              />
              
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setProtein, protein, 1)}
              >
                <Plus size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Carbs (g)</Text>
            <View style={styles.numberInput}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setCarbs, carbs, -1)}
              >
                <Minus size={20} color={colors.text} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.input}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
              />
              
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setCarbs, carbs, 1)}
              >
                <Plus size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fat (g)</Text>
            <View style={styles.numberInput}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setFat, fat, -1)}
              >
                <Minus size={20} color={colors.text} />
              </TouchableOpacity>
              
              <TextInput
                style={styles.input}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
              />
              
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setFat, fat, 1)}
              >
                <Plus size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.notesContainer}>
          <Text style={styles.label}>Notes</Text>
          <NoteInput
            initialValue={notes}
            onSave={setNotes}
            placeholder="Add notes about this meal..."
            multiline
          />
        </View>
        
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Macronutrient Breakdown</Text>
          
          <View style={styles.macroBreakdown}>
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: colors.macroProtein }]} />
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>{protein}g</Text>
              <Text style={styles.macroCalories}>
                {(parseInt(protein) || 0) * 4} kcal
              </Text>
            </View>
            
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: colors.macroCarbs }]} />
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>{carbs}g</Text>
              <Text style={styles.macroCalories}>
                {(parseInt(carbs) || 0) * 4} kcal
              </Text>
            </View>
            
            <View style={styles.macroItem}>
              <View style={[styles.macroCircle, { backgroundColor: colors.macroFat }]} />
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>{fat}g</Text>
              <Text style={styles.macroCalories}>
                {(parseInt(fat) || 0) * 9} kcal
              </Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <Button
          title="Save Food Log"
          onPress={handleSave}
          style={styles.saveButton}
        />
        
        <Button
          title="Cancel"
          onPress={handleCancel}
          variant="outline"
          style={styles.cancelButton}
        />
      </View>
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
  mealInfoContainer: {
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  timeIcon: {
    marginRight: 8,
  },
  timeInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text,
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
  macroContainer: {
    marginBottom: 16,
  },
  notesContainer: {
    marginBottom: 24,
  },
  summary: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
    textAlign: "center",
  },
  macroBreakdown: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  macroItem: {
    alignItems: "center",
  },
  macroCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  macroCalories: {
    fontSize: 12,
    color: colors.textLight,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
  },
  backButton: {
    padding: 8,
  },
});