import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity
} from "react-native";
import { useRouter } from "expo-router";
import { 
  Settings, 
  User, 
  Bell, 
  Moon, 
  Award, 
  Camera, 
  Lock,
  ChevronRight 
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useThemeStore } from "@/store/themeStore";

export default function ProfileScreen() {
  const router = useRouter();
  const { isDarkMode } = useThemeStore();
  
  const profileSections = [
    {
      title: "Account",
      items: [
        {
          icon: <User size={20} color={colors.primary} />,
          title: "Edit Profile",
          onPress: () => router.push("/edit-profile"),
        },
        {
          icon: <Bell size={20} color={colors.primary} />,
          title: "Notifications",
          onPress: () => router.push("/notifications"),
        },
        {
          icon: <Moon size={20} color={colors.primary} />,
          title: "Theme Settings",
          onPress: () => router.push("/theme-settings"),
        },
      ],
    },
    {
      title: "Content",
      items: [
        {
          icon: <Award size={20} color={colors.primary} />,
          title: "Achievements",
          onPress: () => router.push("/achievements"),
        },
        {
          icon: <Camera size={20} color={colors.primary} />,
          title: "Food Photos",
          onPress: () => router.push("/food-photos"),
        },
        {
          icon: <Camera size={20} color={colors.primary} />,
          title: "Progress Photos",
          onPress: () => router.push("/progress-photos"),
        },
      ],
    },
    {
      title: "Privacy & Security",
      items: [
        {
          icon: <Lock size={20} color={colors.primary} />,
          title: "Privacy Settings",
          description: "Encryption, data storage, and more",
          onPress: () => router.push("/privacy-settings"),
        },
        {
          icon: <Settings size={20} color={colors.primary} />,
          title: "Data Management",
          onPress: () => router.push("/data-management"),
        },
      ],
    },
  ];
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.profileName}>John Doe</Text>
      </View>
      
      {profileSections.map((section, index) => (
        <View key={index} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          
          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.menuItem}
                onPress={item.onPress}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuItemIconContainer}>
                    {item.icon}
                  </View>
                  <View>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    {item.description && (
                      <Text style={styles.menuItemDescription}>{item.description}</Text>
                    )}
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      
      <View style={styles.footer}>
        <Text style={styles.version}>Version 1.0.0</Text>
        <TouchableOpacity onPress={() => router.push("/privacy-policy")}>
          <Text style={styles.privacyLink}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "center",
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 16,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(74, 144, 226, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuItemTitle: {
    fontSize: 16,
    color: colors.text,
    fontWeight: "500",
  },
  menuItemDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footer: {
    padding: 16,
    alignItems: "center",
    marginTop: 16,
    marginBottom: 32,
  },
  version: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  privacyLink: {
    fontSize: 12,
    color: colors.primary,
  },
});