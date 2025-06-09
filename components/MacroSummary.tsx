import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/constants/colors";
import { MacroGoals } from "@/types";
import { useGamificationStore } from "@/store/gamificationStore";
import { Trophy, Info } from "lucide-react-native";
import { useRouter } from "expo-router";
import MacroInfoModal from "./MacroInfoModal";

interface MacroSummaryProps {
  current: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  goals: MacroGoals | null;
}

export default function MacroSummary({ current, goals }: MacroSummaryProps) {
  const { gamificationEnabled, achievements } = useGamificationStore();
  const router = useRouter();
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  
  // Check if goals are valid
  const hasValidGoals = goals && 
    goals.calories > 0 && 
    goals.protein > 0 && 
    goals.carbs > 0 && 
    goals.fat > 0;
  
  // If no valid goals, show a message to set them up
  if (!hasValidGoals) {
    return (
      <View style={styles.container}>
        <View style={styles.noGoalsCard}>
          <Text style={styles.noGoalsTitle}>No Nutrition Goals Set</Text>
          <Text style={styles.noGoalsDescription}>
            Set up your daily macro goals to track your nutrition progress and get personalized recommendations.
          </Text>
          <TouchableOpacity 
            style={styles.setupGoalsButton}
            onPress={() => router.push("/health-goals")}
          >
            <Text style={styles.setupGoalsButtonText}>Set Up Nutrition Goals</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  
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
          <View style={styles.titleContainer}>
            <Text style={styles.calorieTitle}>Calories</Text>
            <TouchableOpacity 
              onPress={() => setInfoModalVisible(true)}
              style={styles.infoButton}
              accessibilityLabel="Nutrition information"
              accessibilityHint="Opens a modal with information about how nutrition goals are calculated"
            >
              <Info size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
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
                { width: `${percentages.calories}%`, backgroundColor: colors.calorieColor },
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
      
      <MacroInfoModal 
        visible={infoModalVisible}
        onClose={() => setInfoModalVisible(false)}
      />
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  calorieTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  infoButton: {
    marginLeft: 8,
    padding: 2,
  },
  calorieNumbers: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  calorieConsumed: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
  },
  calorieDivider: {
    fontSize: 20,
    color: "#666666",
    marginHorizontal: 4,
  },
  calorieGoal: {
    fontSize: 20,
    color: "#666666",
  },
  calorieRemaining: {
    fontSize: 14,
    color: "#666666",
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
    color: "#000000",
    fontWeight: "500",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
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
    color: "#FFFFFF",
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
  noGoalsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  noGoalsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 8,
  },
  noGoalsDescription: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  setupGoalsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  setupGoalsButtonText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 14,
  },
});