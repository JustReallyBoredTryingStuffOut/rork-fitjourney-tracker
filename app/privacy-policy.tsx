import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from "lucide-react-native";

export default function PrivacyPolicy() {
  const router = useRouter();
  const { theme, colorScheme } = useThemeStore();
  const currentTheme = theme === "system" ? "light" : theme;
  const colors = getColors(currentTheme, colorScheme);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: "Privacy Policy",
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
        <Text style={[styles.date, { color: colors.text }]}>Last Updated: May 31, 2025</Text>
        
        <Text style={[styles.section, { color: colors.text }]}>1. Introduction</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Welcome to our fitness app. We are committed to protecting your privacy and handling your data in an open and transparent manner. This privacy policy explains how we collect, use, share, and protect your personal information.
        </Text>
        
        <Text style={[styles.section, { color: colors.text }]}>2. Information We Collect</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          We collect the following types of information:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Personal Information: Name, email address, age, gender, height, weight
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Health and Fitness Data: Workout records, nutrition logs, step counts, weight logs
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Photos: Progress photos and food photos that you choose to upload
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Usage Data: How you interact with the app, features you use, and time spent
        </Text>
        
        <Text style={[styles.section, { color: colors.text }]}>3. How We Use Your Information</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          We use your information for the following purposes:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • To provide and improve our services
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • To personalize your experience
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • To track your progress and provide insights
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • To send notifications and reminders that you've requested
        </Text>
        
        <Text style={[styles.section, { color: colors.text }]}>4. Data Storage and Security</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Your data is primarily stored locally on your device. Sensitive data is encrypted to protect your privacy. We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage.
        </Text>
        
        <Text style={[styles.section, { color: colors.text }]}>5. Your Rights</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Under the General Data Protection Regulation (GDPR) and other applicable data protection laws, you have the following rights:
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Right to access your personal data
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Right to rectification of inaccurate data
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Right to erasure ("right to be forgotten")
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Right to data portability
        </Text>
        <Text style={[styles.bulletPoint, { color: colors.text }]}>
          • Right to withdraw consent
        </Text>
        
        <Text style={[styles.paragraph, { color: colors.text }]}>
          You can exercise these rights through the app's Data Management section, where you can export or delete all your data.
        </Text>
        
        <Text style={[styles.section, { color: colors.text }]}>6. Data Retention</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          We will retain your personal data only for as long as necessary to fulfill the purposes for which it was collected. You can delete your data at any time through the app's Data Management section.
        </Text>
        
        <Text style={[styles.section, { color: colors.text }]}>7. Children's Privacy</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Our app is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
        </Text>
        
        <Text style={[styles.section, { color: colors.text }]}>8. Changes to This Privacy Policy</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </Text>
        
        <Text style={[styles.section, { color: colors.text }]}>9. Contact Us</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          If you have any questions about this Privacy Policy or our data practices, please contact us at:
        </Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          privacy@fitnessapp.example.com
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 16,
  },
  backButton: {
    padding: 8,
  },
});