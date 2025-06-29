import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { BodyRegion, MuscleGroup } from '@/types';
import { BODY_REGIONS } from '@/constants/bodyRegions';

type MuscleGroupSelectorProps = {
  selectedBodyRegion: BodyRegion | null;
  selectedMuscleGroup: MuscleGroup | null;
  onSelectBodyRegion: (region: BodyRegion) => void;
  onSelectMuscleGroup: (group: MuscleGroup) => void;
  bodyRegions: BodyRegion[];
  muscleGroups: MuscleGroup[];
  viewMode: 'front' | 'back';
  toggleViewMode: () => void;
};

export default function MuscleGroupSelector({
  selectedBodyRegion,
  selectedMuscleGroup,
  onSelectBodyRegion,
  onSelectMuscleGroup,
  bodyRegions,
  muscleGroups,
  viewMode,
  toggleViewMode
}: MuscleGroupSelectorProps) {
  const { colors } = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const imageHeight = 280;

  // Set default body region to upper body when component mounts
  useEffect(() => {
    if (!selectedBodyRegion && bodyRegions.length > 0) {
      const upperBody = bodyRegions.find(region => region.name === 'upper_body');
      if (upperBody) {
        onSelectBodyRegion(upperBody);
      }
    }
  }, []);

  // Format region name for display (remove underscores and capitalize)
  const formatRegionName = (name: string) => {
    return name.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Get the appropriate body map image based on region and view
  const getBodyMapImage = () => {
    if (selectedBodyRegion?.name === 'upper_body') {
      return viewMode === 'front' 
        ? require('@/assets/images/body-regions/Upper-body.png')
        : require('@/assets/images/body-regions/back.png');
    } else if (selectedBodyRegion?.name === 'lower_body') {
      return viewMode === 'front'
        ? require('@/assets/images/body-regions/lower-body.png')
        : require('@/assets/images/body-regions/lower-body-back.png');
    } else if (selectedBodyRegion?.name === 'core') {
      return require('@/assets/images/body-regions/core.png');
    }
    return require('@/assets/images/body-regions/Upper-body.png'); // Default to upper body front
  };

  // Define clickable areas for each muscle group based on body region and view
  const getMuscleGroupAreas = () => {
    if (selectedBodyRegion?.name === 'upper_body') {
      if (viewMode === 'front') {
        return [
          { group: muscleGroups.find(g => g.name === 'chest'), style: styles.chestFront },
          { group: muscleGroups.find(g => g.name === 'shoulders'), style: styles.leftShoulderFront },
          { group: muscleGroups.find(g => g.name === 'shoulders'), style: styles.rightShoulderFront },
          { group: muscleGroups.find(g => g.name === 'biceps'), style: styles.bicepsFront },
          { group: muscleGroups.find(g => g.name === 'forearms'), style: styles.forearmsFront },
          { group: muscleGroups.find(g => g.name === 'traps'), style: styles.trapsFront },
        ];
      } else {
        return [
          { group: muscleGroups.find(g => g.name === 'back'), style: styles.backArea },
          { group: muscleGroups.find(g => g.name === 'traps'), style: styles.trapsBack },
          { group: muscleGroups.find(g => g.name === 'triceps'), style: styles.tricepsBack },
          { group: muscleGroups.find(g => g.name === 'lats'), style: styles.latsBack },
          { group: muscleGroups.find(g => g.name === 'deltoids'), style: styles.rearDeltoids },
        ];
      }
    } else if (selectedBodyRegion?.name === 'lower_body') {
      if (viewMode === 'front') {
        return [
          { group: muscleGroups.find(g => g.name === 'quadriceps'), style: styles.quadsFront },
          { group: muscleGroups.find(g => g.name === 'calves'), style: styles.calvesFront },
          { group: muscleGroups.find(g => g.name === 'hip_flexors'), style: styles.hipFlexors },
        ];
      } else {
        return [
          { group: muscleGroups.find(g => g.name === 'hamstrings'), style: styles.hamstringsBack },
          { group: muscleGroups.find(g => g.name === 'glutes'), style: styles.glutesBack },
          { group: muscleGroups.find(g => g.name === 'calves'), style: styles.calvesBack },
        ];
      }
    } else if (selectedBodyRegion?.name === 'core') {
      if (viewMode === 'front') {
        return [
          { group: muscleGroups.find(g => g.name === 'abs'), style: styles.absFront },
          { group: muscleGroups.find(g => g.name === 'obliques'), style: styles.obliquesFront },
        ];
      } else {
        return [
          { group: muscleGroups.find(g => g.name === 'lower_back'), style: styles.lowerBack },
          { group: muscleGroups.find(g => g.name === 'obliques'), style: styles.obliquesBack },
        ];
      }
    }
    return [];
  };

  // Find the selected region's muscles
  const selectedRegionData = BODY_REGIONS.find(region => region.key === selectedBodyRegion?.name);
  const muscles = selectedRegionData?.muscles || [];

  if (!selectedBodyRegion) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>Body Region</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bodyRegionsContainer}
      >
        {bodyRegions.map((region) => (
          <TouchableOpacity
            key={region.name}
            style={[
              styles.bodyRegionButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedBodyRegion?.name === region.name && [styles.selectedBodyRegion, { backgroundColor: colors.primary, borderColor: colors.primary }],
            ]}
            onPress={() => onSelectBodyRegion(region)}
          >
            <Text
              style={[
                styles.bodyRegionText,
                { color: colors.text },
                selectedBodyRegion?.name === region.name && styles.selectedBodyRegionText,
              ]}
            >
              {formatRegionName(region.name)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedBodyRegion && (
        <>
          <View style={styles.viewToggleContainer}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 8 }]}>
              {formatRegionName(selectedBodyRegion.name)} View
            </Text>
            <TouchableOpacity 
              style={[styles.viewToggleButton, { backgroundColor: colors.primary }]} 
              onPress={toggleViewMode}
            >
              <Text style={styles.viewToggleText}>
                {viewMode === 'front' ? 'Switch to Back View' : 'Switch to Front View'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bodyMapContainer}>
            <Image
              source={getBodyMapImage()}
              style={[styles.bodyMapImage, { width: screenWidth - 32, height: imageHeight }]}
              resizeMode="contain"
            />
            
            <View style={[styles.bodyMapOverlay, { width: screenWidth - 32, height: imageHeight }]}>
              {getMuscleGroupAreas().map((area) => (
                area.group && (
                  <TouchableOpacity
                    key={area.group.name}
                    style={[
                      area.style,
                      selectedMuscleGroup?.name === area.group.name && styles.selectedMuscleArea
                    ]}
                    onPress={() => area.group && onSelectMuscleGroup(area.group)}
                  />
                )
              ))}
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 16 }]}>Muscle Groups</Text>
          <View style={styles.muscleGroupsContainer}>
            {muscles.map((muscle) => (
              <TouchableOpacity
                key={muscle.key}
                style={[
                  styles.muscleGroupButton,
                  { 
                    backgroundColor: selectedMuscleGroup?.name === muscle.key ? colors.primary : colors.card,
                    borderColor: colors.border
                  }
                ]}
                onPress={() => onSelectMuscleGroup({
                  ...muscle,
                  bodyRegion: selectedBodyRegion
                })}
              >
                <Text
                  style={[
                    styles.muscleGroupText,
                    { 
                      color: selectedMuscleGroup?.name === muscle.key ? '#FFFFFF' : colors.text 
                    }
                  ]}
                >
                  {muscle.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </>
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
    marginBottom: 12,
  },
  bodyRegionsContainer: {
    paddingBottom: 8,
  },
  bodyRegionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
  },
  selectedBodyRegion: {
  },
  bodyRegionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedBodyRegionText: {
    color: '#FFFFFF',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  viewToggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  viewToggleText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  bodyMapContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  bodyMapImage: {
    borderRadius: 8,
  },
  bodyMapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  clickableArea: {
    backgroundColor: 'transparent',
  },
  selectedMuscleArea: {
    backgroundColor: 'rgba(255, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.8)',
  },
  muscleGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  muscleGroupButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedMuscleGroup: {
    backgroundColor: '#007AFF',
  },
  muscleGroupText: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  selectedMuscleGroupText: {
    color: '#FFFFFF',
  },
  // Upper body front view muscle areas
  chestFront: {
    position: 'absolute',
    top: '20%',
    left: '46.5%',
    width: '7%',
    height: '19%',
    borderTopLeftRadius: 40,  // Increased radius for upper left slope
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  leftShoulderFront: {
    position: 'absolute',
    top: '22%',
    left: '44%',
    width: '4%',
    height: '12%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    transform: [{ rotate: '105deg' }],
  },
  rightShoulderFront: {
    position: 'absolute',
    top: '22%',
    left: '53%',
    width: '5%',
    height: '12%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  bicepsFront: {
    position: 'absolute',
    top: '35%',
    left: '20%',
    width: '12%',
    height: '15%',
    borderRadius: 15,
  },
  forearmsFront: {
    position: 'absolute',
    top: '50%',
    left: '20%',
    width: '12%',
    height: '15%',
    borderRadius: 15,
  },
  trapsFront: {
    position: 'absolute',
    top: '18%',
    left: '40%',
    width: '20%',
    height: '8%',
    borderRadius: 15,
  },
  
  // Upper body back view muscle areas
  backArea: {
    position: 'absolute',
    top: '25%',
    left: '40%',
    width: '20%',
    height: '25%',
    borderRadius: 15,
  },
  trapsBack: {
    position: 'absolute',
    top: '18%',
    left: '40%',
    width: '20%',
    height: '8%',
    borderRadius: 15,
  },
  tricepsBack: {
    position: 'absolute',
    top: '35%',
    left: '75%',
    width: '12%',
    height: '15%',
    borderRadius: 15,
  },
  latsBack: {
    position: 'absolute',
    top: '25%',
    left: '30%',
    width: '15%',
    height: '20%',
    borderRadius: 15,
  },
  rearDeltoids: {
    position: 'absolute',
    top: '22%',
    left: '65%',
    width: '15%',
    height: '8%',
    borderRadius: 15,
  },
  
  // Lower body front view muscle areas
  quadsFront: {
    position: 'absolute',
    top: '60%',
    left: '40%',
    width: '20%',
    height: '20%',
    borderRadius: 15,
  },
  calvesFront: {
    position: 'absolute',
    top: '85%',
    left: '40%',
    width: '20%',
    height: '12%',
    borderRadius: 15,
  },
  hipFlexors: {
    position: 'absolute',
    top: '55%',
    left: '40%',
    width: '20%',
    height: '8%',
    borderRadius: 15,
  },
  
  // Lower body back view muscle areas
  hamstringsBack: {
    position: 'absolute',
    top: '60%',
    left: '40%',
    width: '20%',
    height: '20%',
    borderRadius: 15,
  },
  glutesBack: {
    position: 'absolute',
    top: '50%',
    left: '40%',
    width: '20%',
    height: '12%',
    borderRadius: 15,
  },
  calvesBack: {
    position: 'absolute',
    top: '85%',
    left: '40%',
    width: '20%',
    height: '12%',
    borderRadius: 15,
  },
  
  // Core muscle areas
  absFront: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    width: '20%',
    height: '12%',
    borderRadius: 15,
  },
  obliquesFront: {
    position: 'absolute',
    top: '40%',
    left: '25%',
    width: '8%',
    height: '12%',
    borderRadius: 15,
  },
  lowerBack: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    width: '20%',
    height: '12%',
    borderRadius: 15,
  },
  obliquesBack: {
    position: 'absolute',
    top: '40%',
    left: '72%',
    width: '8%',
    height: '12%',
    borderRadius: 15,
  },
});