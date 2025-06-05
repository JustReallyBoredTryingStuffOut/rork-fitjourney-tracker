import React, { useState, useEffect } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  Pressable,
  ActivityIndicator,
  Platform
} from 'react-native';
import { X, Calendar, Target, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import Button from './Button';
import DateTimePicker from '@react-native-community/datetimepicker';

interface GoalPromptProps {
  visible: boolean;
  prompt: string;
  onClose: () => void;
  onSubmit: (goalText: string, timeframe: "weekly" | "monthly", targetDate?: string) => void;
  isLoading?: boolean;
  examples?: string[];
  timeframe: "weekly" | "monthly";
  onTimeframeChange: (timeframe: "weekly" | "monthly") => void;
}

const GoalPrompt: React.FC<GoalPromptProps> = ({ 
  visible, 
  prompt, 
  onClose, 
  onSubmit, 
  isLoading = false,
  examples = [],
  timeframe,
  onTimeframeChange
}) => {
  const { colors } = useTheme();
  const [goalText, setGoalText] = useState('');
  const [showExamples, setShowExamples] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [targetDate, setTargetDate] = useState<Date | undefined>(undefined);
  
  // Calculate default target date based on timeframe
  useEffect(() => {
    if (visible) {
      const now = new Date();
      let defaultDate = new Date();
      
      if (timeframe === "weekly") {
        // Set to next week
        defaultDate.setDate(now.getDate() + 7);
      } else {
        // Set to next month
        defaultDate.setMonth(now.getMonth() + 1);
      }
      
      setTargetDate(defaultDate);
    }
  }, [visible, timeframe]);
  
  // Reset state when modal is closed
  useEffect(() => {
    if (!visible) {
      setGoalText('');
      setShowExamples(false);
      setShowDatePicker(false);
    }
  }, [visible]);
  
  const handleSubmit = () => {
    if (goalText.trim()) {
      onSubmit(goalText, timeframe, targetDate?.toISOString());
    }
  };
  
  const handleSelectExample = (example: string) => {
    setGoalText(example);
    setShowExamples(false);
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Close the date picker on Android after selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    // Only update the date if a date was actually selected
    if (selectedDate) {
      setTargetDate(selectedDate);
    }
  };
  
  const toggleTimeframe = () => {
    onTimeframeChange(timeframe === "weekly" ? "monthly" : "weekly");
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return "Set Target Date";
    
    // Format date as "Month Day, Year" (e.g., "June 15, 2025")
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Function to open date picker
  const openDatePicker = () => {
    setShowDatePicker(true);
  };
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable 
        style={styles.overlay}
        onPress={onClose}
      >
        <Pressable 
          style={[styles.container, { backgroundColor: colors.card }]} 
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              {timeframe === "weekly" ? "Weekly Goal" : "Monthly Goal"}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.prompt, { color: colors.textSecondary }]}>{prompt}</Text>
          
          <View style={styles.timeframeSelector}>
            <TouchableOpacity 
              style={[
                styles.timeframeOption, 
                timeframe === "weekly" && { backgroundColor: colors.primary },
                { borderColor: colors.border }
              ]}
              onPress={() => onTimeframeChange("weekly")}
            >
              <Target size={16} color={timeframe === "weekly" ? "#FFFFFF" : colors.text} />
              <Text 
                style={[
                  styles.timeframeText, 
                  { color: timeframe === "weekly" ? "#FFFFFF" : colors.text }
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.timeframeOption, 
                timeframe === "monthly" && { backgroundColor: colors.primary },
                { borderColor: colors.border }
              ]}
              onPress={() => onTimeframeChange("monthly")}
            >
              <Calendar size={16} color={timeframe === "monthly" ? "#FFFFFF" : colors.text} />
              <Text 
                style={[
                  styles.timeframeText, 
                  { color: timeframe === "monthly" ? "#FFFFFF" : colors.text }
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input, 
                { 
                  backgroundColor: colors.background, 
                  color: colors.text,
                  borderColor: colors.border
                }
              ]}
              placeholder="Enter your fitness goal..."
              placeholderTextColor={colors.textLight}
              value={goalText}
              onChangeText={setGoalText}
              multiline
              autoFocus
            />
          </View>
          
          {/* Target Date Button - Made more prominent and clearly interactive */}
          <TouchableOpacity 
            style={[
              styles.targetDateButton, 
              { 
                backgroundColor: colors.background,
                borderColor: colors.primary,
                borderWidth: 1
              }
            ]}
            onPress={openDatePicker}
            activeOpacity={0.7}
          >
            <Calendar size={20} color={colors.primary} />
            <Text style={[styles.targetDateText, { color: colors.text }]}>
              {targetDate 
                ? `Target Date: ${formatDate(targetDate)}` 
                : "Set Target Date (Optional)"}
            </Text>
            <View style={styles.editIndicator}>
              <Text style={[styles.editText, { color: colors.primary }]}>Edit</Text>
            </View>
          </TouchableOpacity>
          
          {/* Date Picker */}
          {showDatePicker && (
            <View style={[styles.datePickerContainer, { backgroundColor: colors.background }]}>
              {Platform.OS === 'ios' && (
                <View style={styles.datePickerHeader}>
                  <Text style={[styles.datePickerTitle, { color: colors.text }]}>
                    Select Target Date
                  </Text>
                </View>
              )}
              
              <DateTimePicker
                value={targetDate || new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={styles.datePicker}
                testID="dateTimePicker"
              />
              
              {Platform.OS === 'ios' && (
                <View style={styles.datePickerActions}>
                  <TouchableOpacity 
                    style={[styles.datePickerCancel, { backgroundColor: colors.background }]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={[styles.datePickerButtonText, { color: colors.error }]}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.datePickerDone, { backgroundColor: colors.background }]}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={[styles.datePickerButtonText, { color: colors.primary }]}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
          
          <TouchableOpacity 
            style={styles.examplesHeader}
            onPress={() => setShowExamples(!showExamples)}
          >
            <Text style={[styles.examplesTitle, { color: colors.primary }]}>
              Need inspiration? View examples
            </Text>
            {showExamples ? (
              <ChevronUp size={20} color={colors.primary} />
            ) : (
              <ChevronDown size={20} color={colors.primary} />
            )}
          </TouchableOpacity>
          
          {showExamples && (
            <ScrollView style={styles.examplesList} contentContainerStyle={styles.examplesContent}>
              {examples.map((example, index) => (
                <TouchableOpacity 
                  key={index}
                  style={[styles.exampleItem, { backgroundColor: colors.background }]}
                  onPress={() => handleSelectExample(example)}
                >
                  <Text style={[styles.exampleText, { color: colors.text }]}>{example}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
          
          <View style={styles.footer}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
              style={styles.cancelButton}
            />
            <Button
              title={isLoading ? "Setting Goal..." : "Set Goal"}
              onPress={handleSubmit}
              disabled={!goalText.trim() || isLoading}
              style={styles.submitButton}
              icon={isLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : undefined}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  prompt: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 22,
  },
  timeframeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timeframeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  targetDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  targetDateText: {
    fontSize: 16,
    marginLeft: 8,
    flex: 1,
  },
  editIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  editText: {
    fontSize: 12,
    fontWeight: '500',
  },
  datePickerContainer: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  datePickerHeader: {
    padding: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  datePickerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePicker: {
    width: '100%',
    ...Platform.select({
      ios: {
        height: 200,
      },
    }),
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  datePickerCancel: {
    padding: 8,
    borderRadius: 8,
  },
  datePickerDone: {
    padding: 8,
    borderRadius: 8,
  },
  datePickerButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  examplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  examplesTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  examplesList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  examplesContent: {
    paddingBottom: 8,
  },
  exampleItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  exampleText: {
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  submitButton: {
    flex: 2,
  },
});

export default GoalPrompt;