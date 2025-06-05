import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

type MacroSummaryProps = {
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export default function MacroSummary({ current, goals }: MacroSummaryProps) {
  const { colors } = useTheme();
  
  // Ensure we have valid objects to prevent errors
  const safeCurrent = current || { calories: 0, protein: 0, carbs: 0, fat: 0 };
  const safeGoals = goals || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  // Calculate percentages safely
  const calculatePercentage = (current: number, goal: number) => {
    if (!goal || goal <= 0) return 0;
    return Math.min(100, Math.round((current / goal) * 100));
  };

  const caloriesPercentage = calculatePercentage(safeCurrent.calories, safeGoals.calories);
  const proteinPercentage = calculatePercentage(safeCurrent.protein, safeGoals.protein);
  const carbsPercentage = calculatePercentage(safeCurrent.carbs, safeGoals.carbs);
  const fatPercentage = calculatePercentage(safeCurrent.fat, safeGoals.fat);

  return (
    <View style={styles.container}>
      <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.text }]}>{safeCurrent.calories}</Text>
            <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Calories</Text>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${caloriesPercentage}%`, backgroundColor: "#FF6B6B" }
                ]} 
              />
            </View>
            <Text style={[styles.percentageText, { color: colors.textSecondary }]}>{caloriesPercentage}%</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.text }]}>{safeCurrent.protein}g</Text>
            <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Protein</Text>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${proteinPercentage}%`, backgroundColor: "#4A90E2" }
                ]} 
              />
            </View>
            <Text style={[styles.percentageText, { color: colors.textSecondary }]}>{proteinPercentage}%</Text>
          </View>
        </View>
        
        <View style={styles.macroRow}>
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.text }]}>{safeCurrent.carbs}g</Text>
            <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Carbs</Text>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${carbsPercentage}%`, backgroundColor: "#50C878" }
                ]} 
              />
            </View>
            <Text style={[styles.percentageText, { color: colors.textSecondary }]}>{carbsPercentage}%</Text>
          </View>
          
          <View style={styles.macroItem}>
            <Text style={[styles.macroValue, { color: colors.text }]}>{safeCurrent.fat}g</Text>
            <Text style={[styles.macroLabel, { color: colors.textSecondary }]}>Fat</Text>
            <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${fatPercentage}%`, backgroundColor: "#FFA500" }
                ]} 
              />
            </View>
            <Text style={[styles.percentageText, { color: colors.textSecondary }]}>{fatPercentage}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  macroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  macroItem: {
    flex: 1,
    alignItems: "center",
  },
  macroValue: {
    fontSize: 20,
    fontWeight: "700",
  },
  macroLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    width: "90%",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  percentageText: {
    fontSize: 12,
  },
});