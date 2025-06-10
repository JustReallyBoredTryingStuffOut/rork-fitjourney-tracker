import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  PanResponder,
  Dimensions,
  Platform
} from 'react-native';
import { 
  GripVertical, 
  Check, 
  Clock, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react-native';
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

const { height } = Dimensions.get('window');
const CARD_HEIGHT = 60; // Reduced height for collapsed card

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
  const translateY = useRef(new Animated.Value(0)).current;

  // Calculate possible positions for snapping
  const getSnapPoints = () => {
    const points = [];
    for (let i = 0; i < totalExercises; i++) {
      points.push(i * CARD_HEIGHT);
    }
    return points;
  };

  // Find the closest snap point
  const getClosestSnapPoint = (y: number) => {
    const snapPoints = getSnapPoints();
    let closestPoint = snapPoints[index];
    let minDistance = Math.abs(y - closestPoint);
    
    snapPoints.forEach((point, i) => {
      const distance = Math.abs(y - point);
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    });
    
    return snapPoints.indexOf(closestPoint);
  };

  // Only use PanResponder on mobile platforms
  const panResponder = Platform.OS !== 'web' ? PanResponder.create({
    onStartShouldSetPanResponder: (_, gestureState) => {
      // Only respond to touches on the drag handle area
      return gestureState.dx < 40; // Approximate width of drag handle
    },
    onMoveShouldSetPanResponder: (_, gestureState) => {
      // Only respond to vertical movements
      return Math.abs(gestureState.dy) > 5 && Math.abs(gestureState.dx) < 10;
    },
    onPanResponderGrant: () => {
      setIsDragging(true);
      onDragStart();
      pan.setOffset({
        x: 0,
        y: translateY._value
      });
      pan.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event(
      [null, { dy: pan.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (_, gestureState) => {
      pan.flattenOffset();
      
      // Calculate the new index based on the gesture
      const newIndex = getClosestSnapPoint(index * CARD_HEIGHT + gestureState.dy);
      
      // Animate back to the original position
      Animated.spring(pan, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        friction: 5
      }).start(() => {
        setIsDragging(false);
        
        // Only call onDragEnd if the index actually changed
        if (newIndex !== index) {
          onDragEnd(newIndex);
        }
      });
    }
  }) : { panHandlers: {} };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.card,
          transform: [{ translateY: pan.y }],
          zIndex: isDragging ? 999 : 1,
          elevation: isDragging ? 5 : 1,
          shadowOpacity: isDragging ? 0.3 : 0.1,
          height: isExpanded ? 'auto' : CARD_HEIGHT,
        },
        isCompleted && styles.completedCard
      ]}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          {Platform.OS !== 'web' && (
            <TouchableOpacity 
              {...panResponder.panHandlers} 
              style={styles.dragHandle}
              activeOpacity={0.7}
            >
              <GripVertical size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
          <View style={styles.exerciseInfo}>
            <Text style={[styles.exerciseName, { color: colors.text }]} numberOfLines={1}>
              {exercise.name}
            </Text>
            <Text style={[styles.exerciseMuscles, { color: colors.primary }]} numberOfLines={1}>
              {exercise.muscleGroups.join(", ")}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerRight}>
          {areAllSetsCompleted && !isCompleted && (
            <TouchableOpacity
              style={[styles.completeIconButton, { backgroundColor: colors.success }]}
              onPress={onMarkCompleted}
            >
              <Check size={16} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={styles.expandButton}
            onPress={onToggleExpand}
          >
            {isExpanded ? (
              <ChevronUp size={20} color={colors.textSecondary} />
            ) : (
              <ChevronDown size={20} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      
      {isExpanded && (
        <View style={styles.content}>
          {children}
          
          <View style={styles.footer}>
            {areAllSetsCompleted && !isCompleted && (
              <View style={styles.completionActions}>
                <TouchableOpacity
                  style={[styles.completeButton, { backgroundColor: colors.success }]}
                  onPress={onMarkCompleted}
                >
                  <Check size={18} color="#FFFFFF" />
                  <Text style={styles.completeButtonText}>Mark Completed</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.restButton, { backgroundColor: colors.warning }]}
                  onPress={onStartRest}
                >
                  <Clock size={18} color="#FFFFFF" />
                  <Text style={styles.restButtonText}>Rest</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      )}
      
      {isCompleted && (
        <View style={[styles.completedOverlay, { backgroundColor: `${colors.success}20` }]}>
          <Check size={24} color={colors.success} />
          <Text style={[styles.completedText, { color: colors.success }]}>
            Completed
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  completedCard: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    height: CARD_HEIGHT,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dragHandle: {
    paddingRight: 8,
    height: '100%',
    justifyContent: 'center',
    width: 30,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  exerciseMuscles: {
    fontSize: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  completeIconButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
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
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  content: {
    padding: 12,
    paddingTop: 0,
  },
  footer: {
    marginTop: 12,
  },
  completionActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 3,
    marginRight: 8,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  restButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
  },
  restButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  completedOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
    flexDirection: 'row',
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});