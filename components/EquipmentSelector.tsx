import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/constants/colors';
import { EquipmentType } from '@/types';
import { 
  Dumbbell, 
  User, 
  Box, 
  Barbell as BarIcon, 
  ArrowUp, 
  Armchair, 
  Circle, 
  Anchor, 
  Infinity, 
  Link, 
  Footprints, 
  ArrowDown, 
  MoveHorizontal,
  CircleDot,
  Activity
} from 'lucide-react-native';

type EquipmentSelectorProps = {
  selectedEquipment: EquipmentType | null;
  onSelectEquipment: (equipment: EquipmentType) => void;
  equipmentTypes: EquipmentType[];
};

export default function EquipmentSelector({
  selectedEquipment,
  onSelectEquipment,
  equipmentTypes,
}: EquipmentSelectorProps) {
  // Group equipment into categories
  const categories = {
    'Free Weights': ['Barbell', 'Dumbbell', 'Kettlebell'],
    'Machines': ['Cable Machine', 'Machine', 'Leg Extension Machine', 'Leg Curl Machine', 'Lat Pulldown Machine', 'Leg Press Machine'],
    'Bodyweight': ['Bodyweight', 'Pull-up Bar'],
    'Accessories': ['Bench', 'Stability Ball', 'Medicine Ball', 'TRX', 'Ab Wheel', 'Resistance Band', 'Rope Attachment'],
  };

  const getEquipmentIcon = (equipment: string) => {
    const iconColor = selectedEquipment === equipment ? '#FFFFFF' : colors.text;
    const iconSize = 24;
    
    switch (equipment) {
      case 'Barbell':
        return (
          <View style={{ position: 'relative', width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ 
              width: iconSize, 
              height: iconSize/6, 
              backgroundColor: iconColor,
              borderRadius: iconSize/12
            }} />
            <View style={{ 
              position: 'absolute', 
              left: 0, 
              width: iconSize/4, 
              height: iconSize/4, 
              backgroundColor: iconColor,
              borderRadius: iconSize/8
            }} />
            <View style={{ 
              position: 'absolute', 
              right: 0, 
              width: iconSize/4, 
              height: iconSize/4, 
              backgroundColor: iconColor,
              borderRadius: iconSize/8
            }} />
          </View>
        );
      case 'Dumbbell':
        return <Dumbbell size={iconSize} color={iconColor} />;
      case 'Kettlebell':
        return (
          <View style={{ position: 'relative', width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ 
              width: iconSize*0.7, 
              height: iconSize*0.7, 
              borderRadius: iconSize*0.35,
              backgroundColor: iconColor
            }} />
            <View style={{ 
              position: 'absolute', 
              top: 0, 
              width: iconSize/3, 
              height: iconSize/2, 
              borderWidth: 2, 
              borderColor: iconColor, 
              borderRadius: 3,
              borderBottomWidth: 0
            }} />
          </View>
        );
      case 'Cable Machine':
        return (
          <View style={{ position: 'relative', width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ 
              width: iconSize*0.6, 
              height: iconSize*0.8, 
              borderWidth: 2,
              borderColor: iconColor,
              borderRadius: 3
            }} />
            <View style={{ 
              position: 'absolute', 
              top: iconSize*0.2, 
              width: iconSize*0.8, 
              height: 2, 
              backgroundColor: iconColor
            }} />
            <View style={{ 
              position: 'absolute', 
              top: iconSize*0.4, 
              width: 2, 
              height: iconSize*0.6, 
              backgroundColor: iconColor
            }} />
          </View>
        );
      case 'Machine':
        return <Box size={iconSize} color={iconColor} />;
      case 'Bodyweight':
        return <User size={iconSize} color={iconColor} />;
      case 'Pull-up Bar':
        return <ArrowUp size={iconSize} color={iconColor} />;
      case 'Bench':
        return (
          <View style={{ position: 'relative', width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ 
              width: iconSize*0.8, 
              height: iconSize*0.4, 
              backgroundColor: iconColor,
              borderRadius: 3
            }} />
            <View style={{ 
              position: 'absolute', 
              bottom: 0, 
              left: iconSize*0.15, 
              width: 2, 
              height: iconSize*0.3, 
              backgroundColor: iconColor
            }} />
            <View style={{ 
              position: 'absolute', 
              bottom: 0, 
              right: iconSize*0.15, 
              width: 2, 
              height: iconSize*0.3, 
              backgroundColor: iconColor
            }} />
          </View>
        );
      case 'Stability Ball':
        return <Circle size={iconSize} color={iconColor} />;
      case 'Medicine Ball':
        return <Circle size={iconSize} color={iconColor} strokeWidth={2.5} />;
      case 'TRX':
        return <Anchor size={iconSize} color={iconColor} />;
      case 'Ab Wheel':
        return (
          <View style={{ position: 'relative', width: iconSize, height: iconSize, alignItems: 'center', justifyContent: 'center' }}>
            <CircleDot size={iconSize} color={iconColor} />
            <View style={{ 
              position: 'absolute', 
              left: iconSize*0.3, 
              width: iconSize*0.4, 
              height: 2, 
              backgroundColor: iconColor
            }} />
          </View>
        );
      case 'Resistance Band':
        return <Infinity size={iconSize} color={iconColor} />;
      case 'Rope Attachment':
        return <Link size={iconSize} color={iconColor} />;
      case 'Leg Extension Machine':
        return <Footprints size={iconSize} color={iconColor} />;
      case 'Leg Curl Machine':
        return <Footprints size={iconSize} color={iconColor} />;
      case 'Lat Pulldown Machine':
        return <ArrowDown size={iconSize} color={iconColor} />;
      case 'Leg Press Machine':
        return <MoveHorizontal size={iconSize} color={iconColor} />;
      default:
        return <Box size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Equipment</Text>
      
      {Object.entries(categories).map(([category, items]) => {
        const categoryEquipment = equipmentTypes.filter(e => items.includes(e));
        if (categoryEquipment.length === 0) return null;
        
        return (
          <View key={category} style={styles.categoryContainer}>
            <Text style={styles.categoryTitle}>{category}</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.equipmentContainer}
            >
              {categoryEquipment.map((equipment) => (
                <TouchableOpacity
                  key={equipment}
                  style={[
                    styles.equipmentButton,
                    selectedEquipment === equipment && styles.selectedEquipment,
                  ]}
                  onPress={() => onSelectEquipment(equipment)}
                >
                  {getEquipmentIcon(equipment)}
                  <Text
                    style={[
                      styles.equipmentText,
                      selectedEquipment === equipment && styles.selectedEquipmentText,
                    ]}
                  >
                    {equipment.replace('Machine', '').trim()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        );
      })}
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
  categoryContainer: {
    marginBottom: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
  },
  equipmentContainer: {
    paddingBottom: 8,
  },
  equipmentButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.card,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedEquipment: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  equipmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  selectedEquipmentText: {
    color: '#FFFFFF',
  },
});