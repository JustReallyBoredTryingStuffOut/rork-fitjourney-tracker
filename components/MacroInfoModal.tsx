import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface MacroInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function MacroInfoModal({ visible, onClose }: MacroInfoModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>About Your Nutrition Goals</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollView}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>How are my goals calculated?</Text>
              <Text style={styles.paragraph}>
                Your nutrition goals are personalized estimates based on your profile information:
              </Text>
              <View style={styles.bulletList}>
                <Text style={styles.bulletItem}>• Your weight and height</Text>
                <Text style={styles.bulletItem}>• Your age and gender</Text>
                <Text style={styles.bulletItem}>• Your activity level (how active you are daily)</Text>
                <Text style={styles.bulletItem}>• Your fitness goals (lose weight, maintain, gain muscle)</Text>
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>The calculation process:</Text>
              <Text style={styles.paragraph}>
                We first calculate your Basal Metabolic Rate (BMR) - the calories your body needs at rest.
              </Text>
              <Text style={styles.paragraph}>
                Then we adjust for your activity level to find your Total Daily Energy Expenditure (TDEE).
              </Text>
              <Text style={styles.paragraph}>
                Finally, we adjust based on your fitness goals and calculate appropriate protein, carbs, and fat amounts.
              </Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Important disclaimer</Text>
              <Text style={styles.paragraph}>
                These calculations are estimates based on general formulas and may not be exact for your unique body.
              </Text>
              <Text style={styles.paragraph}>
                For personalized nutrition advice, please consult with a registered dietitian, nutritionist, or healthcare provider.
              </Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Adjusting your goals</Text>
              <Text style={styles.paragraph}>
                If you find these goals too challenging or not challenging enough, you can always adjust them in your profile settings.
              </Text>
              <Text style={styles.paragraph}>
                Listen to your body and adjust as needed - nutrition is personal and may require fine-tuning.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    maxHeight: '100%',
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  bulletList: {
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 8,
  },
  bulletItem: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.textSecondary,
  },
});