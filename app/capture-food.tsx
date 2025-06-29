import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Camera, ScanLine } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { usePhotoStore, FoodPhoto } from "@/store/photoStore";
import { useMacroStore } from "@/store/macroStore";
import FoodPhotoAnalyzer from "@/components/FoodPhotoAnalyzer";
import NutritionLabelScanner from "@/components/NutritionLabelScanner";

type CaptureMode = "select" | "analyze" | "scan";

export default function CaptureFoodScreen() {
  const router = useRouter();
  const { addFoodPhoto } = usePhotoStore();
  const { addMacroLog } = useMacroStore();
  const [mode, setMode] = useState<CaptureMode>("select");
  
  const handlePhotoTaken = async (photo: FoodPhoto) => {
    // Save the photo to the store
    await addFoodPhoto(photo);
    
    // Also log the macros
    addMacroLog({
      id: Date.now().toString(),
      date: photo.date,
      calories: photo.calories,
      protein: photo.protein,
      carbs: photo.carbs,
      fat: photo.fat,
      foodName: photo.name,
      quantity: 1,
      notes: `Photo: ${photo.name}`,
      mealType: "snack", // Default meal type, can be changed later
    });
    
    // Navigate back
    router.back();
  };

  const handleNutritionScanned = (nutritionData: {
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    // Create a food photo entry for the scanned nutrition label
    const photo: FoodPhoto = {
      id: Date.now().toString(),
      uri: "", // No image for nutrition label scan
      date: new Date().toISOString(),
      name: nutritionData.name,
      calories: nutritionData.calories,
      protein: nutritionData.protein,
      carbs: nutritionData.carbs,
      fat: nutritionData.fat,
      notes: "",
      isAnalyzed: true,
    };

    // Save to stores
    addFoodPhoto(photo);
    addMacroLog({
      id: Date.now().toString(),
      date: photo.date,
      calories: photo.calories,
      protein: photo.protein,
      carbs: photo.carbs,
      fat: photo.fat,
      foodName: photo.name,
      quantity: 1,
      notes: `Nutrition Label: ${photo.name}`,
      mealType: "snack",
    });

    // Navigate back
    router.back();
  };
  
  const handleGoBack = () => {
    if (mode === "select") {
      router.back();
    } else {
      setMode("select");
    }
  };

  const getScreenTitle = () => {
    switch (mode) {
      case "analyze":
        return "Analyze Food";
      case "scan":
        return "Scan Nutrition Label";
      default:
        return "Add Food";
    }
  };

  const renderModeSelection = () => (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.modeContainer}>
        <Text style={styles.title}>How would you like to add food?</Text>
        <Text style={styles.subtitle}>Choose your preferred method</Text>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => setMode("analyze")}
        >
          <View style={styles.modeIcon}>
            <Camera size={32} color={colors.primary} />
          </View>
          <View style={styles.modeContent}>
            <Text style={styles.modeTitle}>Analyze Food Photo</Text>
            <Text style={styles.modeDescription}>
              Take a photo of your food and get AI-powered nutritional analysis
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.modeCard}
          onPress={() => setMode("scan")}
        >
          <View style={styles.modeIcon}>
            <ScanLine size={32} color={colors.primary} />
          </View>
          <View style={styles.modeContent}>
            <Text style={styles.modeTitle}>Scan Nutrition Label</Text>
            <Text style={styles.modeDescription}>
              Scan a nutrition facts label to automatically extract nutritional information
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
  
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: getScreenTitle(),
          headerShown: true,
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {mode === "select" && renderModeSelection()}
      
      {mode === "analyze" && (
        <FoodPhotoAnalyzer
          onPhotoTaken={handlePhotoTaken}
          onCancel={() => setMode("select")}
        />
      )}

      {mode === "scan" && (
        <NutritionLabelScanner
          onNutritionScanned={handleNutritionScanned}
          onCancel={() => setMode("select")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  modeContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 40,
  },
  modeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  modeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  modeContent: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  backButton: {
    padding: 8,
  },
});