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
import { ChevronDown, ChevronUp, Check, Clock, GripVertical } from 'lucide-react-native';
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
const DRAG_THRESHOLD = 40; // Distance needed to trigger a reorder
const VIBRATION_COOLDOWN = 500; // milliseconds between vibrations

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
  const [dropZoneIndex, setDropZoneIndex] = useState<number | null>(null);
  const pan = useRef(new Animated.ValueXY()).current;
  const cardRef = useRef<View>(null);
  const cardPositionY = useRef(0);
  const initialTouchY = useRef(0);
  const lastReportedDropZone = useRef<number | null>(null);
  const lastVibrationTime = useRef(0);
  
  // Get screen dimensions
  const screenHeight = Dimensions.get('window').height;
  
  // Calculate possible drop positions
  const getDropIndex = (gestureY: number) => {
    // Calculate the relative position from the card's original position
    const relativeY = gestureY - initialTouchY.current;
    
    // Calculate how many positions to move based on the distance moved
    // and the height of each card
    const positions = Math.round(relativeY / CARD_HEIGHT);
    
    // Calculate new index
    let newIndex = index + positions;
    
    // Ensure the new index is within bounds
    newIndex = Math.max(0, Math.min(totalExercises - 1, newIndex));
    
    return newIndex !== index ? newIndex : null;
  };
  
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only respond to vertical movements that are significant
        return Math.abs(gestureState.dy) > 5 && Math.abs(gestureState.dx) < Math.abs(gestureState.dy);
      },
      onPanResponderGrant: (_, gestureState) => {
        // Store the initial touch position
        initialTouchY.current = gestureState.y0;
        
        // Measure the card's position on the screen
        cardRef.current?.measure((x, y, width, height, pageX, pageY) => {
          cardPositionY.current = pageY;
        });
        
        // Start dragging
        setIsDragging(true);
        onDragStart();
        
        // Provide haptic feedback when drag starts
        if (Platform.OS !== 'web') {
          const now = Date.now();
          if (now - lastVibrationTime.current > VIBRATION_COOLDOWN) {
            Vibration.vibrate(50);
            lastVibrationTime.current = now;
          }
        }
        
        // Reset the last reported drop zone
        lastReportedDropZone.current = null;
        
        // Store the initial position
        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: (_, gestureState) => {
        // Update the animated value
        Animated.event(
          [null, { dy: pan.y }],
          { useNativeDriver: false }
        )(_, gestureState);
        
        // Calculate potential drop index
        const potentialDropIndex = getDropIndex(gestureState.moveY);
        
        // Only update and provide feedback if the drop zone has changed
        if (potentialDropIndex !== lastReportedDropZone.current) {
          setDropZoneIndex(potentialDropIndex);
          lastReportedDropZone.current = potentialDropIndex;
          
          // Provide light haptic feedback when crossing threshold to a new position
          // But limit the frequency of vibrations to prevent excessive feedback
          const now = Date.now();
          if (potentialDropIndex !== null && Platform.OS !== 'web' && now - lastVibrationTime.current > VIBRATION_COOLDOWN) {
            Vibration.vibrate(20);
            lastVibrationTime.current = now;
          }
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // Reset the pan offset
        pan.flattenOffset();
        
        // Calculate the final drop index
        const finalDropIndex = getDropIndex(gestureState.moveY);
        
        // Reset the position with animation
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5
        }).start(() => {
          setIsDragging(false);
          setDropZoneIndex(null);
          
          // Only call onDragEnd if we have a valid drop index
          if (finalDropIndex !== null) {
            onDragEnd(finalDropIndex);
            
            // Provide haptic feedback when drop completes
            if (Platform.OS !== 'web') {
              const now = Date.now();
              if (now - lastVibrationTime.current > VIBRATION_COOLDOWN) {
                Vibration.vibrate(100);
                lastVibrationTime.current = now;
              }
            }
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
      ref={cardRef}
      style={[
        styles.container, 
        { backgroundColor: colors.card },
        cardStyle
      ]}
    >
      {/* Drag handle - positioned at the top when expanded */}
      <View 
        style={[
          styles.dragHandleContainer,
          isExpanded && styles.dragHandleContainerExpanded
        ]}
        {...panResponder.panHandlers}
      >
        <GripVertical size={20} color={colors.textSecondary} />
      </View>
      
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
          <Text style={[styles.dragIndicatorText, { color: colors.primary }]}>
            Dragging...
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
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingLeft: 48, // Make room for the drag handle on the left
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
  dragHandleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 48,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dragHandleContainerExpanded: {
    height: 48, // Fixed height at the top when expanded
    bottom: 'auto', // Remove bottom positioning
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  dragIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    paddingVertical: 2,
    alignItems: 'center',
  },
  dragIndicatorText: {
    fontSize: 12,
    fontWeight: '500',
  },
});