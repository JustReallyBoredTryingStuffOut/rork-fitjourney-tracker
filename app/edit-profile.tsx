import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, TouchableOpacity, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { ArrowLeft, Calendar } from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useMacroStore } from "@/store/macroStore";
import { UserProfile } from "@/types";
import Button from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function EditProfileScreen() {
  const router = useRouter();
  const { userProfile, updateUserProfile } = useMacroStore();
  
  const [name, setName] = useState(userProfile.name);
  const [weight, setWeight] = useState(userProfile.weight.toString());
  const [height, setHeight] = useState(userProfile.height.toString());
  const [age, setAge] = useState(userProfile.age.toString());
  const [gender, setGender] = useState(userProfile.gender || "male");
  const [fitnessGoal, setFitnessGoal] = useState(userProfile.fitnessGoal);
  const [activityLevel, setActivityLevel] = useState(userProfile.activityLevel);
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(
    userProfile.dateOfBirth ? new Date(userProfile.dateOfBirth) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const handleSave = () => {
    const updatedProfile: UserProfile = {
      name,
      weight: parseFloat(weight) || userProfile.weight,
      height: parseFloat(height) || userProfile.height,
      age: parseInt(age) || userProfile.age,
      gender,
      fitnessGoal,
      activityLevel,
      dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
    };
    
    updateUserProfile(updatedProfile);
    Alert.alert("Success", "Profile updated successfully");
    router.back();
  };
  
  const handleGoBack = () => {
    router.navigate("/(tabs)");
  };
  
  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      
      // Calculate age from date of birth
      if (selectedDate) {
        const today = new Date();
        let calculatedAge = today.getFullYear() - selectedDate.getFullYear();
        const m = today.getMonth() - selectedDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < selectedDate.getDate())) {
          calculatedAge--;
        }
        setAge(calculatedAge.toString());
      }
    }
  };
  
  const formatDate = (date: Date | null) => {
    if (!date) return "Select Date of Birth";
    return date.toLocaleDateString();
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Stack.Screen 
        options={{
          title: "Edit Profile",
          headerBackTitle: "Profile",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      <View style={styles.header}>
        <Text style={styles.title}>Edit Your Profile</Text>
        <Text style={styles.subtitle}>Update your personal information</Text>
      </View>
      
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your name"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            placeholder="Your weight in kg"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
            placeholder="Your height in cm"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity 
            style={styles.datePickerButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.datePickerText}>
              {formatDate(dateOfBirth)}
            </Text>
            <Calendar size={20} color={colors.primary} />
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth || new Date(1990, 0, 1)}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            placeholder="Your age"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Male" value="male" />
              <Picker.Item label="Female" value="female" />
              <Picker.Item label="Other" value="other" />
              <Picker.Item label="Prefer not to say" value="prefer-not-to-say" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Fitness Goal</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fitnessGoal}
              onValueChange={(itemValue) => setFitnessGoal(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Lose Weight" value="lose" />
              <Picker.Item label="Maintain Weight" value="maintain" />
              <Picker.Item label="Gain Muscle" value="gain" />
            </Picker>
          </View>
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Activity Level</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={activityLevel}
              onValueChange={(itemValue) => setActivityLevel(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Sedentary (little or no exercise)" value="sedentary" />
              <Picker.Item label="Lightly active (light exercise 1-3 days/week)" value="light" />
              <Picker.Item label="Moderately active (moderate exercise 3-5 days/week)" value="moderate" />
              <Picker.Item label="Very active (hard exercise 6-7 days/week)" value="active" />
              <Picker.Item label="Extra active (very hard exercise & physical job)" value="very_active" />
            </Picker>
          </View>
        </View>
      </View>
      
      <Button
        title="Save Profile"
        onPress={handleSave}
        style={styles.saveButton}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  saveButton: {
    marginTop: 8,
  },
  backButton: {
    padding: 8,
  },
  datePickerButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  datePickerText: {
    fontSize: 16,
    color: colors.text,
  },
});