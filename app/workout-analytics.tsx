import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Clock, Dumbbell, Award, Target, Activity } from 'lucide-react-native';
import { useWorkoutStore } from '@/store/workoutStore';
import { useTheme } from '@/context/ThemeContext';
import { colors } from '@/constants/colors';

const { width: screenWidth } = Dimensions.get('window');

type TimeRange = 'week' | 'month' | '3months' | 'year' | 'all';

export default function WorkoutAnalyticsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { workoutLogs, workouts, personalRecords } = useWorkoutStore();
  
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange>('month');
  const [selectedChart, setSelectedChart] = useState<'workouts' | 'duration' | 'strength' | 'volume'>('workouts');

  // Filter logs based on selected time range
  const filteredLogs = useMemo(() => {
    const now = new Date();
    const completedLogs = workoutLogs.filter(log => log.completed);
    
    switch (selectedTimeRange) {
      case 'week':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return completedLogs.filter(log => new Date(log.date) >= weekAgo);
      case 'month':
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return completedLogs.filter(log => new Date(log.date) >= monthAgo);
      case '3months':
        const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return completedLogs.filter(log => new Date(log.date) >= threeMonthsAgo);
      case 'year':
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        return completedLogs.filter(log => new Date(log.date) >= yearAgo);
      default:
        return completedLogs;
    }
  }, [workoutLogs, selectedTimeRange]);

  // Calculate analytics data
  const analytics = useMemo(() => {
    if (filteredLogs.length === 0) {
      return {
        totalWorkouts: 0,
        totalDuration: 0,
        averageDuration: 0,
        totalExercises: 0,
        averageRating: 0,
        mostFrequentWorkout: null,
        workoutFrequency: [],
        durationTrend: [],
        strengthProgress: [],
        volumeData: []
      };
    }

    // Basic stats
    const totalWorkouts = filteredLogs.length;
    const totalDuration = filteredLogs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const averageDuration = totalDuration / totalWorkouts;
    const totalExercises = filteredLogs.reduce((sum, log) => sum + log.exercises.length, 0);
    
    // Average rating
    const ratedLogs = filteredLogs.filter(log => log.rating && log.rating.rating);
    const averageRating = ratedLogs.length > 0 
      ? ratedLogs.reduce((sum, log) => sum + (log.rating?.rating || 0), 0) / ratedLogs.length 
      : 0;

    // Most frequent workout
    const workoutCounts: Record<string, number> = {};
    filteredLogs.forEach(log => {
      workoutCounts[log.workoutId] = (workoutCounts[log.workoutId] || 0) + 1;
    });
    
    let mostFrequentWorkout = null;
    let maxCount = 0;
    Object.entries(workoutCounts).forEach(([workoutId, count]) => {
      if (count > maxCount) {
        maxCount = count;
        const workout = workouts.find(w => w.id === workoutId);
        mostFrequentWorkout = workout;
      }
    });

    // Workout frequency by day
    const workoutFrequency = Array(7).fill(0);
    filteredLogs.forEach(log => {
      const day = new Date(log.date).getDay();
      workoutFrequency[day]++;
    });

    // Duration trend (last 10 workouts)
    const durationTrend = filteredLogs
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .reverse()
      .map(log => ({
        date: new Date(log.date).toLocaleDateString(),
        duration: log.duration || 0
      }));

    // Strength progress (personal records)
    const strengthProgress = personalRecords
      .filter(pr => {
        const prDate = new Date(pr.date);
        const startDate = selectedTimeRange === 'week' ? new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) :
                        selectedTimeRange === 'month' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) :
                        selectedTimeRange === '3months' ? new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) :
                        selectedTimeRange === 'year' ? new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) :
                        new Date(0);
        return prDate >= startDate;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(pr => ({
        date: new Date(pr.date).toLocaleDateString(),
        exercise: pr.exerciseName,
        weight: pr.weight,
        estimated1RM: pr.estimatedOneRepMax
      }));

    // Volume data (total weight lifted per workout)
    const volumeData = filteredLogs
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10)
      .reverse()
      .map(log => {
        let totalVolume = 0;
        log.exercises.forEach(exercise => {
          exercise.sets.forEach(set => {
            if (set.weight && set.reps) {
              totalVolume += set.weight * set.reps;
            }
          });
        });
        return {
          date: new Date(log.date).toLocaleDateString(),
          volume: Math.round(totalVolume)
        };
      });

    return {
      totalWorkouts,
      totalDuration,
      averageDuration,
      totalExercises,
      averageRating,
      mostFrequentWorkout,
      workoutFrequency,
      durationTrend,
      strengthProgress,
      volumeData
    };
  }, [filteredLogs, workouts, personalRecords, selectedTimeRange]);

  const timeRangeOptions: { value: TimeRange; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: '3months', label: '3 Months' },
    { value: 'year', label: 'Year' },
    { value: 'all', label: 'All Time' }
  ];

  const chartOptions = [
    { value: 'workouts', label: 'Workouts', icon: Activity },
    { value: 'duration', label: 'Duration', icon: Clock },
    { value: 'strength', label: 'Strength', icon: TrendingUp },
    { value: 'volume', label: 'Volume', icon: Dumbbell }
  ];

  const renderWorkoutFrequencyChart = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const maxValue = Math.max(...analytics.workoutFrequency);
    
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Workout Frequency by Day</Text>
        <View style={styles.barChart}>
          {analytics.workoutFrequency.map((count, index) => (
            <View key={index} style={styles.barColumn}>
              <View style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { 
                      backgroundColor: colors.primary,
                      height: maxValue > 0 ? (count / maxValue) * 120 : 0
                    }
                  ]} 
                />
              </View>
              <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{days[index]}</Text>
              <Text style={[styles.barValue, { color: colors.text }]}>{count}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderDurationTrendChart = () => {
    if (analytics.durationTrend.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Duration Trend</Text>
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No duration data available</Text>
        </View>
      );
    }

    const maxDuration = Math.max(...analytics.durationTrend.map(d => d.duration));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Duration Trend (Last 10 Workouts)</Text>
        <View style={styles.lineChart}>
          {analytics.durationTrend.map((data, index) => (
            <View key={index} style={styles.lineChartPoint}>
              <View 
                style={[
                  styles.lineChartDot, 
                  { 
                    backgroundColor: colors.primary,
                    height: maxDuration > 0 ? (data.duration / maxDuration) * 100 : 0
                  }
                ]} 
              />
              <Text style={[styles.lineChartLabel, { color: colors.textSecondary }]}>{data.duration}m</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderStrengthProgressChart = () => {
    if (analytics.strengthProgress.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Strength Progress</Text>
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No personal records in this period</Text>
        </View>
      );
    }

    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Personal Records</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.strengthChart}>
            {analytics.strengthProgress.map((pr, index) => (
              <View key={index} style={[styles.strengthCard, { backgroundColor: colors.card }]}>
                <Text style={[styles.strengthExercise, { color: colors.text }]} numberOfLines={1}>
                  {pr.exercise}
                </Text>
                <Text style={[styles.strengthWeight, { color: colors.primary }]}>
                  {pr.weight} kg
                </Text>
                <Text style={[styles.strengthDate, { color: colors.textSecondary }]}>
                  {pr.date}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderVolumeChart = () => {
    if (analytics.volumeData.length === 0) {
      return (
        <View style={styles.chartContainer}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Volume Progress</Text>
          <Text style={[styles.noDataText, { color: colors.textSecondary }]}>No volume data available</Text>
        </View>
      );
    }

    const maxVolume = Math.max(...analytics.volumeData.map(v => v.volume));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={[styles.chartTitle, { color: colors.text }]}>Volume Trend (Last 10 Workouts)</Text>
        <View style={styles.volumeChart}>
          {analytics.volumeData.map((data, index) => (
            <View key={index} style={styles.volumeBar}>
              <View 
                style={[
                  styles.volumeBarFill, 
                  { 
                    backgroundColor: colors.secondary,
                    height: maxVolume > 0 ? (data.volume / maxVolume) * 120 : 0
                  }
                ]} 
              />
              <Text style={[styles.volumeLabel, { color: colors.textSecondary }]}>{data.volume}kg</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Workout Analytics</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Time Range Selector */}
        <View style={styles.timeRangeContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Time Range</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {timeRangeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.timeRangeButton,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  selectedTimeRange === option.value && [styles.timeRangeButtonActive, { backgroundColor: colors.primary }]
                ]}
                onPress={() => setSelectedTimeRange(option.value)}
              >
                <Text style={[
                  styles.timeRangeButtonText,
                  { color: colors.text },
                  selectedTimeRange === option.value && styles.timeRangeButtonTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Summary Stats */}
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.primary + '20' }]}>
              <Activity size={20} color={colors.primary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{analytics.totalWorkouts}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Workouts</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: colors.secondary + '20' }]}>
              <Clock size={20} color={colors.secondary} />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{Math.round(analytics.averageDuration)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Duration</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: '#FF9500' + '20' }]}>
              <Dumbbell size={20} color="#FF9500" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{analytics.totalExercises}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Exercises</Text>
          </View>
          
          <View style={[styles.statCard, { backgroundColor: colors.card }]}>
            <View style={[styles.statIcon, { backgroundColor: '#4CD964' + '20' }]}>
              <Award size={20} color="#4CD964" />
            </View>
            <Text style={[styles.statValue, { color: colors.text }]}>{analytics.averageRating.toFixed(1)}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Avg Rating</Text>
          </View>
        </View>

        {/* Chart Type Selector */}
        <View style={styles.chartSelector}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Charts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {chartOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.chartTypeButton,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    selectedChart === option.value && [styles.chartTypeButtonActive, { backgroundColor: colors.primary }]
                  ]}
                  onPress={() => setSelectedChart(option.value as any)}
                >
                  <IconComponent size={16} color={selectedChart === option.value ? '#FFFFFF' : colors.textSecondary} />
                  <Text style={[
                    styles.chartTypeButtonText,
                    { color: colors.text },
                    selectedChart === option.value && styles.chartTypeButtonTextActive
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Chart */}
        {selectedChart === 'workouts' && renderWorkoutFrequencyChart()}
        {selectedChart === 'duration' && renderDurationTrendChart()}
        {selectedChart === 'strength' && renderStrengthProgressChart()}
        {selectedChart === 'volume' && renderVolumeChart()}

        {/* Most Frequent Workout */}
        {analytics.mostFrequentWorkout && (
          <View style={[styles.frequentWorkoutCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Most Frequent Workout</Text>
            <View style={styles.frequentWorkoutInfo}>
              <Text style={[styles.frequentWorkoutName, { color: colors.text }]}>
                {analytics.mostFrequentWorkout.name}
              </Text>
              <Text style={[styles.frequentWorkoutCategory, { color: colors.textSecondary }]}>
                {analytics.mostFrequentWorkout.category}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  timeRangeContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  timeRangeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
  },
  timeRangeButtonActive: {
    backgroundColor: '#007AFF',
  },
  timeRangeButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  timeRangeButtonTextActive: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (screenWidth - 48) / 2,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  chartSelector: {
    marginBottom: 24,
  },
  chartTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  chartTypeButtonActive: {
    backgroundColor: '#007AFF',
  },
  chartTypeButtonText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  chartTypeButtonTextActive: {
    color: '#FFFFFF',
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 8,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
  },
  barContainer: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  lineChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 140,
    paddingHorizontal: 8,
  },
  lineChartPoint: {
    flex: 1,
    alignItems: 'center',
  },
  lineChartDot: {
    width: 8,
    borderRadius: 4,
    minHeight: 4,
    marginBottom: 8,
  },
  lineChartLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  strengthChart: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  strengthCard: {
    width: 120,
    padding: 12,
    borderRadius: 8,
    marginRight: 12,
    alignItems: 'center',
  },
  strengthExercise: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  strengthWeight: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  strengthDate: {
    fontSize: 10,
    fontWeight: '500',
  },
  volumeChart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 160,
    paddingHorizontal: 8,
  },
  volumeBar: {
    flex: 1,
    alignItems: 'center',
  },
  volumeBarFill: {
    width: 16,
    borderRadius: 8,
    minHeight: 4,
    marginBottom: 8,
  },
  volumeLabel: {
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  frequentWorkoutCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  frequentWorkoutInfo: {
    marginTop: 8,
  },
  frequentWorkoutName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  frequentWorkoutCategory: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  noDataText: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
}); 