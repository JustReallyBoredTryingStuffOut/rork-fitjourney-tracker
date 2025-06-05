import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { useThemeStore } from '@/store/themeStore';
import { getColors } from '@/constants/colors';
import { useMacroStore } from '@/store/macroStore';
import { useGamificationStore } from '@/store/gamificationStore';
import { useRouter } from 'expo-router';
import { User, Settings, Camera, Weight, Bell, Moon, Shield, Activity, LogOut, Award, Trophy, Target, Zap } from 'lucide-react-native';
import AchievementBadge from '@/components/AchievementBadge';
import { APP_NAME } from '@/app/_layout';

export default function ProfileScreen() {
  const router = useRouter();
  const { theme, colorScheme } = useThemeStore();
  const currentTheme = theme === "system" ? "light" : theme;
  const colors = getColors(currentTheme, colorScheme);
  
  const { userProfile } = useMacroStore();
  const { 
    unlockedAchievements, 
    getRecentAchievements, 
    getCurrentLevel, 
    points,
    streak,
    gamificationEnabled,
    toggleGamification
  } = useGamificationStore();
  
  // Get current level
  const currentLevel = getCurrentLevel();
  
  // Get recent achievements
  const recentAchievements = getRecentAchievements(3);
  
  const menuItems = [
    {
      icon: <User size={24} color={colors.primary} />,
      title: 'Edit Profile',
      description: 'Update your personal information',
      route: '/edit-profile'
    },
    {
      icon: <Trophy size={24} color={colors.primary} />,
      title: 'Achievements',
      description: 'View your badges and progress',
      route: '/achievements',
      badge: unlockedAchievements.length > 0 ? unlockedAchievements.length.toString() : undefined,
      hideWhenGamificationDisabled: true
    },
    {
      icon: <Target size={24} color={colors.primary} />,
      title: 'Challenges',
      description: 'View active and completed challenges',
      route: '/challenges',
      hideWhenGamificationDisabled: true
    },
    {
      icon: <Weight size={24} color={colors.primary} />,
      title: 'Weight Log',
      description: 'Track your weight progress',
      route: '/weight-log'
    },
    {
      icon: <Activity size={24} color={colors.primary} />,
      title: 'Activity Log',
      description: 'View your activity history',
      route: '/activity-log'
    },
    {
      icon: <Camera size={24} color={colors.primary} />,
      title: 'Progress Photos',
      description: 'View your transformation journey',
      route: '/progress-photos'
    },
    {
      icon: <Bell size={24} color={colors.primary} />,
      title: 'Notifications',
      description: 'Manage your notification settings',
      route: '/notifications'
    },
    {
      icon: <Moon size={24} color={colors.primary} />,
      title: 'Theme Settings',
      description: 'Customize app appearance',
      route: '/theme-settings'
    },
    {
      icon: <Shield size={24} color={colors.primary} />,
      title: 'Privacy & Data',
      description: 'Manage your data and privacy settings',
      route: '/data-management'
    },
  ];
  
  // Filter menu items based on gamification state
  const filteredMenuItems = menuItems.filter(item => 
    !item.hideWhenGamificationDisabled || gamificationEnabled
  );
  
  // Handle gamification toggle
  const handleGamificationToggle = (value: boolean) => {
    toggleGamification(value);
  };
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.profileImageContainer, { backgroundColor: colors.card }]}>
          <Text style={[styles.profileInitial, { color: colors.primary }]}>
            {userProfile.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        
        <Text style={[styles.name, { color: colors.text }]}>{userProfile.name}</Text>
        
        {gamificationEnabled && (
          <View style={styles.levelBadge}>
            <Text style={styles.levelIcon}>{currentLevel.icon}</Text>
            <Text style={[styles.levelText, { color: colors.text }]}>
              Level {currentLevel.level}: {currentLevel.title}
            </Text>
          </View>
        )}
        
        {gamificationEnabled && (
          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{points}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>XP Points</Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{streak.currentStreak}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
            </View>
            
            <View style={[styles.statItem, { backgroundColor: colors.card }]}>
              <Text style={[styles.statValue, { color: colors.text }]}>{unlockedAchievements.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Achievements</Text>
            </View>
          </View>
        )}
      </View>
      
      {gamificationEnabled && recentAchievements.length > 0 && (
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Achievements</Text>
            <TouchableOpacity onPress={() => router.push('/achievements')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.achievementsRow}>
            {recentAchievements.map(achievement => (
              <View key={achievement.id} style={styles.achievementItem}>
                <AchievementBadge 
                  achievement={achievement} 
                  size="small"
                  showProgress={false}
                  onPress={() => router.push('/achievements')}
                />
                <Text 
                  style={[styles.achievementName, { color: colors.textSecondary }]}
                  numberOfLines={1}
                >
                  {achievement.title}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      {/* Gamification Toggle */}
      <View style={[styles.gamificationToggleContainer, { backgroundColor: colors.card }]}>
        <View style={styles.gamificationToggleContent}>
          <View style={styles.gamificationToggleIcon}>
            <Zap size={24} color={gamificationEnabled ? colors.primary : colors.textSecondary} />
          </View>
          <View style={styles.gamificationToggleText}>
            <Text style={[styles.gamificationToggleTitle, { color: colors.text }]}>
              {APP_NAME} Gamification
            </Text>
            <Text style={[styles.gamificationToggleDescription, { color: colors.textSecondary }]}>
              {gamificationEnabled 
                ? "Earn achievements, complete challenges, and level up" 
                : "Enable gamification features to make fitness more fun"}
            </Text>
          </View>
          <Switch
            value={gamificationEnabled}
            onValueChange={handleGamificationToggle}
            trackColor={{ false: colors.border, true: `${colors.primary}80` }}
            thumbColor={gamificationEnabled ? colors.primary : "#f4f3f4"}
          />
        </View>
      </View>
      
      <View style={styles.menuContainer}>
        {filteredMenuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { backgroundColor: colors.card }]}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.menuIcon}>
              {item.icon}
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.menuDescription, { color: colors.textSecondary }]}>{item.description}</Text>
            </View>
            
            {item.badge && (
              <View style={[styles.menuBadge, { backgroundColor: colors.primary }]}>
                <Text style={styles.menuBadgeText}>{item.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.privacyButton]}
          onPress={() => router.push('/privacy-policy')}
        >
          <Text style={[styles.privacyButtonText, { color: colors.primary }]}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileInitial: {
    fontSize: 40,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  statItem: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  achievementsSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  seeAll: {
    fontSize: 14,
  },
  achievementsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  achievementItem: {
    alignItems: 'center',
  },
  achievementName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    maxWidth: 80,
  },
  gamificationToggleContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  gamificationToggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  gamificationToggleIcon: {
    marginRight: 16,
  },
  gamificationToggleText: {
    flex: 1,
  },
  gamificationToggleTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  gamificationToggleDescription: {
    fontSize: 14,
  },
  menuContainer: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative',
  },
  menuIcon: {
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 14,
  },
  menuBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  privacyButton: {
    padding: 12,
  },
  privacyButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
});