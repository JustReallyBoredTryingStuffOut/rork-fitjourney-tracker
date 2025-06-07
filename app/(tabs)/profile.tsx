import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Switch } from "react-native";
import { useRouter } from "expo-router";
import { 
  User, 
  Settings, 
  Award, 
  Bell, 
  Flag, 
  Camera, 
  LogOut, 
  ChevronRight,
  MessageSquare,
  HelpCircle,
  Moon,
  Shield
} from "lucide-react-native";
import { colors } from "@/constants/colors";
import { useAiStore } from "@/store/aiStore";
import { useThemeStore } from "@/store/themeStore";
import AiFeatureGuide from "@/components/AiFeatureGuide";

export default function ProfileScreen() {
  const router = useRouter();
  const { userName } = useAiStore();
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [showGuide, setShowGuide] = useState(false);
  
  const navigateTo = (route: string) => {
    router.push(route);
  };
  
  const renderProfileHeader = () => (
    <View style={styles.profileHeader}>
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}>
          <User size={40} color={colors.white} />
        </View>
      </View>
      <Text style={styles.profileName}>{userName || "Fitness Enthusiast"}</Text>
      <TouchableOpacity 
        style={styles.editProfileButton}
        onPress={() => navigateTo("/edit-profile")}
      >
        <Text style={styles.editProfileButtonText}>Edit Profile</Text>
      </TouchableOpacity>
    </View>
  );
  
  const renderMenuItem = (
    icon: React.ReactNode,
    title: string,
    onPress: () => void,
    rightElement?: React.ReactNode
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        {icon}
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      {rightElement || <ChevronRight size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );
  
  return (
    <ScrollView style={styles.container}>
      {renderProfileHeader()}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App</Text>
        
        {renderMenuItem(
          <MessageSquare size={22} color={colors.primary} />,
          "AI Assistant",
          () => navigateTo("/ai-chat")
        )}
        
        {renderMenuItem(
          <HelpCircle size={22} color={colors.primary} />,
          "App Features Guide",
          () => setShowGuide(true)
        )}
        
        {renderMenuItem(
          <Award size={22} color={colors.primary} />,
          "Achievements",
          () => navigateTo("/achievements")
        )}
        
        {renderMenuItem(
          <Flag size={22} color={colors.primary} />,
          "Challenges",
          () => navigateTo("/challenges")
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        {renderMenuItem(
          <Bell size={22} color={colors.primary} />,
          "Notifications",
          () => navigateTo("/notifications")
        )}
        
        {renderMenuItem(
          <Moon size={22} color={colors.primary} />,
          "Dark Mode",
          () => {},
          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: colors.border, true: colors.primaryLight }}
            thumbColor={darkMode ? colors.primary : colors.card}
          />
        )}
        
        {renderMenuItem(
          <Settings size={22} color={colors.primary} />,
          "Theme Settings",
          () => navigateTo("/theme-settings")
        )}
        
        {renderMenuItem(
          <Shield size={22} color={colors.primary} />,
          "Privacy & Data",
          () => navigateTo("/privacy-policy")
        )}
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Media</Text>
        
        {renderMenuItem(
          <Camera size={22} color={colors.primary} />,
          "Progress Photos",
          () => navigateTo("/progress-photos")
        )}
      </View>
      
      <TouchableOpacity style={styles.logoutButton}>
        <LogOut size={20} color={colors.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
      
      <AiFeatureGuide 
        visible={showGuide} 
        onClose={() => setShowGuide(false)} 
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileImageContainer: {
    marginBottom: 12,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  profileName: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 8,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.primaryLight,
    borderRadius: 20,
  },
  editProfileButtonText: {
    color: colors.primary,
    fontWeight: "600",
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 40,
    paddingVertical: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: colors.errorLight,
  },
  logoutText: {
    color: colors.error,
    fontWeight: "600",
    fontSize: 16,
    marginLeft: 8,
  },
});