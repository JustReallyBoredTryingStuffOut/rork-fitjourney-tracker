import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { BODY_REGIONS } from '@/constants/bodyRegions';

interface RegionMuscleSelectorProps {
  selectedRegion: string | null;
  selectedMuscle: string | null;
  onSelectMuscle: (muscleKey: string) => void;
}

export default function RegionMuscleSelector({ 
  selectedRegion, 
  selectedMuscle, 
  onSelectMuscle 
}: RegionMuscleSelectorProps) {
  const { colors } = useTheme();

  // Find the selected region's muscles
  const selectedRegionData = BODY_REGIONS.find(region => region.key === selectedRegion);
  const muscles = selectedRegionData?.muscles || [];

  if (!selectedRegion) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        Muscles
      </Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {muscles.map((muscle) => (
          <TouchableOpacity
            key={muscle.key}
            style={[
              styles.muscleButton,
              { 
                backgroundColor: selectedMuscle === muscle.key ? colors.primary : colors.card,
                borderColor: colors.border
              }
            ]}
            onPress={() => onSelectMuscle(muscle.key)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.muscleText,
              { 
                color: selectedMuscle === muscle.key ? '#FFFFFF' : colors.text 
              }
            ]}>
              {muscle.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  scrollContainer: {
    paddingHorizontal: 4,
  },
  muscleButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 10,
    borderWidth: 1,
    minWidth: 80,
    alignItems: 'center',
  },
  muscleText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 