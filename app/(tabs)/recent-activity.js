import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetContext } from '@/src/context/BudgetContext';
import { ExpenseContext } from '@/src/context/ExpenseContext';
import { IncomeContext } from '@/src/context/IncomeContext';
import { useQuickNotes } from '@/src/context/QuickNotesContext';
import { TodoContext } from '@/src/context/TodoContext';

function RecentActivityScreen() {
  const router = useRouter();
  const { expenses } = useContext(ExpenseContext);
  const { incomes } = useContext(IncomeContext);
  const { todos } = useContext(TodoContext);
  const { budgets } = useContext(BudgetContext);
  const { notes } = useQuickNotes();
  let sessions = [];
  try {
    const PomodoroContext = require('@/src/context/PomodoroContext').default || require('@/src/context/PomodoroContext');
    const pomodoroValue = useContext(PomodoroContext);
    sessions = pomodoroValue && pomodoroValue.sessions ? pomodoroValue.sessions : [];
  } catch (e) {
    sessions = [];
  }

  // Combine and sort all activities by date
  const allActivities = [
    ...expenses.map(exp => ({
      id: `exp-${exp.id}`,
      type: 'expense',
      title: exp.description,
      subtitle: exp.category,
      amount: -exp.amount,
      date: new Date(exp.date),
      icon: 'wallet',
      iconColor: '#EF4444',
      iconBg: '#FEE2E2',
    })),
    ...incomes.map(inc => ({
      id: `inc-${inc.id}`,
      type: 'income',
      title: inc.source,
      subtitle: inc.category || 'Income',
      amount: inc.amount,
      date: new Date(inc.date),
      icon: 'cash',
      iconColor: '#10B981',
      iconBg: '#D1FAE5',
    })),
    // Show both added and completed todos as separate activities, always display the task title
    ...todos.flatMap(todo => {
      const activities = [];
      if (todo.createdAt) {
        activities.push({
          id: `todo-added-${todo.id}`,
          type: 'todo-added',
          title: todo.title || todo.text || '(No Title)',
          subtitle: 'Task added',
          amount: null,
          date: new Date(todo.createdAt),
          icon: 'add-circle',
          iconColor: '#3B82F6',
          iconBg: '#DBEAFE',
        });
      }
      if (todo.completed && todo.completedAt) {
        activities.push({
          id: `todo-completed-${todo.id}`,
          type: 'todo-completed',
          title: todo.title || todo.text || '(No Title)',
          subtitle: 'Task completed',
          amount: null,
          date: new Date(todo.completedAt),
          icon: 'checkmark-circle',
          iconColor: '#8B5CF6',
          iconBg: '#EDE9FE',
        });
      }
      return activities;
    }),
    ...budgets.map(budget => ({
      id: `budget-${budget.id}`,
      type: 'budget',
      title: `Budgeted: ${budget.category}`,
      subtitle: `Limit $${budget.limit} (${budget.period})`,
      amount: null,
      date: budget.createdAt ? new Date(budget.createdAt) : new Date(),
      icon: 'pie-chart',
      iconColor: '#4ECDC4',
      iconBg: '#E0FCF9',
    })),
    ...(Array.isArray(sessions) ? sessions.filter(s => s.completed).map(session => ({
      id: `pomodoro-${session.id}`,
      type: 'pomodoro',
      title: 'Pomodoro Session',
      subtitle: session.type ? `${session.type.charAt(0).toUpperCase() + session.type.slice(1)} session` : 'Session',
      amount: null,
      date: session.end ? new Date(session.end) : new Date(),
      icon: 'timer',
      iconColor: '#E91E63',
      iconBg: '#FCE7F3',
    })) : []),
    // Quick Notes as activities
    ...notes.map(note => ({
      id: `note-${note.id}`,
      type: 'quick-note',
      title: note.text,
      subtitle: 'Quick Note added',
      amount: null,
      date: note.id ? new Date(Number(note.id)) : new Date(),
      icon: 'document-text',
      iconColor: '#6366F1',
      iconBg: '#E0E7FF',
    })),
  ].sort((a, b) => b.date - a.date);

  const formatDate = (date) => {
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
  };

  const groupActivitiesByDate = () => {
    const groups = {};
    allActivities.forEach(activity => {
      const date = activity.date;
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      
      let groupKey;
      if (activityDate.getTime() === today.getTime()) {
        groupKey = 'Today';
      } else if (activityDate.getTime() === yesterday.getTime()) {
        groupKey = 'Yesterday';
      } else if (now - date < 7 * 24 * 60 * 60 * 1000) {
        groupKey = 'This Week';
      } else if (now - date < 30 * 24 * 60 * 60 * 1000) {
        groupKey = 'This Month';
      } else {
        groupKey = 'Older';
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(activity);
    });
    
    return groups;
  };

  const groupedActivities = groupActivitiesByDate();
  const groupOrder = ['Today', 'Yesterday', 'This Week', 'This Month', 'Older'];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {allActivities.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="time-outline" size={64} color="#9CA3AF" />
            </View>
            <Text style={styles.emptyTitle}>No Recent Activity</Text>
            <Text style={styles.emptySubtitle}>
              Your recent expenses, income, and completed tasks will appear here
            </Text>
          </View>
        ) : (
          groupOrder.map(groupKey => {
            const activities = groupedActivities[groupKey];
            if (!activities || activities.length === 0) return null;
            
            return (
              <View key={groupKey} style={styles.section}>
                <Text style={styles.sectionTitle}>{groupKey}</Text>
                {activities.map(activity => {
                  // Navigation handler based on activity type
                  let onPress = undefined;
                  switch (activity.type) {
                    case 'expense':
                      onPress = () => router.push('/(tabs)/expense-tracker');
                      break;
                    case 'income':
                      onPress = () => router.push('/(tabs)/income-tracker');
                      break;
                    case 'todo-added':
                    case 'todo-completed':
                      onPress = () => router.push('/(tabs)/todo-list');
                      break;
                    case 'budget':
                      onPress = () => router.push('/(tabs)/budget-planner');
                      break;
                    case 'pomodoro':
                      onPress = () => router.push('/(tabs)/pomodoro-timer');
                      break;
                    default:
                      onPress = undefined;
                  }
                  return (
                    <TouchableOpacity
                      key={activity.id}
                      style={styles.activityCard}
                      onPress={onPress}
                      activeOpacity={onPress ? 0.7 : 1}
                      disabled={!onPress}
                    >
                      <View style={[styles.activityIcon, { backgroundColor: activity.iconBg }]}> 
                        <Ionicons name={activity.icon} size={24} color={activity.iconColor} />
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <Text style={styles.activitySubtitle}>
                          {activity.subtitle} • {formatDate(activity.date)}
                        </Text>
                      </View>
                      {activity.amount !== null && (
                        <Text style={[
                          styles.activityAmount,
                          { color: activity.amount < 0 ? '#EF4444' : '#10B981' }
                        ]}>
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
