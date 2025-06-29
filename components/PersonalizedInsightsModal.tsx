import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { PersonalizedInsight, PerformanceMetrics } from '@/store/gamificationStore';
import { X, TrendingUp, Target, Award, Zap } from 'lucide-react-native';

interface PersonalizedInsightsModalProps {
  visible: boolean;
  onClose: () => void;
  insight: PersonalizedInsight | null;
}

export default function PersonalizedInsightsModal({ 
  visible, 
  onClose, 
  insight 
}: PersonalizedInsightsModalProps) {
  const { colors } = useTheme();

  if (!insight) return null;

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'improvement':
        return <TrendingUp size={24} color={colors.primary} />;
      case 'consistency':
        return <Target size={24} color={colors.success} />;
      case 'achievement':
        return <Award size={24} color={colors.warning} />;
      case 'motivation':
        return <Zap size={24} color={colors.secondary} />;
      default:
        return <TrendingUp size={24} color={colors.primary} />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'improvement':
        return colors.primary;
      case 'consistency':
        return colors.success;
      case 'achievement':
        return colors.warning;
      case 'motivation':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: colors.card }]}>
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              {getInsightIcon(insight.type)}
              <Text style={[styles.title, { color: colors.text }]}>
                {insight.title}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.messageContainer, { backgroundColor: colors.background }]}>
              <Text style={[styles.message, { color: colors.text }]}>
                {insight.message}
              </Text>
            </View>

            <View style={styles.metricsContainer}>
              <Text style={[styles.metricsTitle, { color: colors.text }]}>
                Performance Metrics
              </Text>
              
              <View style={styles.metricsGrid}>
                <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                    Improvement
                  </Text>
                  <Text style={[styles.metricValue, { color: getInsightColor(insight.type) }]}>
                    {formatPercentage(insight.metrics.improvementPercentage)}
                  </Text>
                </View>

                <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                    Consistency Score
                  </Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>
                    {insight.metrics.consistencyScore.toFixed(1)}/10
                  </Text>
                </View>

                <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                    Days Completed
                  </Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>
                    {insight.metrics.daysCompleted}/{insight.metrics.totalDays}
                  </Text>
                </View>

                <View style={[styles.metricCard, { backgroundColor: colors.background }]}>
                  <Text style={[styles.metricLabel, { color: colors.textSecondary }]}>
                    Peak Performance
                  </Text>
                  <Text style={[styles.metricValue, { color: colors.text }]}>
                    {insight.metrics.peakPerformance.toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.insightsContainer}>
              <Text style={[styles.insightsTitle, { color: colors.text }]}>
                Key Insights
              </Text>
              
              <View style={styles.insightList}>
                {insight.metrics.improvementPercentage > 0 && (
                  <View style={[styles.insightItem, { backgroundColor: colors.background }]}>
                    <Text style={[styles.insightText, { color: colors.text }]}>
                      🎯 You've shown excellent progress with a {insight.metrics.improvementPercentage.toFixed(1)}% improvement!
                    </Text>
                  </View>
                )}
                
                {insight.metrics.consistencyScore >= 7 && (
                  <View style={[styles.insightItem, { backgroundColor: colors.background }]}>
                    <Text style={[styles.insightText, { color: colors.text }]}>
                      🔥 Your consistency score of {insight.metrics.consistencyScore.toFixed(1)}/10 shows great dedication!
                    </Text>
                  </View>
                )}
                
                {insight.metrics.daysCompleted === insight.metrics.totalDays && (
                  <View style={[styles.insightItem, { backgroundColor: colors.background }]}>
                    <Text style={[styles.insightText, { color: colors.text }]}>
                      💪 Perfect completion! You didn't miss a single day.
                    </Text>
                  </View>
                )}
                
                {insight.metrics.peakPerformance > 8 && (
                  <View style={[styles.insightItem, { backgroundColor: colors.background }]}>
                    <Text style={[styles.insightText, { color: colors.text }]}>
                      ⚡ Your peak performance of {insight.metrics.peakPerformance.toFixed(1)} shows exceptional effort!
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={[styles.recommendationContainer, { backgroundColor: colors.background }]}>
              <Text style={[styles.recommendationTitle, { color: colors.text }]}>
                💡 Recommendation
              </Text>
              <Text style={[styles.recommendationText, { color: colors.textSecondary }]}>
                Keep up this amazing momentum! Consider setting a new challenge to continue your fitness journey and maintain this level of consistency.
              </Text>
            </View>
          </ScrollView>

          <TouchableOpacity
            style={[styles.closeModalButton, { backgroundColor: colors.primary }]}
            onPress={onClose}
          >
            <Text style={styles.closeModalButtonText}>
              Got it!
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 12,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  messageContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  metricsContainer: {
    marginBottom: 20,
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  insightsContainer: {
    marginBottom: 20,
  },
  insightsTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  insightList: {
    gap: 8,
  },
  insightItem: {
    padding: 12,
    borderRadius: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
  },
  recommendationContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  recommendationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  closeModalButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeModalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 