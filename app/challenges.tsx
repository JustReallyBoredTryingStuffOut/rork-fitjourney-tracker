import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Modal,
  Pressable,
  Image
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useGamificationStore, Challenge } from '@/store/gamificationStore';
import { Stack, useRouter } from 'expo-router';
import ChallengeCard from '@/components/ChallengeCard';
import Button from '@/components/Button';
import { Award, X, Check, Calendar, Clock, Target, ArrowLeft, Lock } from 'lucide-react-native';
import { APP_NAME } from '@/app/_layout';

export default function ChallengesScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { 
    challenges, 
    startChallenge,
    completeChallenge,
    updateChallengeProgress,
    initializeAchievements,
    gamificationEnabled,
    toggleGamification
  } = useGamificationStore();
  
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Initialize achievements when screen loads
  useEffect(() => {
    if (gamificationEnabled) {
      initializeAchievements();
    }
  }, [gamificationEnabled]);
  
  // Filter challenges by status
  const activeChallenge = challenges.filter(c => !c.completed && new Date(c.endDate) > new Date());
  const completedChallenges = challenges.filter(c => c.completed);
  const expiredChallenges = challenges.filter(c => !c.completed && new Date(c.endDate) <= new Date());
  
  // Handle challenge press
  const handleChallengePress = (challenge: Challenge) => {
    setSelectedChallenge(challenge);
    setShowModal(true);
  };
  
  // Handle challenge completion
  const handleCompleteChallenge = (challengeId: string) => {
    completeChallenge(challengeId);
    setShowModal(false);
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  // If gamification is disabled, show a message
  if (!gamificationEnabled) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen 
          options={{ 
            title: "Challenges",
            headerTitleStyle: { color: colors.text },
            headerStyle: { backgroundColor: colors.background },
            headerLeft: () => (
              <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                <ArrowLeft size={24} color={colors.text} />
              </TouchableOpacity>
            ),
          }} 
        />
        
        <View style={styles.disabledContainer}>
          <View style={styles.disabledIconContainer}>
            <Lock size={60} color={colors.textSecondary} />
          </View>
          <Text style={[styles.disabledTitle, { color: colors.text }]}>
            Challenges are Disabled
          </Text>
          <Text style={[styles.disabledMessage, { color: colors.textSecondary }]}>
            {APP_NAME}'s challenge system is currently disabled. Enable gamification in your profile settings to participate in fitness challenges, earn rewards, and track your progress.
          </Text>
          <Button
            title="Enable Gamification"
            onPress={() => toggleGamification(true)}
            style={styles.enableButton}
          />
          <Button
            title="Back to Profile"
            onPress={handleGoBack}
            variant="outline"
            style={styles.backButton2}
          />
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{ 
          title: "Challenges",
          headerTitleStyle: { color: colors.text },
          headerStyle: { backgroundColor: colors.background },
          headerLeft: () => (
            <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView contentContainerStyle={styles.content}>
        {activeChallenge.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Active Challenges
            </Text>
            
            {activeChallenge.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onPress={() => handleChallengePress(challenge)}
              />
            ))}
          </View>
        )}
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Available Challenges
          </Text>
          
          <View style={[styles.challengePreview, { backgroundColor: colors.card }]}>
            <View style={styles.challengePreviewHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <Award size={24} color={colors.primary} />
              </View>
              <View style={styles.challengePreviewInfo}>
                <Text style={[styles.challengePreviewTitle, { color: colors.text }]}>
                  Weekly Workout Challenge
                </Text>
                <Text style={[styles.challengePreviewDescription, { color: colors.textSecondary }]}>
                  Complete 5 workouts this week
                </Text>
              </View>
            </View>
            
            <View style={styles.challengePreviewRewards}>
              <View style={[styles.rewardBadge, { backgroundColor: `${colors.secondary}20` }]}>
                <Text style={[styles.rewardText, { color: colors.secondary }]}>
                  Reward: 150 XP + Cheat Day
                </Text>
              </View>
            </View>
            
            <Button
              title="Start Challenge"
              onPress={() => {
                const newChallenge: Challenge = {
                  id: `challenge-weekly-${Date.now()}`,
                  title: "Weekly Workout Challenge",
                  description: "Complete 5 workouts this week",
                  startDate: new Date().toISOString(),
                  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                  target: 5,
                  progress: 0,
                  completed: false,
                  category: "workout",
                  points: 150,
                  reward: "Cheat Day Reward"
                };
                startChallenge(newChallenge);
              }}
              style={styles.startButton}
            />
          </View>
          
          <View style={[styles.challengePreview, { backgroundColor: colors.card }]}>
            <View style={styles.challengePreviewHeader}>
              <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
                <Target size={24} color={colors.primary} />
              </View>
              <View style={styles.challengePreviewInfo}>
                <Text style={[styles.challengePreviewTitle, { color: colors.text }]}>
                  Step Master Challenge
                </Text>
                <Text style={[styles.challengePreviewDescription, { color: colors.textSecondary }]}>
                  Reach 70,000 steps in one week
                </Text>
              </View>
            </View>
            
            <View style={styles.challengePreviewRewards}>
              <View style={[styles.rewardBadge, { backgroundColor: `${colors.secondary}20` }]}>
                <Text style={[styles.rewardText, { color: colors.secondary }]}>
                  Reward: 200 XP + Custom Workout Plan
                </Text>
              </View>
            </View>
            
            <Button
              title="Start Challenge"
              onPress={() => {
                const newChallenge: Challenge = {
                  id: `challenge-steps-${Date.now()}`,
                  title: "Step Master Challenge",
                  description: "Reach 70,000 steps in one week",
                  startDate: new Date().toISOString(),
                  endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                  target: 70000,
                  progress: 0,
                  completed: false,
                  category: "steps",
                  points: 200,
                  reward: "Custom Workout Plan"
                };
                startChallenge(newChallenge);
              }}
              style={styles.startButton}
            />
          </View>
        </View>
        
        {completedChallenges.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Completed Challenges
            </Text>
            
            {completedChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onPress={() => handleChallengePress(challenge)}
              />
            ))}
          </View>
        )}
        
        {expiredChallenges.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Expired Challenges
            </Text>
            
            {expiredChallenges.map((challenge) => (
              <ChallengeCard 
                key={challenge.id} 
                challenge={challenge}
                onPress={() => handleChallengePress(challenge)}
              />
            ))}
          </View>
        )}
        
        <Button
          title="Back"
          onPress={handleGoBack}
          variant="outline"
          style={styles.backButton2}
        />
      </ScrollView>
      
      {/* Challenge Detail Modal */}
      {selectedChallenge && (
        <Modal
          visible={showModal}
          transparent
          animationType="fade"
          statusBarTranslucent
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={() => setShowModal(false)}
          >
            <Pressable style={[styles.modalContainer, { backgroundColor: colors.card }]} onPress={e => e.stopPropagation()}>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setShowModal(false)}
              >
                <X size={24} color={colors.text} />
              </TouchableOpacity>
              
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedChallenge.title}
              </Text>
              
              <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
                {selectedChallenge.description}
              </Text>
              
              <View style={styles.challengeDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={20} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    {new Date(selectedChallenge.startDate).toLocaleDateString()} - {new Date(selectedChallenge.endDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Target size={20} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    Progress: {selectedChallenge.progress} / {selectedChallenge.target}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <Award size={20} color={colors.primary} />
                  <Text style={[styles.detailText, { color: colors.text }]}>
                    Reward: {selectedChallenge.points} XP
                    {selectedChallenge.reward ? ` + ${selectedChallenge.reward}` : ''}
                  </Text>
                </View>
              </View>
              
              <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
                <View 
                  style={[
                    styles.progressBar, 
                    { 
                      width: `${Math.min(100, Math.floor((selectedChallenge.progress / selectedChallenge.target) * 100))}%`,
                      backgroundColor: selectedChallenge.completed ? colors.secondary : colors.primary
                    }
                  ]} 
                />
              </View>
              
              {!selectedChallenge.completed && new Date(selectedChallenge.endDate) > new Date() && (
                <View style={styles.modalActions}>
                  <Button
                    title="Update Progress"
                    onPress={() => {
                      // For demo purposes, increment progress by 1
                      updateChallengeProgress(
                        selectedChallenge.id, 
                        selectedChallenge.progress + 1
                      );
                      setShowModal(false);
                    }}
                    style={styles.updateButton}
                  />
                  
                  <Button
                    title="Mark as Complete"
                    onPress={() => handleCompleteChallenge(selectedChallenge.id)}
                    variant="outline"
                    style={styles.completeButton}
                  />
                </View>
              )}
              
              {selectedChallenge.completed && (
                <View style={[styles.completedBanner, { backgroundColor: `${colors.secondary}20` }]}>
                  <Check size={20} color={colors.secondary} />
                  <Text style={[styles.completedText, { color: colors.secondary }]}>
                    Challenge Completed!
                  </Text>
                </View>
              )}
              
              {!selectedChallenge.completed && new Date(selectedChallenge.endDate) <= new Date() && (
                <View style={[styles.expiredBanner, { backgroundColor: `${colors.error}20` }]}>
                  <Clock size={20} color={colors.error} />
                  <Text style={[styles.expiredText, { color: colors.error }]}>
                    Challenge Expired
                  </Text>
                </View>
              )}
              
              <Button
                title="Close"
                onPress={() => setShowModal(false)}
                variant="outline"
                style={styles.closeModalButton}
              />
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  backButton: {
    marginRight: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  challengePreview: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  challengePreviewHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  challengePreviewInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  challengePreviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  challengePreviewDescription: {
    fontSize: 14,
  },
  challengePreviewRewards: {
    marginBottom: 16,
  },
  rewardBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  rewardText: {
    fontSize: 14,
    fontWeight: '500',
  },
  startButton: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  challengeDetails: {
    width: '100%',
    marginBottom: 24,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 12,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
  },
  modalActions: {
    width: '100%',
    marginBottom: 16,
  },
  updateButton: {
    marginBottom: 8,
  },
  completeButton: {
    marginBottom: 8,
  },
  closeModalButton: {
    minWidth: 120,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  completedText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  expiredBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  expiredText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  backButton2: {
    marginBottom: 24,
  },
  // Disabled state styles
  disabledContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  disabledTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  disabledMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  enableButton: {
    width: '100%',
    marginBottom: 16,
  },
});