import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";
import { MacroGoals } from "@/types";

interface MacroSummaryProps {
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: MacroGoals;
}

export default function MacroSummary({ current, goals }: MacroSummaryProps) {
  // Calculate remaining macros
  const remaining = {
    calories: Math.max(0, goals.calories - current.calories),
    protein: Math.max(0, goals.protein - current.protein),
    carbs: Math.max(0, goals.carbs - current.carbs),
    fat: Math.max(0, goals.fat - current.fat),
  };

  // Calculate percentages
  const percentages = {
    calories: Math.min(100, (current.calories / goals.calories) * 100 || 0),
    protein: Math.min(100, (current.protein / goals.protein) * 100 || 0),
    carbs: Math.min(100, (current.carbs / goals.carbs) * 100 || 0),
    fat: Math.min(100, (current.fat / goals.fat) * 100 || 0),
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.calorieSection}>
          <Text style={styles.calorieTitle}>Calories</Text>
          <View style={styles.calorieNumbers}>
            <Text style={styles.calorieConsumed}>{current.calories}</Text>
            <Text style={styles.calorieDivider}>/</Text>
            <Text style={styles.calorieGoal}>{goals.calories}</Text>
          </View>
          <Text style={styles.calorieRemaining}>
            {remaining.calories} kcal remaining
          </Text>

          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${percentages.calories}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.macroSection}>
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <View
                style={[styles.macroIndicator, { backgroundColor: colors.macroProtein }]}
              />
              <Text style={styles.macroTitle}>Protein</Text>
            </View>
            <Text style={styles.macroValue}>
              {current.protein}g / {goals.protein}g
            </Text>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <View
                style={[styles.macroIndicator, { backgroundColor: colors.macroCarbs }]}
              />
              <Text style={styles.macroTitle}>Carbs</Text>
            </View>
            <Text style={styles.macroValue}>
              {current.carbs}g / {goals.carbs}g
            </Text>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <View
                style={[styles.macroIndicator, { backgroundColor: colors.macroFat }]}
              />
              <Text style={styles.macroTitle}>Fat</Text>
            </View>
            <Text style={styles.macroValue}>
              {current.fat}g / {goals.fat}g
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  calorieSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  calorieTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  calorieNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  calorieConsumed: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text,
  },
  calorieDivider: {
    fontSize: 20,
    color: colors.textSecondary,
    marginHorizontal: 4,
  },
  calorieGoal: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  calorieRemaining: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  macroSection: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  macroItem: {
    flex: 1,
  },
  macroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  macroTitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
});