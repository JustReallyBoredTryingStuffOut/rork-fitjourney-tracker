import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter, Stack } from "expo-router";
import { Plus, Minus, Clock, Coffee, UtensilsCrossed, Soup, ArrowLeft, Info } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useMacroStore } from "@/store/macroStore";
import { MacroLog, FoodItem } from "@/types";
import Button from "@/components/Button";
import NoteInput from "@/components/NoteInput";
import { Picker } from "@react-native-picker/picker";
import FoodCategorySelector from "@/components/FoodCategorySelector";
import { foodCategories, getFoodCategoriesByMealType } from "@/mocks/foodCategories";

export default function LogFoodScreen() {
  const router = useRouter();
  const { addMacroLog } = useMacroStore();
  
  const [calories, setCalories] = useState("0");
  const [protein, setProtein] = useState("0");
  const [carbs, setCarbs] = useState("0");
  const [fat, setFat] = useState("0");
  const [notes, setNotes] = useState("");
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [quantity, setQuantity] = useState("1");
  
  // Get current time in HH:MM format
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const [mealTime, setMealTime] = useState(`${hours}:${minutes}`);
  
  // Update macros when food item is selected
  useEffect(() => {
    if (selectedFood) {
      const qty = parseFloat(quantity) || 1;
      setCalories(Math.round(selectedFood.calories * qty).toString());
      setProtein(Math.round(selectedFood.protein * qty).toString());
      setCarbs(Math.round(selectedFood.carbs * qty).toString());
      setFat(Math.round(selectedFood.fat * qty).toString());
    }
  }, [selectedFood, quantity]);
  
  // Update macros when quantity changes
  useEffect(() => {
    if (selectedFood) {
      const qty = parseFloat(quantity) || 1;
      setCalories(Math.round(selectedFood.calories * qty).toString());
      setProtein(Math.round(selectedFood.protein * qty).toString());
      setCarbs(Math.round(selectedFood.carbs * qty).toString());
      setFat(Math.round(selectedFood.fat * qty).toString());
    }
  }, [quantity]);
  
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
      foodItemId: selectedFood?.id,
      foodName: selectedFood?.name,
      servingSize: selectedFood?.servingSize,
      quantity: parseFloat(quantity) || 1,
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
  
  const adjustQuantity = (amount: number) => {
    const currentValue = parseFloat(quantity) || 1;
    const newValue = Math.max(0.25, currentValue + amount);
    setQuantity(newValue.toString());
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
  
  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setQuantity("1");
  };
  
  const handleClearFood = () => {
    setSelectedFood(null);
    setCalories("0");
    setProtein("0");
    setCarbs("0");
    setFat("0");
    setQuantity("1");
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
                onValueChange={(itemValue) => {
                  setMealType(itemValue);
                  setSelectedFood(null);
                }}
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
        
        <View style={styles.optionSection}>
          <View style={styles.optionHeader}>
            <Text style={styles.optionTitle}>Option 1: Select from Food Database</Text>
            <TouchableOpacity style={styles.infoButton}>
              <Info size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.optionDescription}>
            Choose from our food database or enter nutrition information manually below
          </Text>
        </View>
        
        {/* Food Category Selector */}
        <FoodCategorySelector
          mealType={mealType}
          categories={foodCategories}
          onSelectFood={handleSelectFood}
        />
        
        {/* Selected Food Display */}
        {selectedFood && (
          <View style={styles.selectedFoodContainer}>
            <View style={styles.selectedFoodHeader}>
              <Text style={styles.selectedFoodTitle}>Selected Food</Text>
              <TouchableOpacity onPress={handleClearFood} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.selectedFoodCard}>
              {selectedFood.imageUrl && (
                <Image source={{ uri: selectedFood.imageUrl }} style={styles.foodImage} />
              )}
              
              <View style={styles.foodDetails}>
                <Text style={styles.foodName}>{selectedFood.name}</Text>
                <Text style={styles.servingSize}>{selectedFood.servingSize}</Text>
                
                <View style={styles.quantityContainer}>
                  <Text style={styles.quantityLabel}>Quantity:</Text>
                  <View style={styles.quantityControls}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => adjustQuantity(-0.25)}
                    >
                      <Minus size={16} color={colors.text} />
                    </TouchableOpacity>
                    
                    <TextInput
                      style={styles.quantityInput}
                      value={quantity}
                      onChangeText={setQuantity}
                      keyboardType="numeric"
                    />
                    
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => adjustQuantity(0.25)}
                    >
                      <Plus size={16} color={colors.text} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}
        
        <View style={styles.optionSection}>
          <View style={styles.optionHeader}>
            <Text style={styles.optionTitle}>Option 2: Enter Nutrition Manually</Text>
            <TouchableOpacity style={styles.infoButton}>
              <Info size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.optionDescription}>
            You can directly enter nutrition values without selecting a food
          </Text>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Calories</Text>
          <View style={styles.numberInput}>
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustValue(setCalories, calories, -50)}
              disabled={!!selectedFood}
            >
              <Minus size={20} color={selectedFood ? colors.textLight : colors.text} />
            </TouchableOpacity>
            
            <TextInput
              style={[styles.input, selectedFood && styles.inputDisabled]}
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
              editable={!selectedFood}
            />
            
            <TouchableOpacity 
              style={styles.button}
              onPress={() => adjustValue(setCalories, calories, 50)}
              disabled={!!selectedFood}
            >
              <Plus size={20} color={selectedFood ? colors.textLight : colors.text} />
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
                disabled={!!selectedFood}
              >
                <Minus size={20} color={selectedFood ? colors.textLight : colors.text} />
              </TouchableOpacity>
              
              <TextInput
                style={[styles.input, selectedFood && styles.inputDisabled]}
                value={protein}
                onChangeText={setProtein}
                keyboardType="numeric"
                editable={!selectedFood}
              />
              
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setProtein, protein, 1)}
                disabled={!!selectedFood}
              >
                <Plus size={20} color={selectedFood ? colors.textLight : colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Carbs (g)</Text>
            <View style={styles.numberInput}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setCarbs, carbs, -1)}
                disabled={!!selectedFood}
              >
                <Minus size={20} color={selectedFood ? colors.textLight : colors.text} />
              </TouchableOpacity>
              
              <TextInput
                style={[styles.input, selectedFood && styles.inputDisabled]}
                value={carbs}
                onChangeText={setCarbs}
                keyboardType="numeric"
                editable={!selectedFood}
              />
              
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setCarbs, carbs, 1)}
                disabled={!!selectedFood}
              >
                <Plus size={20} color={selectedFood ? colors.textLight : colors.text} />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Fat (g)</Text>
            <View style={styles.numberInput}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setFat, fat, -1)}
                disabled={!!selectedFood}
              >
                <Minus size={20} color={selectedFood ? colors.textLight : colors.text} />
              </TouchableOpacity>
              
              <TextInput
                style={[styles.input, selectedFood && styles.inputDisabled]}
                value={fat}
                onChangeText={setFat}
                keyboardType="numeric"
                editable={!selectedFood}
              />
              
              <TouchableOpacity 
                style={styles.button}
                onPress={() => adjustValue(setFat, fat, 1)}
                disabled={!!selectedFood}
              >
                <Plus size={20} color={selectedFood ? colors.textLight : colors.text} />
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
  inputDisabled: {
    backgroundColor: colors.backgroundLight,
    color: colors.textLight,
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
  selectedFoodContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
  },
  selectedFoodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  selectedFoodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  clearButton: {
    padding: 4,
  },
  clearButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
  },
  selectedFoodCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  foodImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  foodDetails: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  servingSize: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  quantityLabel: {
    fontSize: 14,
    color: colors.text,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  quantityButton: {
    padding: 8,
    backgroundColor: colors.background,
  },
  quantityInput: {
    width: 40,
    paddingVertical: 4,
    fontSize: 14,
    color: colors.text,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  optionSection: {
    marginBottom: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
  },
  optionHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginRight: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  infoButton: {
    padding: 4,
  },
});