import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  Modal,
  Pressable
} from 'react-native';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router';
import { 
  ArrowLeft, 
  Search, 
  FilterIcon, 
  Calendar,
  Clock,
  Trophy,
  TrendingUp,
  BarChart3,
  Edit3,
  Star,
  Target,
  Zap,
  ChevronDown,
  X
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useWorkoutStore } from '@/store/workoutStore';
import Button from '@/components/Button';

type SortOption = 'date-desc' | 'date-asc' | 'duration-desc' | 'duration-asc' | 'rating-desc' | 'rating-asc';
type FilterOption = 'all' | 'this-week' | 'this-month' | 'last-30-days' | 'last-3-months';

export default function WorkoutHistoryScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { workoutLogs, workouts, clearAllWorkoutLogs } = useWorkoutStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  // Get completed workout logs only
  const completedWorkouts = workoutLogs.filter(log => log.completed);
  
  // Filter and sort workouts
  const filteredAndSortedWorkouts = React.useMemo(() => {
    let filtered = completedWorkouts;
    
    // Apply date filter
    const now = new Date();
    switch (filterBy) {
      case 'this-week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        filtered = filtered.filter(log => new Date(log.date) >= weekStart);
        break;
      case 'this-month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        filtered = filtered.filter(log => new Date(log.date) >= monthStart);
        break;
      case 'last-30-days':
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(now.getDate() - 30);
        filtered = filtered.filter(log => new Date(log.date) >= thirtyDaysAgo);
        break;
      case 'last-3-months':
        const threeMonthsAgo = new Date(now);
        threeMonthsAgo.setMonth(now.getMonth() - 3);
        filtered = filtered.filter(log => new Date(log.date) >= threeMonthsAgo);
        break;
    }
    
    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(log => {
        const workout = workouts.find(w => w.id === log.workoutId);
        const workoutName = workout?.name.toLowerCase() || '';
        const notes = log.notes?.toLowerCase() || '';
        const query = searchQuery.toLowerCase();
        return workoutName.includes(query) || notes.includes(query);
      });
    }
    
    // Apply sorting
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'duration-desc':
          return b.duration - a.duration;
        case 'duration-asc':
          return a.duration - b.duration;
        case 'rating-desc':
          return (b.rating?.rating || 0) - (a.rating?.rating || 0);
        case 'rating-asc':
          return (a.rating?.rating || 0) - (b.rating?.rating || 0);
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [completedWorkouts, searchQuery, sortBy, filterBy, workouts]);
  
  // Calculate statistics
  const stats = React.useMemo(() => {
    const totalWorkouts = completedWorkouts.length;
    const totalDuration = completedWorkouts.reduce((sum, log) => sum + log.duration, 0);
    const avgDuration = totalWorkouts > 0 ? totalDuration / totalWorkouts : 0;
    const avgRating = completedWorkouts.reduce((sum, log) => sum + (log.rating?.rating || 0), 0) / totalWorkouts;
    
    // This week's workouts
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const thisWeekWorkouts = completedWorkouts.filter(log => new Date(log.date) >= weekStart);
    
    // This month's workouts
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const thisMonthWorkouts = completedWorkouts.filter(log => new Date(log.date) >= monthStart);
    
    // Most popular workout
    const workoutCounts = completedWorkouts.reduce((acc, log) => {
      acc[log.workoutId] = (acc[log.workoutId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const mostPopularWorkoutId = Object.entries(workoutCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    const mostPopularWorkout = mostPopularWorkoutId ? 
      workouts.find(w => w.id === mostPopularWorkoutId) : null;
    
    return {
      totalWorkouts,
      totalDuration,
      avgDuration,
      avgRating,
      thisWeekCount: thisWeekWorkouts.length,
      thisMonthCount: thisMonthWorkouts.length,
      mostPopularWorkout
    };
  }, [completedWorkouts, workouts]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };
  
  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case 'date-desc': return 'Newest First';
      case 'date-asc': return 'Oldest First';
      case 'duration-desc': return 'Longest First';
      case 'duration-asc': return 'Shortest First';
      case 'rating-desc': return 'Highest Rated';
      case 'rating-asc': return 'Lowest Rated';
    }
  };
  
  const getFilterLabel = (filter: FilterOption) => {
    switch (filter) {
      case 'all': return 'All Time';
      case 'this-week': return 'This Week';
      case 'this-month': return 'This Month';
      case 'last-30-days': return 'Last 30 Days';
      case 'last-3-months': return 'Last 3 Months';
    }
  };
  
  const renderWorkoutCard = (log: any) => {
    const workout = workouts.find(w => w.id === log.workoutId);
    if (!workout) return null;
    
    return (
      <TouchableOpacity
        key={log.id}
        style={[styles.workoutCard, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={() => router.push(`/workout-log/${log.id}`)}
      >
        <View style={styles.workoutHeader}>
          <View style={styles.workoutInfo}>
            <Text style={[styles.workoutName, { color: colors.text }]} numberOfLines={1}>
              {workout.name}
            </Text>
            <Text style={[styles.workoutDate, { color: colors.textSecondary }]}>
              {formatDate(log.date)}
            </Text>
          </View>
          
          <TouchableOpacity
            onPress={() => router.push(`/workout-log/${log.id}`)}
            style={[styles.editButton, { backgroundColor: colors.background }]}
          >
            <Edit3 size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        
        <View style={styles.workoutStats}>
          <View style={styles.stat}>
            <Clock size={14} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {log.duration} min
            </Text>
          </View>
          
          <View style={styles.stat}>
            <Target size={14} color={colors.textSecondary} />
            <Text style={[styles.statText, { color: colors.textSecondary }]}>
              {log.exercises.length} exercises
            </Text>
          </View>
          
          {log.rating && (
            <View style={styles.stat}>
              <Star size={14} color={colors.textSecondary} />
              <Text style={[styles.statText, { color: colors.textSecondary }]}>
                {log.rating.rating}/5
              </Text>
            </View>
          )}
        </View>
        
        {log.notes && (
          <Text style={[styles.workoutNotes, { color: colors.textSecondary }]} numberOfLines={2}>
            {log.notes}
          </Text>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen 
        options={{
          title: "Workout History",
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={styles.headerButton}
            >
              <ArrowLeft size={24} color={colors.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => setShowStats(!showStats)} 
              style={styles.headerButton}
            >
              <BarChart3 size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      
      {/* Stats Panel */}
      {showStats && (
        <View style={[styles.statsPanel, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Text style={[styles.statsPanelTitle, { color: colors.text }]}>Workout Statistics</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statsItem}>
              <Text style={[styles.statsValue, { color: colors.primary }]}>{stats.totalWorkouts}</Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Total Workouts</Text>
            </View>
            
            <View style={styles.statsItem}>
              <Text style={[styles.statsValue, { color: colors.primary }]}>
                {Math.round(stats.totalDuration / 60)}h {stats.totalDuration % 60}m
              </Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Total Time</Text>
            </View>
            
            <View style={styles.statsItem}>
              <Text style={[styles.statsValue, { color: colors.primary }]}>
                {Math.round(stats.avgDuration)}min
              </Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Avg Duration</Text>
            </View>
            
            <View style={styles.statsItem}>
              <Text style={[styles.statsValue, { color: colors.primary }]}>
                {stats.avgRating.toFixed(1)}/5
              </Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Avg Rating</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.statsItem}>
              <Text style={[styles.statsValue, { color: colors.secondary }]}>{stats.thisWeekCount}</Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>This Week</Text>
            </View>
            
            <View style={styles.statsItem}>
              <Text style={[styles.statsValue, { color: colors.secondary }]}>{stats.thisMonthCount}</Text>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>This Month</Text>
            </View>
          </View>
          
          {stats.mostPopularWorkout && (
            <View style={[styles.popularWorkout, { backgroundColor: colors.background }]}>
              <Trophy size={16} color={colors.primary} />
              <Text style={[styles.popularWorkoutText, { color: colors.text }]}>
                Most Popular: {stats.mostPopularWorkout.name}
              </Text>
            </View>
          )}
        </View>
      )}
      
      {/* Search and Filters */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
        <View style={[styles.searchBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Search size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search workouts..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity
          onPress={() => setShowFilters(true)}
          style={[styles.filterButton, { backgroundColor: colors.background, borderColor: colors.border }]}
        >
          <FilterIcon size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Active Filters */}
      <View style={styles.activeFilters}>
        <Text style={[styles.activeFilterText, { color: colors.textSecondary }]}>
          {getSortLabel(sortBy)} • {getFilterLabel(filterBy)}
        </Text>
        <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
          {filteredAndSortedWorkouts.length} workout{filteredAndSortedWorkouts.length !== 1 ? 's' : ''}
        </Text>
      </View>
      
      {/* Workout List */}
      <ScrollView style={styles.workoutList} showsVerticalScrollIndicator={false}>
        {filteredAndSortedWorkouts.length > 0 ? (
          filteredAndSortedWorkouts.map(renderWorkoutCard)
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>
              No workouts found
            </Text>
            <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
              {searchQuery.trim() ? 
                "Try adjusting your search or filters" : 
                "Start your fitness journey by completing your first workout!"
              }
            </Text>
            {!searchQuery.trim() && (
              <Button
                title="Browse Workouts"
                onPress={() => router.push('/workouts')}
                style={styles.browseButton}
              />
            )}
          </View>
        )}
      </ScrollView>
      
      {/* Development: Clear All Workouts Button */}
      {completedWorkouts.length > 0 && (
        <View style={[styles.bottomBackButtonContainer, { borderTopColor: colors.border, backgroundColor: '#ff000020' }]}>
          <Button
            title="🗑️ Clear All Workout History (DEV)"
            onPress={() => {
              clearAllWorkoutLogs();
              console.log('All workout logs cleared');
            }}
            variant="outline"
            style={{ minWidth: 100, borderColor: '#ff0000' }}
          />
        </View>
      )}

      {/* Back Button */}
      <View style={[styles.bottomBackButtonContainer, { borderTopColor: colors.border }]}>
        <Button
          title="← Back"
          onPress={() => router.back()}
          variant="secondary"
          style={styles.bottomBackButton}
        />
      </View>
      
      {/* Filter Modal */}
      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        statusBarTranslucent
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowFilters(false)}
        >
          <Pressable 
            style={[styles.filterModal, { backgroundColor: colors.card }]} 
            onPress={e => e.stopPropagation()}
          >
            <View style={styles.filterModalHeader}>
              <Text style={[styles.filterModalTitle, { color: colors.text }]}>Filter & Sort</Text>
              <TouchableOpacity 
                onPress={() => setShowFilters(false)}
                style={[styles.closeButton, { backgroundColor: colors.background }]}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Sort By</Text>
              {(['date-desc', 'date-asc', 'duration-desc', 'duration-asc', 'rating-desc', 'rating-asc'] as SortOption[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setSortBy(option)}
                  style={[
                    styles.filterOption,
                    { backgroundColor: sortBy === option ? colors.primary + '20' : 'transparent' }
                  ]}
                >
                  <Text style={[
                    styles.filterOptionText,
                    { color: sortBy === option ? colors.primary : colors.text }
                  ]}>
                    {getSortLabel(option)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.filterSection}>
              <Text style={[styles.filterSectionTitle, { color: colors.text }]}>Time Period</Text>
              {(['all', 'this-week', 'this-month', 'last-30-days', 'last-3-months'] as FilterOption[]).map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => setFilterBy(option)}
                  style={[
                    styles.filterOption,
                    { backgroundColor: filterBy === option ? colors.primary + '20' : 'transparent' }
                  ]}
                >
                  <Text style={[
                    styles.filterOptionText,
                    { color: filterBy === option ? colors.primary : colors.text }
                  ]}>
                    {getFilterLabel(option)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Button
              title="Apply Filters"
              onPress={() => setShowFilters(false)}
              style={styles.applyButton}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  statsPanel: {
    padding: 16,
    borderBottomWidth: 1,
  },
  statsPanelTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statsItem: {
    alignItems: 'center',
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  popularWorkout: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  popularWorkoutText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  filterButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  activeFilters: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  activeFilterText: {
    fontSize: 14,
  },
  resultCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  workoutList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  workoutCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  workoutDate: {
    fontSize: 14,
  },
  editButton: {
    padding: 8,
    borderRadius: 6,
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
  },
  workoutNotes: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    minWidth: 150,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  filterOption: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  filterOptionText: {
    fontSize: 16,
  },
  applyButton: {
    marginTop: 16,
  },
  bottomBackButtonContainer: {
    padding: 16,
    paddingTop: 8,
    borderTopWidth: 1,
  },
  bottomBackButton: {
    minWidth: 100,
  },
}); 