import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Pressable
} from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface MacroInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function MacroInfoModal({ visible, onClose }: MacroInfoModalProps) {
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
          style={styles.container} 
          onPress={e => e.stopPropagation()}
        >
          <View style={styles.header}>
            <Text style={styles.title}>About Your Nutrition Goals</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <Text style={styles.sectionTitle}>How We Calculate Your Macros</Text>
            <Text style={styles.paragraph}>
              We estimate your daily nutrition needs based on:
            </Text>
            
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• Your weight and height</Text>
              <Text style={styles.bulletPoint}>• Your age and gender</Text>
              <Text style={styles.bulletPoint}>• How active you are daily</Text>
              <Text style={styles.bulletPoint}>• Your fitness goals (lose weight, maintain, or gain muscle)</Text>
            </View>
            
            <Text style={styles.paragraph}>
              We use a standard formula to estimate how many calories your body needs, then adjust this based on your activity and goals.
            </Text>
            
            <Text style={styles.sectionTitle}>What Your Macros Mean</Text>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.macroProtein }]} />
              <View style={styles.macroTextContainer}>
                <Text style={styles.macroTitle}>Protein</Text>
                <Text style={styles.macroDescription}>
                  Helps build and repair muscles. Important if you exercise regularly.
                </Text>
              </View>
            </View>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.macroCarbs }]} />
              <View style={styles.macroTextContainer}>
                <Text style={styles.macroTitle}>Carbohydrates</Text>
                <Text style={styles.macroDescription}>
                  Your body's main energy source. Fuels your workouts and daily activities.
                </Text>
              </View>
            </View>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.macroFat }]} />
              <View style={styles.macroTextContainer}>
                <Text style={styles.macroTitle}>Fat</Text>
                <Text style={styles.macroDescription}>
                  Essential for hormone health and absorbing vitamins. Provides long-lasting energy.
                </Text>
              </View>
            </View>
            
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerTitle}>Important Note</Text>
              <Text style={styles.disclaimerText}>
                These are just estimates. Everyone's body is different. For personalized nutrition advice, please consult with a registered dietitian or healthcare provider.
              </Text>
            </View>
            
            <Text style={styles.paragraph}>
              You can adjust your goals in the Health Goals section if you have specific targets recommended by a healthcare professional.
            </Text>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

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
    maxHeight: '80%',
    backgroundColor: colors.card,
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
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  bulletPoints: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  bulletPoint: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
  },
  macroExplanation: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  macroIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    marginTop: 4,
  },
  macroTextContainer: {
    flex: 1,
  },
  macroTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  macroDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: colors.highlight,
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
  },
  disclaimerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});