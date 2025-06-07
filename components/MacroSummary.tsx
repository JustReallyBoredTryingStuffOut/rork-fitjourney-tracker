import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/constants/colors";
import { MacroGoals } from "@/types";
import { useGamificationStore } from "@/store/gamificationStore";
import { Trophy } from "lucide-react-native";

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
  const { gamificationEnabled, achievements } = useGamificationStore();
  
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
  
  // Get nutrition achievements
  const nutritionAchievements = achievements.filter(a => 
    a.category === "nutrition" && !a.completed
  );
  
  // Check if we're close to any nutrition achievements
  const proteinGoalAchievement = nutritionAchievements.find(a => a.id === "nutrition-protein-goal");
  const balancedMacrosAchievement = nutritionAchievements.find(a => a.id === "nutrition-balanced-10");
  
  // Generate motivational messages
  const getMotivationalMessage = () => {
    // Check if all macros are at least 90% complete
    const allMacrosNearlyComplete = 
      percentages.protein >= 90 && 
      percentages.carbs >= 90 && 
      percentages.fat >= 90;
    
    if (allMacrosNearlyComplete) {
      return "Great job! You've nearly hit all your macro targets for today! 🎯";
    }
    
    // Check if protein is highest
    if (percentages.protein >= percentages.carbs && percentages.protein >= percentages.fat) {
      if (percentages.protein >= 90) {
        return "Excellent protein intake today! Your muscles thank you! 💪";
      } else if (percentages.protein >= 70) {
        return "You're doing well with protein today. Keep it up! 💪";
      } else {
        return "Focus on getting more protein to support your fitness goals! 🥩";
      }
    }
    
    // Check if carbs are highest
    if (percentages.carbs >= percentages.protein && percentages.carbs >= percentages.fat) {
      if (percentages.carbs >= 90) {
        return "You've fueled up well with carbs today! Great energy source! 🍚";
      } else if (percentages.carbs >= 70) {
        return "Good carb intake today. Keeping your energy levels up! 🍞";
      } else {
        return "Consider adding more complex carbs for sustained energy! 🌾";
      }
    }
    
    // Check if fats are highest
    if (percentages.fat >= 90) {
      return "You're doing great with healthy fats today! 🥑";
    } else if (percentages.fat >= 70) {
      return "Good fat intake today. Important for hormone health! 🧠";
    } else {
      return "Don't forget healthy fats - they're essential for your body! 🫒";
    }
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
            {proteinGoalAchievement && gamificationEnabled && (
              <View style={styles.achievementProgress}>
                <Trophy size={12} color={colors.primary} />
                <Text style={styles.achievementText}>
                  {proteinGoalAchievement.progress}/{proteinGoalAchievement.target} days
                </Text>
              </View>
            )}
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
        
        {gamificationEnabled && (
          <View style={styles.motivationContainer}>
            <Text style={styles.motivationText}>{getMotivationalMessage()}</Text>
            
            {balancedMacrosAchievement && (
              <TouchableOpacity style={styles.achievementButton}>
                <Trophy size={14} color={colors.primary} />
                <Text style={styles.achievementButtonText}>
                  {balancedMacrosAchievement.progress}/{balancedMacrosAchievement.target} balanced days
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
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
    marginBottom: 16,
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
  achievementProgress: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  achievementText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
  },
  motivationContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    marginTop: 4,
  },
  motivationText: {
    fontSize: 14,
    color: colors.text,
    fontStyle: "italic",
    textAlign: "center",
  },
  achievementButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    padding: 6,
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementButtonText: {
    fontSize: 12,
    color: colors.primary,
    marginLeft: 4,
    fontWeight: "500",
  },
});