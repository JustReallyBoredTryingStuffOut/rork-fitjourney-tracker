import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Dumbbell, ChevronRight } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { Exercise } from "@/types";

type ExerciseCardProps = {
  exercise: Exercise;
  onPress?: () => void;
  compact?: boolean;
};

export default function ExerciseCard({ exercise, onPress, compact = false }: ExerciseCardProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/exercise/${exercise.id}`);
    }
  };

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer} 
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{exercise.name}</Text>
          <View style={styles.compactTags}>
            {exercise.muscleGroups.slice(0, 1).map(group => (
              <View key={group} style={styles.compactTag}>
                <Text style={styles.compactTagText}>{group}</Text>
              </View>
            ))}
            {exercise.equipment.length > 0 && (
              <View style={styles.compactEquipment}>
                <Dumbbell size={10} color={colors.textSecondary} />
                <Text style={styles.compactEquipmentText}>
                  {exercise.equipment[0]}
                </Text>
              </View>
            )}
          </View>
        </View>
        <ChevronRight size={16} color={colors.textLight} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{exercise.name}</Text>
          <View style={[styles.badge, { backgroundColor: getBadgeColor(exercise.difficulty) }]}>
            <Text style={styles.badgeText}>{exercise.difficulty}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {exercise.description}
        </Text>
        
        <View style={styles.tags}>
          {exercise.muscleGroups.map(group => (
            <View key={group} style={styles.tag}>
              <Text style={styles.tagText}>{group}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.equipment}>
          {exercise.equipment.map(item => (
            <View key={item} style={styles.equipmentItem}>
              <Dumbbell size={12} color={colors.textSecondary} />
              <Text style={styles.equipmentText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
      
      {exercise.imageUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: exercise.imageUrl }} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}
      
      <View style={styles.arrow}>
        <ChevronRight size={20} color={colors.textLight} />
      </View>
    </TouchableOpacity>
  );
}

const getBadgeColor = (difficulty: "beginner" | "intermediate" | "advanced") => {
  switch (difficulty) {
    case "beginner":
      return "#4CD964";
    case "intermediate":
      return "#FFCC00";
    case "advanced":
      return "#FF3B30";
    default:
      return colors.primary;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#FFFFFF",
    textTransform: "capitalize",
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  tag: {
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 6,
  },
  tagText: {
    fontSize: 12,
    color: "#3498db",
  },
  equipment: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
    marginBottom: 4,
  },
  equipmentText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: "hidden",
    marginLeft: 12,
    marginRight: 12,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  arrow: {
    justifyContent: "center",
  },
  
  // Compact styles
  compactContainer: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 4,
  },
  compactTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  compactTag: {
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 6,
  },
  compactTagText: {
    fontSize: 12,
    color: "#3498db",
  },
  compactEquipment: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  compactEquipmentText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});