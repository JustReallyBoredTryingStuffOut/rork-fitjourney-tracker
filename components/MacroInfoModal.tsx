import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { X } from "lucide-react-native";
import { colors } from "@/constants/colors";

interface MacroInfoModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function MacroInfoModal({ visible, onClose }: MacroInfoModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>About Your Nutrition Goals</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.sectionTitle}>How Your Macros Are Calculated</Text>
            <Text style={styles.paragraph}>
              Your daily calorie and macro targets are personalized estimates based on your profile information:
            </Text>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>• Weight & Height:</Text>
              <Text style={styles.infoText}>Used to calculate your basal metabolic rate (BMR)</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>• Age:</Text>
              <Text style={styles.infoText}>Affects your metabolism and calorie needs</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>• Activity Level:</Text>
              <Text style={styles.infoText}>Determines how many additional calories you need</Text>
            </View>
            
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>• Fitness Goal:</Text>
              <Text style={styles.infoText}>Adjusts calories up or down based on whether you want to lose, maintain, or gain</Text>
            </View>
            
            <Text style={styles.sectionTitle}>Understanding Your Macros</Text>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.calorieColor }]} />
              <View style={styles.macroInfo}>
                <Text style={styles.macroTitle}>Calories</Text>
                <Text style={styles.macroDescription}>
                  The total energy your body needs daily. This is the foundation of your nutrition plan.
                </Text>
              </View>
            </View>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.macroProtein }]} />
              <View style={styles.macroInfo}>
                <Text style={styles.macroTitle}>Protein (4 calories/gram)</Text>
                <Text style={styles.macroDescription}>
                  Essential for muscle repair and growth. We recommend 1.6-2.2g per kg of body weight for active individuals. Each gram of protein provides 4 calories of energy.
                </Text>
              </View>
            </View>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.macroCarbs }]} />
              <View style={styles.macroInfo}>
                <Text style={styles.macroTitle}>Carbs (4 calories/gram)</Text>
                <Text style={styles.macroDescription}>
                  Your body's primary energy source, especially important for high-intensity activities. Like protein, each gram of carbohydrates provides 4 calories of energy.
                </Text>
              </View>
            </View>
            
            <View style={styles.macroExplanation}>
              <View style={[styles.macroIndicator, { backgroundColor: colors.macroFat }]} />
              <View style={styles.macroInfo}>
                <Text style={styles.macroTitle}>Fat (9 calories/gram)</Text>
                <Text style={styles.macroDescription}>
                  Essential for hormone production and vitamin absorption. Healthy fats are an important part of your diet. Fat is more energy-dense, providing 9 calories per gram.
                </Text>
              </View>
            </View>
            
            <View style={styles.disclaimer}>
              <Text style={styles.disclaimerTitle}>Important Note</Text>
              <Text style={styles.disclaimerText}>
                These calculations provide general guidelines only. For personalized nutrition advice, please consult with a registered dietitian or healthcare provider.
              </Text>
              <Text style={styles.disclaimerText}>
                Your actual needs may vary based on individual factors like metabolism, medical conditions, and specific training goals.
              </Text>
            </View>
            
            <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
              <Text style={styles.closeModalButtonText}>Got It</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  paragraph: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 16,
    lineHeight: 20,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 16,
  },
  macroExplanation: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  macroIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
    marginTop: 2,
  },
  macroInfo: {
    flex: 1,
  },
  macroTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  macroDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  disclaimer: {
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  disclaimerText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  closeModalButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  closeModalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});