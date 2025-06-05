import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { BodyRegion, MuscleGroup } from '@/types';

type MuscleGroupSelectorProps = {
  selectedBodyRegion: BodyRegion | null;
  selectedMuscleGroup: MuscleGroup | null;
  onSelectBodyRegion: (region: BodyRegion) => void;
  onSelectMuscleGroup: (group: MuscleGroup) => void;
  bodyRegions: BodyRegion[];
  muscleGroups: MuscleGroup[];
};

export default function MuscleGroupSelector({
  selectedBodyRegion,
  selectedMuscleGroup,
  onSelectBodyRegion,
  onSelectMuscleGroup,
  bodyRegions,
  muscleGroups,
}: MuscleGroupSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Body Region</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bodyRegionsContainer}
      >
        {bodyRegions.map((region) => (
          <TouchableOpacity
            key={region}
            style={[
              styles.bodyRegionButton,
              selectedBodyRegion === region && styles.selectedBodyRegion,
            ]}
            onPress={() => onSelectBodyRegion(region)}
          >
            <Text
              style={[
                styles.bodyRegionText,
                selectedBodyRegion === region && styles.selectedBodyRegionText,
              ]}
            >
              {region}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedBodyRegion && (
        <>
          <Text style={styles.sectionTitle}>Muscle Group</Text>
          <View style={styles.muscleGroupsContainer}>
            {muscleGroups.map((group) => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.muscleGroupButton,
                  selectedMuscleGroup === group && styles.selectedMuscleGroup,
                ]}
                onPress={() => onSelectMuscleGroup(group)}
              >
                <Text
                  style={[
                    styles.muscleGroupText,
                    selectedMuscleGroup === group && styles.selectedMuscleGroupText,
                  ]}
                >
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {selectedBodyRegion === 'Upper Body' && (
        <View style={styles.bodyMapContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
            style={styles.bodyMapImage}
            resizeMode="contain"
          />
          <View style={styles.bodyMapOverlay}>
            {/* Chest highlight */}
            {selectedMuscleGroup === 'Chest' && (
              <View style={[styles.muscleHighlight, styles.chestHighlight]} />
            )}
            {/* Back highlight */}
            {selectedMuscleGroup === 'Back' && (
              <View style={[styles.muscleHighlight, styles.backHighlight]} />
            )}
            {/* Shoulders highlight */}
            {selectedMuscleGroup === 'Shoulders' && (
              <View style={[styles.muscleHighlight, styles.shouldersHighlight]} />
            )}
            {/* Biceps highlight */}
            {selectedMuscleGroup === 'Biceps' && (
              <View style={[styles.muscleHighlight, styles.bicepsHighlight]} />
            )}
            {/* Triceps highlight */}
            {selectedMuscleGroup === 'Triceps' && (
              <View style={[styles.muscleHighlight, styles.tricepsHighlight]} />
            )}
          </View>
        </View>
      )}

      {selectedBodyRegion === 'Lower Body' && (
        <View style={styles.bodyMapContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1574680178050-55c6a6a96e0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
            style={styles.bodyMapImage}
            resizeMode="contain"
          />
          <View style={styles.bodyMapOverlay}>
            {/* Quads highlight */}
            {selectedMuscleGroup === 'Quadriceps' && (
              <View style={[styles.muscleHighlight, styles.quadsHighlight]} />
            )}
            {/* Hamstrings highlight */}
            {selectedMuscleGroup === 'Hamstrings' && (
              <View style={[styles.muscleHighlight, styles.hamstringsHighlight]} />
            )}
            {/* Glutes highlight */}
            {selectedMuscleGroup === 'Glutes' && (
              <View style={[styles.muscleHighlight, styles.glutesHighlight]} />
            )}
            {/* Calves highlight */}
            {selectedMuscleGroup === 'Calves' && (
              <View style={[styles.muscleHighlight, styles.calvesHighlight]} />
            )}
          </View>
        </View>
      )}

      {selectedBodyRegion === 'Core' && (
        <View style={styles.bodyMapContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' }}
            style={styles.bodyMapImage}
            resizeMode="contain"
          />
          <View style={styles.bodyMapOverlay}>
            {/* Abs highlight */}
            {selectedMuscleGroup === 'Abs' && (
              <View style={[styles.muscleHighlight, styles.absHighlight]} />
            )}
            {/* Obliques highlight */}
            {selectedMuscleGroup === 'Obliques' && (
              <View style={[styles.muscleHighlight, styles.obliquesHighlight]} />
            )}
            {/* Lower back highlight */}
            {selectedMuscleGroup === 'Lower Back' && (
              <View style={[styles.muscleHighlight, styles.lowerBackHighlight]} />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  bodyRegionsContainer: {
    paddingBottom: 8,
  },
  bodyRegionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedBodyRegion: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  bodyRegionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  selectedBodyRegionText: {
    color: '#FFFFFF',
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  muscleGroupButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedMuscleGroup: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  muscleGroupText: {
    fontSize: 14,
    color: colors.text,
  },
  selectedMuscleGroupText: {
    color: '#FFFFFF',
  },
  bodyMapContainer: {
    position: 'relative',
    height: 200,
    marginTop: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyMapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.7,
  },
  bodyMapOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muscleHighlight: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.7)',
    borderRadius: 8,
  },
  // Upper body highlights
  chestHighlight: {
    width: 100,
    height: 60,
    top: 60,
  },
  backHighlight: {
    width: 100,
    height: 80,
    top: 50,
  },
  shouldersHighlight: {
    width: 120,
    height: 30,
    top: 40,
  },
  bicepsHighlight: {
    width: 30,
    height: 50,
    top: 80,
    left: 50,
  },
  tricepsHighlight: {
    width: 30,
    height: 50,
    top: 80,
    right: 50,
  },
  // Lower body highlights
  quadsHighlight: {
    width: 80,
    height: 80,
    top: 60,
  },
  hamstringsHighlight: {
    width: 80,
    height: 60,
    top: 100,
  },
  glutesHighlight: {
    width: 80,
    height: 40,
    top: 40,
  },
  calvesHighlight: {
    width: 60,
    height: 50,
    top: 140,
  },
  // Core highlights
  absHighlight: {
    width: 60,
    height: 80,
    top: 60,
  },
  obliquesHighlight: {
    width: 80,
    height: 60,
    top: 70,
  },
  lowerBackHighlight: {
    width: 80,
    height: 40,
    top: 100,
  },
});