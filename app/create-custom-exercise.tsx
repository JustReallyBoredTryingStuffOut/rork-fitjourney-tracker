import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useWorkoutStore } from '@/store/workoutStore';
import { Exercise, MuscleGroup, EquipmentType } from '@/types';
import Button from '@/components/Button';
import { colors } from '@/constants/colors';
import { Camera, Image as ImageIcon, X } from 'lucide-react-native';

// Simple Muscle Group Selector Component
const SimpleMuscleGroupSelector = ({ 
  selectedMuscleGroups, 
  onMuscleGroupsChange 
}: { 
  selectedMuscleGroups: MuscleGroup[];
  onMuscleGroupsChange: (groups: MuscleGroup[]) => void;
}) => {
  const { getMuscleGroups } = useWorkoutStore();
  const allMuscleGroups = getMuscleGroups();

  const toggleMuscleGroup = (muscleGroup: MuscleGroup) => {
    const isSelected = selectedMuscleGroups.some(mg => mg.name === muscleGroup.name);
    if (isSelected) {
      onMuscleGroupsChange(selectedMuscleGroups.filter(mg => mg.name !== muscleGroup.name));
    } else {
      onMuscleGroupsChange([...selectedMuscleGroups, muscleGroup]);
    }
  };

  return (
    <View style={styles.selectorContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {allMuscleGroups.map((muscleGroup) => {
          const isSelected = selectedMuscleGroups.some(mg => mg.name === muscleGroup.name);
          return (
            <TouchableOpacity
              key={muscleGroup.name}
              style={[
                styles.selectorButton,
                isSelected && styles.selectorButtonSelected,
              ]}
              onPress={() => toggleMuscleGroup(muscleGroup)}
            >
              <Text style={[
                styles.selectorButtonText,
                isSelected && styles.selectorButtonTextSelected,
              ]}>
                {muscleGroup.name.charAt(0).toUpperCase() + muscleGroup.name.slice(1).replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Simple Equipment Selector Component
const SimpleEquipmentSelector = ({ 
  selectedEquipment, 
  onEquipmentChange 
}: { 
  selectedEquipment: EquipmentType[];
  onEquipmentChange: (equipment: EquipmentType[]) => void;
}) => {
  const { getEquipmentTypes } = useWorkoutStore();
  const allEquipment = getEquipmentTypes();

  const toggleEquipment = (equipment: EquipmentType) => {
    const isSelected = selectedEquipment.some(eq => eq.name === equipment.name);
    if (isSelected) {
      onEquipmentChange(selectedEquipment.filter(eq => eq.name !== equipment.name));
    } else {
      onEquipmentChange([...selectedEquipment, equipment]);
    }
  };

  return (
    <View style={styles.selectorContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {allEquipment.map((equipment) => {
          const isSelected = selectedEquipment.some(eq => eq.name === equipment.name);
          return (
            <TouchableOpacity
              key={equipment.name}
              style={[
                styles.selectorButton,
                isSelected && styles.selectorButtonSelected,
              ]}
              onPress={() => toggleEquipment(equipment)}
            >
              <Text style={[
                styles.selectorButtonText,
                isSelected && styles.selectorButtonTextSelected,
              ]}>
                {equipment.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default function CreateCustomExercise() {
  const { addExercise } = useWorkoutStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState<MuscleGroup[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentType[]>([]);
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [tips, setTips] = useState('');
  const [exerciseImage, setExerciseImage] = useState<string | null>(null);

  const pickImage = async (source: 'camera' | 'library') => {
    try {
      let result;
      
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Camera permission is required to take photos.');
          return;
        }
        
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission needed', 'Photo library permission is required to select images.');
          return;
        }
        
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setExerciseImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  const removeImage = () => {
    setExerciseImage(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter an exercise name');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (selectedMuscleGroups.length === 0) {
      Alert.alert('Error', 'Please select at least one muscle group');
      return;
    }

    if (selectedEquipment.length === 0) {
      Alert.alert('Error', 'Please select at least one equipment type');
      return;
    }

    const instructionsArray = instructions
      .split('\n')
      .map(instruction => instruction.trim())
      .filter(instruction => instruction.length > 0);

    if (instructionsArray.length === 0) {
      Alert.alert('Error', 'Please enter at least one instruction');
      return;
    }

    const tipsArray = tips
      .split('\n')
      .map(tip => tip.trim())
      .filter(tip => tip.length > 0);

    const newExercise: Exercise = {
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      description: description.trim(),
      instructions: instructionsArray,
      muscleGroups: selectedMuscleGroups,
      equipment: selectedEquipment,
      difficulty,
      tips: tipsArray.length > 0 ? tipsArray : undefined,
      isCustom: true,
      imageUrl: exerciseImage || undefined,
    };

    addExercise(newExercise);
    
    Alert.alert(
      'Success!',
      'Your custom exercise has been created and saved. You can now use it in your workouts.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const handleCancel = () => {
    if (name.trim() || description.trim() || instructions.trim() || exerciseImage) {
      Alert.alert(
        'Discard Changes?',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Create Custom Exercise</Text>
          <Text style={styles.subtitle}>
            Create your own exercise and save it for future use
          </Text>
        </View>

        <View style={styles.form}>
          {/* Exercise Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Exercise Name *</Text>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Custom Push-up Variation"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Exercise Photo */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Exercise Photo (Optional)</Text>
            <Text style={styles.helperText}>
              Add a photo of the equipment, machine, or exercise setup to help you remember the proper form and setup. This is especially useful for custom equipment or machines not listed in our database.
            </Text>
            
            {exerciseImage ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: exerciseImage }} style={styles.exerciseImage} />
                <TouchableOpacity style={styles.removeImageButton} onPress={removeImage}>
                  <X size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.photoButtonsContainer}>
                <TouchableOpacity 
                  style={styles.photoButton} 
                  onPress={() => pickImage('camera')}
                >
                  <Camera size={24} color={colors.primary} />
                  <Text style={styles.photoButtonText}>Take Photo</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.photoButton} 
                  onPress={() => pickImage('library')}
                >
                  <ImageIcon size={24} color={colors.primary} />
                  <Text style={styles.photoButtonText}>Choose from Library</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what this exercise targets and how it's performed..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Instructions */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Instructions *</Text>
            <Text style={styles.helperText}>
              Enter each instruction on a new line
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={instructions}
              onChangeText={setInstructions}
              placeholder="1. Start in a standing position&#10;2. Bend your knees slightly&#10;3. Perform the movement..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={6}
            />
          </View>

          {/* Muscle Groups */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Target Muscle Groups *</Text>
            <SimpleMuscleGroupSelector
              selectedMuscleGroups={selectedMuscleGroups}
              onMuscleGroupsChange={setSelectedMuscleGroups}
            />
          </View>

          {/* Equipment */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Required Equipment *</Text>
            <SimpleEquipmentSelector
              selectedEquipment={selectedEquipment}
              onEquipmentChange={setSelectedEquipment}
            />
          </View>

          {/* Difficulty */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Difficulty Level *</Text>
            <View style={styles.difficultyContainer}>
              {(['beginner', 'intermediate', 'advanced'] as const).map((level) => {
                const isActive = difficulty === level;
                
                return (
                  <Button
                    key={level}
                    title={level.charAt(0).toUpperCase() + level.slice(1)}
                    onPress={() => setDifficulty(level)}
                    style={StyleSheet.flatten([
                      styles.difficultyButton,
                      isActive && styles.difficultyButtonActive,
                    ])}
                    textStyle={StyleSheet.flatten([
                      styles.difficultyButtonText,
                      isActive && styles.difficultyButtonTextActive,
                    ])}
                  />
                );
              })}
            </View>
          </View>

          {/* Tips */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tips (Optional)</Text>
            <Text style={styles.helperText}>
              Enter each tip on a new line
            </Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={tips}
              onChangeText={setTips}
              placeholder="Keep your core engaged&#10;Maintain proper form&#10;Breathe steadily..."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={handleCancel}
            style={styles.cancelButton}
            textStyle={styles.cancelButtonText}
          />
          <Button
            title="Save Exercise"
            onPress={handleSave}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.card,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  selectorContainer: {
    marginTop: 8,
  },
  selectorButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    marginRight: 8,
  },
  selectorButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  selectorButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  selectorButtonTextSelected: {
    color: colors.white,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  difficultyButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  difficultyButtonText: {
    color: colors.text,
  },
  difficultyButtonTextActive: {
    color: colors.white,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    paddingTop: 0,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.text,
  },
  saveButton: {
    flex: 2,
    backgroundColor: colors.primary,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  exerciseImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 8,
  },
  removeImageButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
    marginLeft: 8,
  },
}); 