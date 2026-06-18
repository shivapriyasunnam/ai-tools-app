import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTheme } from '@/src/context/ThemeContext';
import useAllActivities from '@/src/hooks/useAllActivities';

function getOnPress(router, type) {
  switch (type) {
    case 'expense':      return () => router.push('/(tabs)/expense-tracker');
    case 'income':       return () => router.push('/(tabs)/income-tracker');
    case 'todo-added':
    case 'todo-completed': return () => router.push('/(tabs)/todo-list');
    case 'budget':       return () => router.push('/(tabs)/budget-planner');
    case 'pomodoro':     return () => router.push('/(tabs)/pomodoro-timer');
    case 'goal-added':
    case 'goal-completed':
    case 'plan-added':   return () => router.push('/(tabs)/goals');
    default:             return undefined;
  }
}

function formatDate(date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (activityDate.getTime() === today.getTime()) {
    return `Today, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (activityDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
}

function groupByDate(activities) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups = {};
  activities.forEach(activity => {
    const d = activity.date;
    const activityDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    let key;
    if (activityDate.getTime() === today.getTime()) {
      key = 'Today';
    } else if (activityDate.getTime() === yesterday.getTime()) {
      key = 'Yesterday';
    } else if (now - d < 7 * 24 * 60 * 60 * 1000) {
      key = 'This Week';
    } else if (now - d < 30 * 24 * 60 * 60 * 1000) {
      key = 'This Month';
    } else {
      key = 'Older';
    }
    if (!groups[key]) groups[key] = [];
    groups[key].push(activity);
  });
  return groups;
}

const GROUP_ORDER = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older'];

function RecentActivityScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const allActivities = useAllActivities();
  const groupedActivities = groupByDate(allActivities);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {allActivities.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconContainer, { backgroundColor: theme.colors.gray[100] }]}>
              <Ionicons name="time-outline" size={64} color={theme.colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>No Recent Activity</Text>
            <Text style={[styles.emptySubtitle, { color: theme.colors.textSecondary }]}>
              Your recent expenses, income, and completed tasks will appear here
            </Text>
          </View>
        ) : (
          GROUP_ORDER.map(groupKey => {
            const activities = groupedActivities[groupKey];
            if (!activities || activities.length === 0) return null;
            return (
              <View key={groupKey} style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{groupKey}</Text>
                {activities.map(activity => {
                  const onPress = getOnPress(router, activity.type);
                  return (
                    <TouchableOpacity
                      key={activity.id}
                      style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}
                      onPress={onPress}
                      activeOpacity={onPress ? 0.7 : 1}
                      disabled={!onPress}
                    >
                      <View style={[styles.activityIcon, { backgroundColor: activity.iconBg }]}>
                        <Ionicons name={activity.icon} size={24} color={activity.iconColor} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={[styles.activityTitle, { color: theme.colors.text }]}>{activity.title}</Text>
                        <Text style={[styles.activitySubtitle, { color: theme.colors.textSecondary }]}>
                          {activity.subtitle} • {formatDate(activity.date)}
                        </Text>
                      </View>
                      {activity.amount !== null && (
                        <Text style={[styles.activityAmount, { color: activity.amount < 0 ? '#EF4444' : '#10B981' }]}>
                          {activity.amount < 0 ? '-' : '+'}${Math.abs(activity.amount).toFixed(2)}
                        </Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default RecentActivityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
});
