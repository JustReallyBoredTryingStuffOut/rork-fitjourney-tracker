import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "@/constants/colors";

type MacroProgressProps = {
  title: string;
  current: number;
  goal: number;
  unit: string;
  percentage: number;
  color: string;
};

export default function MacroProgress({ 
  title, 
  current, 
  goal, 
  unit, 
  percentage, 
  color 
}: MacroProgressProps) {
  // Ensure we have valid numbers to prevent NaN errors
  const safePercentage = isNaN(percentage) ? 0 : Math.min(100, percentage);
  const safeCurrent = isNaN(current) ? 0 : current;
  const safeGoal = isNaN(goal) ? 0 : goal;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
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
  title: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
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
});