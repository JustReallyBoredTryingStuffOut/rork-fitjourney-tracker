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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: "Privacy Policy",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={handleGoBack} 
              style={styles.backButton}
              accessibilityLabel="Go back"
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
        }} 
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Privacy Policy</Text>
          <Text style={[styles.date, { color: colors.text }]}>Last Updated: May 31, 2025</Text>
          
          <Text style={[styles.section, { color: colors.text }]}>1. Introduction</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Welcome to our fitness app. We are committed to protecting your privacy and handling your data, including your photos and fitness data, in an open and transparent manner. This privacy policy explains how we collect, use, share, protect, and store your personal information.
          </Text>
          
          <Text style={[styles.section, { color: colors.text }]}>2. Information We Collect</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            We collect the following types of information:
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Personal Information: Name, age (18 and over), gender, height, weight
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Health and Fitness Data: Workout records, nutrition logs, step counts, weight logs
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Photos: Progress photos and food photos that you choose to upload. These photos are stored locally on your device and are encrypted to ensure your privacy.
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Usage Data: How you interact with the app, features you use, and time spent.
          </Text>
          
          <Text style={[styles.section, { color: colors.text }]}>3. How We Use Your Information</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            We use your information for the following purposes:
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • To provide and improve our services, including personalized workout and nutrition recommendations
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • To track your progress through health and fitness data, including photos that you upload
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • To analyze your nutrition through photos of meals that you upload
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • To send notifications and reminders that you have requested
          </Text>
          
          <Text style={[styles.section, { color: colors.text }]}>4. Data Storage and Security</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Your data, including photos, is stored locally on your device. Sensitive data, including photos, is encrypted using industry-standard encryption techniques to protect your privacy. We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. No personal data is uploaded to the cloud or shared with third parties.
          </Text>
          
          <Text style={[styles.section, { color: colors.text }]}>5. Your Rights</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Under the General Data Protection Regulation (GDPR) and other applicable data protection laws, you have the following rights:
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Right to access your personal data, including any photos uploaded
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Right to rectification of inaccurate data
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Right to erasure ("right to be forgotten"), including the ability to delete all photos
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Right to data portability, allowing you to export your personal data and photos
          </Text>
          <Text style={[styles.bulletPoint, { color: colors.text }]}>
            • Right to withdraw consent at any time
          </Text>
          
          <Text style={[styles.paragraph, { color: colors.text }]}>
            You can exercise these rights through the app's Data Management section, where you can view, export, or delete all your data and photos.
          </Text>
          
          <Text style={[styles.section, { color: colors.text }]}>6. Data Retention</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            We will retain your personal data, including photos, only for as long as necessary to fulfill the purposes for which it was collected. You can delete your data and photos at any time through the app's Data Management section.
          </Text>
          
          <Text style={[styles.section, { color: colors.text }]}>7. Children's Privacy</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            Our app is not intended for children under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
          </Text>
          
          <Text style={[styles.section, { color: colors.text }]}>8. Changes to This Privacy Policy</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            We may update our Privacy Policy from time to time. We will notify you of any significant changes by posting the new Privacy Policy within the app and updating the 'Last Updated' date.
          </Text>
          
          <Text style={[styles.section, { color: colors.text }]}>9. Contact Us</Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            If you have any questions about this Privacy Policy or our data practices, or to exercise your GDPR rights, please contact us at:
          </Text>
          <Text style={[styles.paragraph, { color: colors.text }]}>
            privacy@fitnessapp.example.com
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
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
    borderRadius: 8,
  },
});