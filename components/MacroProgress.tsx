import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors } from "@/constants/colors";
import { Trophy, Info } from "lucide-react-native";
import { useGamificationStore } from "@/store/gamificationStore";
import { useRouter } from "expo-router";

type MacroProgressProps = {
  title: string;
  current: number;
  goal: number;
  unit: string;
  percentage: number;
  color: string;
  achievementId?: string;
  hasValidGoals?: boolean;
  onInfoPress?: () => void;
};

export default function MacroProgress({ 
  title, 
  current, 
  goal, 
  unit, 
  percentage, 
  color,
  achievementId,
  hasValidGoals = true,
  onInfoPress
}: MacroProgressProps) {
  const { gamificationEnabled, achievements } = useGamificationStore();
  const router = useRouter();
  
  // If no valid goals, show a message to set them up
  if (!hasValidGoals) {
    return (
      <View style={styles.noGoalsContainer}>
        <Text style={styles.noGoalsText}>
          Set up your nutrition goals to track your {title.toLowerCase()} progress.
        </Text>
        <TouchableOpacity 
          style={styles.setupGoalsButton}
          onPress={() => router.push("/health-goals")}
        >
          <Text style={styles.setupGoalsButtonText}>Set Up Goals</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Ensure we have valid numbers to prevent NaN errors
  const safePercentage = isNaN(percentage) ? 0 : Math.min(100, percentage);
  const safeCurrent = isNaN(current) ? 0 : current;
  const safeGoal = isNaN(goal) ? 0 : goal;
  
  // Get achievement if ID is provided
  const achievement = achievementId && gamificationEnabled 
    ? achievements.find(a => a.id === achievementId) 
    : null;
  
  // Generate progress message
  const getProgressMessage = () => {
    if (safePercentage >= 100) {
      return `Great job! You've reached your ${title.toLowerCase()} goal! 🎉`;
    } else if (safePercentage >= 90) {
      return `Almost there! Just ${Math.round(safeGoal - safeCurrent)}${unit} to go!`;
    } else if (safePercentage >= 75) {
      return `You're making great progress!`;
    } else if (safePercentage >= 50) {
      return `Halfway to your goal!`;
    } else if (safePercentage >= 25) {
      return `You've made a good start!`;
    } else {
      return `${Math.round(safeGoal - safeCurrent)}${unit} remaining to reach your goal`;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {title === "Calories" && onInfoPress && (
            <TouchableOpacity 
              onPress={onInfoPress}
              style={styles.infoButton}
              accessibilityLabel="Nutrition information"
              accessibilityHint="Opens a modal with information about how nutrition goals are calculated"
            >
              <Info size={14} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.value}>
          {safeCurrent} / {safeGoal} {unit}
        </Text>
      </View>
      
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${safePercentage}%`, backgroundColor: color }
          ]} 
        />
      </View>
      
      <View style={styles.messageContainer}>
        <Text style={styles.progressMessage}>{getProgressMessage()}</Text>
        
        {achievement && !achievement.completed && (
          <TouchableOpacity style={styles.achievementButton}>
            <Trophy size={12} color={colors.primary} />
            <Text style={styles.achievementText}>
              {achievement.progress}/{achievement.target} days
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  infoButton: {
    marginLeft: 6,
    padding: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  messageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  progressMessage: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: "italic",
    flex: 1,
  },
  achievementButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 6,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  achievementText: {
    fontSize: 10,
    color: colors.primary,
    marginLeft: 4,
  },
  noGoalsContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  noGoalsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 8,
  },
  setupGoalsButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  setupGoalsButtonText: {
    color: colors.white,
    fontWeight: "500",
    fontSize: 12,
  },
});