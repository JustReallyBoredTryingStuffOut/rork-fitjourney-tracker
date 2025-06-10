import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  PanResponder,
  Dimensions,
  Platform,
  Vibration
} from 'react-native';
import { ChevronDown, ChevronUp, Check, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import { Exercise, ExerciseLog } from '@/types';

type DraggableExerciseCardProps = {
  exercise: Exercise;
  exerciseLog: ExerciseLog;
  index: number;
  isCompleted: boolean;
  areAllSetsCompleted: boolean;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDragStart: () => void;
  onDragEnd: (toIndex: number) => void;
  onMarkCompleted: () => void;
  onStartRest: () => void;
  totalExercises: number;
  children: React.ReactNode;
};

const CARD_HEIGHT = 80; // Height of collapsed card
const DRAG_THRESHOLD = 50; // Distance needed to trigger a reorder

export default function DraggableExerciseCard({
  exercise,
  exerciseLog,
  index,
  isCompleted,
  areAllSetsCompleted,
  isExpanded,
  onToggleExpand,
  onDragStart,
  onDragEnd,
  onMarkCompleted,
  onStartRest,
  totalExercises,
  children
}: DraggableExerciseCardProps) {
  const { colors } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const screenHeight = Dimensions.get('window').height;
  
  // Calculate possible drop positions
  const getDropIndex = (gestureY: number, cardY: number) => {
    const relativeY = gestureY - cardY;
    const direction = relativeY > 0 ? 1 : -1;
    const distance = Math.abs(relativeY);
    
    if (distance > DRAG_THRESHOLD) {
      const newIndex = index + direction;
      if (newIndex >= 0 && newIndex < totalExercises) {
        return newIndex;
      }
    }
    
    return index;
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical movements
        return Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dx) < 10;
      },
      onPanResponderGrant: () => {
        // Start dragging
        setIsDragging(true);
        onDragStart();
        
        // Provide haptic feedback when drag starts
        if (Platform.OS !== 'web') {
          Vibration.vibrate(50);
        }
        
        // Store the initial position
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: Animated.event(
        [null, { dy: pan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gestureState) => {
        // Reset the pan offset
        pan.flattenOffset();
        
        // Calculate the new index based on the gesture
        const dropIndex = getDropIndex(gestureState.moveY, gestureState.y0);
        
        // Reset the position
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5
        }).start(() => {
          setIsDragging(false);
          
          // Only call onDragEnd if the index changed
          if (dropIndex !== index) {
            onDragEnd(dropIndex);
          }
        });
      }
    })
  ).current;
  
  // Calculate styles for the draggable card
  const cardStyle = {
    transform: [{ translateY: pan.y }],
    zIndex: isDragging ? 999 : 1,
    shadowOpacity: isDragging ? 0.3 : 0.1,
    shadowRadius: isDragging ? 10 : 2,
    elevation: isDragging ? 8 : 2,
  };
  
  return (
    <Animated.View 
      style={[
        styles.container, 
        { backgroundColor: colors.card },
        cardStyle
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity 
        style={[
          styles.header,
          isCompleted && styles.completedHeader
        ]}
        onPress={onToggleExpand}
        activeOpacity={0.7}
      >
        <View style={styles.exerciseInfo}>
          <Text 
            style={[
              styles.exerciseName, 
              { color: isCompleted ? colors.textSecondary : colors.text },
              isCompleted && styles.completedText
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {exercise.name}
          </Text>
          
          <Text 
            style={[
              styles.exerciseDetail, 
              { color: colors.textSecondary },
              isCompleted && styles.completedText
            ]}
          >
            {exerciseLog.sets.length} sets • {exercise.muscleGroups.join(', ')}
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          {isCompleted ? (
            <View style={[styles.completedBadge, { backgroundColor: colors.secondary }]}>
              <Check size={16} color="#FFFFFF" />
            </View>
          ) : areAllSetsCompleted ? (
            <TouchableOpacity
              style={[styles.markCompletedButton, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}
              onPress={onMarkCompleted}
            >
              <Check size={16} color={colors.secondary} />
            </TouchableOpacity>
          ) : null}
          
          <TouchableOpacity style={styles.expandButton}>
            {isExpanded ? (
              <ChevronUp size={20} color={colors.textSecondary} />
            ) : (
              <ChevronDown size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.content}>
          {children}
          
          {areAllSetsCompleted && !isCompleted && (
            <View style={styles.completionActions}>
              <TouchableOpacity
                style={[styles.completionButton, { backgroundColor: "rgba(80, 200, 120, 0.1)" }]}
                onPress={onMarkCompleted}
              >
                <Check size={16} color={colors.secondary} />
                <Text style={[styles.completionButtonText, { color: colors.secondary }]}>
                  Mark Completed
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.restButton, { backgroundColor: "rgba(255, 149, 0, 0.1)" }]}
                onPress={onStartRest}
              >
                <Clock size={16} color="#FF9500" />
                <Text style={[styles.restButtonText, { color: "#FF9500" }]}>
                  Rest
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      
      {isDragging && (
        <View style={styles.dragIndicator}>
          <View style={styles.dragHandle} />
          <View style={styles.dragHandle} />
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  completedHeader: {
    opacity: 0.8,
  },
  exerciseInfo: {
    flex: 1,
    marginRight: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseDetail: {
    fontSize: 14,
  },
  completedText: {
    textDecorationLine: 'line-through',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  markCompletedButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    paddingTop: 0,
  },
  completionActions: {
    flexDirection: 'row',
    marginTop: 16,
  },
  completionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginRight: 8,
  },
  completionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  restButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  restButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
  },
  dragIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dragHandle: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    marginVertical: 2,
    borderRadius: 1,
  },
});