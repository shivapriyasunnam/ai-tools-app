import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BudgetContext } from '@/src/context/BudgetContext';
import { ExpenseContext } from '@/src/context/ExpenseContext';
import { GoalsContext } from '@/src/context/GoalsContext';
import { IncomeContext } from '@/src/context/IncomeContext';
import { useMeetings } from '@/src/context/MeetingsContext';
import { useQuickNotes } from '@/src/context/QuickNotesContext';
import { TodoContext } from '@/src/context/TodoContext';
import { useAuth } from '@/src/context/AuthContext';
import { useUser } from '@/src/context/UserContext';
import { useTheme } from '@/src/context/ThemeContext';
import usePomodoroStats from '@/src/hooks/usePomodoroStats';

function formatDate(date) {
  // Always use local time
  const now = new Date();
  const d = new Date(date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const activityDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  if (activityDate.getTime() === today.getTime()) {
    return `Today, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else if (activityDate.getTime() === yesterday.getTime()) {
    return `Yesterday, ${d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
  } else {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  }
}

function HomeScreen() {
  const router = useRouter();
  const { theme } = useTheme();

  const { expenses, getTotal } = useContext(ExpenseContext);
  const { incomes, getTotalIncome } = useContext(IncomeContext);
  const { todos, getTotalTodos, getCompletedCount, getPendingCount } = useContext(TodoContext);
  const { getActiveGoalsCount } = useContext(GoalsContext);
  const { getTotalBudget, getTotalSpent, getTotalRemaining, getBudgetStatus } = useContext(BudgetContext);
  const { notes } = useQuickNotes();
  const { userName } = useUser();
  const { session } = useAuth();
  const { getTodayMeetings, getWeekMeetings } = useMeetings();
  const total = getTotal();
  const income = getTotalIncome();
  const { totalSessions, totalFocusedHours } = usePomodoroStats();
  const totalTodos = getTotalTodos();
  const completedTodos = getCompletedCount();
  const pendingTodos = getPendingCount();
  
  // Get meetings data
  const todayMeetings = getTodayMeetings();
  const weekMeetings = getWeekMeetings();
  const todayMeetingsCount = todayMeetings.length;
  const remainingWeekMeetings = weekMeetings.length - todayMeetingsCount;

  // Combine all activities and get last 3
  // Budgeting activities: creation, edit, delete (using createdAt for now)
  const { budgets } = useContext(BudgetContext);
  let sessions = [];
  try {
    // Import PomodoroContext directly
    const PomodoroContext = require('@/src/context/PomodoroContext').default || require('@/src/context/PomodoroContext');
    const pomodoroValue = useContext(PomodoroContext);
    sessions = pomodoroValue && pomodoroValue.sessions ? pomodoroValue.sessions : [];
  } catch (e) {
    sessions = [];
  }

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
      title: inc.description || inc.source || 'Income',
      subtitle: inc.category || 'Income',
      amount: inc.amount,
      date: new Date(inc.date),
      icon: 'cash',
      iconColor: '#10B981',
      iconBg: '#D1FAE5',
    })),
    // Show both added and completed todos as activities, always display the task title
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
      date: note.created_at ? new Date(note.created_at) : new Date(),
      icon: 'document-text',
      iconColor: '#6366F1',
      iconBg: '#E0E7FF',
    })),
  ].sort((a, b) => b.date - a.date).slice(0, 3);
  
  // Budget data
  const totalBudget = getTotalBudget();
  const totalBudgetSpent = getTotalSpent();
  const totalBudgetRemaining = getTotalRemaining();
  const budgetStatus = getBudgetStatus();
  const budgetUtilization = totalBudget > 0 ? (totalBudgetSpent / totalBudget) * 100 : 0;
  
  // Get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';
    return 'Good Night';
  };
  
  const [financialMenuVisible, setFinancialMenuVisible] = useState(false);
  const [widgetsTooltipVisible, setWidgetsTooltipVisible] = useState(false);

  const handleAddExpense = () => {
    router.push('/(tabs)/expense-tracker');
  };
  
  const handleBudgetPlan = () => {
    router.push('/(tabs)/budget-planner');
  };
  
  const handleSchedule = () => {
    router.push('/(tabs)/meetings-scheduler');
  };
  
  const handlePomodoro = () => {
    router.push('/(tabs)/pomodoro-timer');
  };

  const getGreetingFontSize = () => {
    const greetingLength = `${getGreeting()}${userName ? `, ${userName}` : ''}!`.length;
    if (greetingLength > 28) return 22;
    if (greetingLength > 22) return 26;
    if (greetingLength > 16) return 28;
    return 32;
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <Text style={[styles.title, { color: theme.colors.text, fontSize: getGreetingFontSize() }]} numberOfLines={1} adjustsFontSizeToFit>
              {getGreeting()}{userName ? `, ${userName}` : ''}!
            </Text>
          </View>
          <TouchableOpacity style={[styles.profileIcon, { backgroundColor: theme.colors.primary }]} onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.profileText}>
              {userName
                ? userName.charAt(0).toUpperCase()
                : session?.user?.email?.charAt(0).toUpperCase() ?? 'P'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Stats Overview */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Today's Overview</Text>
          <TouchableOpacity
            style={styles.sparkleButton}
            onPress={() => setWidgetsTooltipVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="sparkles" size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        <Modal
          transparent
          visible={widgetsTooltipVisible}
          animationType="fade"
          onRequestClose={() => setWidgetsTooltipVisible(false)}
        >
          <Pressable style={styles.tooltipOverlay} onPress={() => setWidgetsTooltipVisible(false)}>
            <View style={[styles.tooltipBubble, { backgroundColor: theme.colors.surface }]}>
              <Ionicons name="sparkles" size={18} color={theme.colors.primary} style={{ marginBottom: 6 }} />
              <Text style={[styles.tooltipText, { color: theme.colors.text }]}>
                Did you know you can add widgets of d.ai.ly functions to your home screen?
              </Text>
            </View>
          </Pressable>
        </Modal>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={[styles.statCardLarge, { backgroundColor: theme.colors.surface }]} onPress={() => router.push('/(tabs)/meetings-scheduler')} activeOpacity={0.7}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.statCardIcon}>📅</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>Today</Text>
              </View>
            </View>
            <Text style={[styles.statCardValue, { color: theme.colors.text }]}>{todayMeetingsCount}</Text>
            <Text style={[styles.statCardLabel, { color: theme.colors.text }]}>Meetings Scheduled</Text>
            <Text style={styles.statCardSubtext}>
              {remainingWeekMeetings > 0 ? `${remainingWeekMeetings} more this week` : 'No more meetings this week'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statCardLarge, { backgroundColor: theme.colors.surface }]} onPress={() => router.push('/(tabs)/pomodoro-timer')} activeOpacity={0.7}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FCE7F3' }]}>
                <Text style={styles.statCardIcon}>⏱️</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.statBadgeText, { color: '#92400E' }]}>Active</Text>
              </View>
            </View>
            <Text style={[styles.statCardValue, { color: theme.colors.text }]}>{totalSessions}</Text>
            <Text style={[styles.statCardLabel, { color: theme.colors.text }]}>Pomodoro Sessions</Text>
            <Text style={styles.statCardSubtext}>{totalFocusedHours} focused</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.statsContainer}>
          <TouchableOpacity style={[styles.statCardLarge, { backgroundColor: theme.colors.surface }]} onPress={() => router.push('/(tabs)/todo-list')} activeOpacity={0.7}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: '#F3E8FF' }]}>
                <Text style={styles.statCardIcon}>✅</Text>
              </View>
            </View>
            <Text style={[styles.statCardValue, { color: theme.colors.text }]}>{completedTodos}/{totalTodos}</Text>
            <Text style={[styles.statCardLabel, { color: theme.colors.text }]}>Tasks</Text>
            <Text style={styles.statCardSubtext}>
              {completedTodos === 0
                ? 'No tasks completed yet'
                : `${completedTodos} completed${pendingTodos > 0 ? `, ${pendingTodos} pending` : ''}`
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.statCardLarge, { backgroundColor: theme.colors.surface }]} onPress={() => router.push('/(tabs)/goals')} activeOpacity={0.7}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: '#EDE9FE' }]}>
                <Ionicons name="flag-outline" size={22} color="#7C3AED" />
              </View>
            </View>
            <Text style={[styles.statCardValue, { color: theme.colors.text }]}>{getActiveGoalsCount()}</Text>
            <Text style={[styles.statCardLabel, { color: theme.colors.text }]}>Active Goals</Text>
            <Text style={styles.statCardSubtext}>Tap to manage goals</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Overview Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Financial Overview</Text>
          <Text style={[styles.financialSubtitleOutside, { color: theme.colors.textSecondary }]}>This month</Text>
        </View>

        {/* Financial Overview Card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => setFinancialMenuVisible(true)}
        >
        <View style={[styles.financialCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceContainer}>
              <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>Total Balance</Text>
              <Text style={[styles.balanceAmount, { color: theme.colors.text }]}>${(income - total).toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[styles.addExpenseButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => router.push('/(tabs)/expense-tracker?mode=add')}
              activeOpacity={0.7}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.financialStats}>
            <View style={styles.financialStatItem}>
              <View style={[styles.statDot, { backgroundColor: '#10B981' }]} />
              <Text style={[styles.statItemLabel, { color: theme.colors.textSecondary }]}>Income</Text>
              <Text style={[styles.statItemValue, { color: theme.colors.text }]}>${income.toFixed(2)}</Text>
            </View>
            <View style={styles.financialStatItem}>
              <View style={[styles.statDot, { backgroundColor: '#EF4444' }]} />
              <Text style={[styles.statItemLabel, { color: theme.colors.textSecondary }]}>Expenses</Text>
              <Text style={[styles.statItemValue, { color: theme.colors.text }]}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Budget Analysis Section */}
          {totalBudget > 0 && (
            <>
              <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
              
              <View style={styles.budgetAnalysisHeader}>
                <Text style={[styles.budgetAnalysisTitle, { color: theme.colors.text }]}>Budget Analysis</Text>
                <View style={[
                  styles.budgetStatusBadge,
                  { backgroundColor: budgetUtilization >= 100 ? '#FEE2E2' : budgetUtilization >= 80 ? '#FEF3C7' : '#D1FAE5' }
                ]}>
                  <Text style={[
                    styles.budgetStatusText,
                    { color: budgetUtilization >= 100 ? '#991B1B' : budgetUtilization >= 80 ? '#92400E' : '#065F46' }
                  ]}>
                    {budgetUtilization >= 100 ? 'Over Budget' : budgetUtilization >= 80 ? 'Warning' : 'On Track'}
                  </Text>
                </View>
              </View>

              <View style={styles.budgetProgressContainer}>
                <View style={styles.budgetProgressBar}>
                  <View 
                    style={[
                      styles.budgetProgressFill,
                      { 
                        width: `${Math.min(budgetUtilization, 100)}%`,
                        backgroundColor: budgetUtilization >= 100 ? '#EF4444' : budgetUtilization >= 80 ? '#F59E0B' : '#10B981'
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.budgetProgressText}>
                  {budgetUtilization >= 100
                    ? `${(budgetUtilization - 100).toFixed(0)}% over budget`
                    : `${budgetUtilization.toFixed(0)}% of budget used`}
                </Text>
              </View>

              <View style={styles.budgetStatsRow}>
                <View style={styles.budgetStatItem}>
                  <Text style={[styles.budgetStatLabel, { color: theme.colors.textSecondary }]}>Budget</Text>
                  <Text style={[styles.budgetStatValue, { color: theme.colors.text }]}>${totalBudget.toFixed(2)}</Text>
                </View>
                <View style={styles.budgetStatItem}>
                  <Text style={[styles.budgetStatLabel, { color: theme.colors.textSecondary }]}>Spent</Text>
                  <Text style={[styles.budgetStatValue, { color: '#EF4444' }]}>
                    ${totalBudgetSpent.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.budgetStatItem}>
                  <Text style={[styles.budgetStatLabel, { color: theme.colors.textSecondary }]}>Remaining</Text>
                  <Text style={[
                    styles.budgetStatValue,
                    { color: theme.colors.text },
                    { color: totalBudgetRemaining < 0 ? '#EF4444' : '#10B981' }
                  ]}>
                    ${totalBudgetRemaining.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Top Budget Categories */}
              {budgetStatus.length > 0 && (
                <View style={styles.topCategoriesContainer}>
                  <Text style={[styles.topCategoriesTitle, { color: theme.colors.text }]}>Top Categories</Text>
                  {[...budgetStatus]
                    .filter(b => b.spent > 0)
                    .sort((a, b) => b.spent - a.spent)
                    .slice(0, 3)
                    .map((budget) => (
                    <View key={budget.id} style={[styles.categoryBudgetRow, { backgroundColor: theme.colors.gray[50] }]}>
                      <View style={styles.categoryBudgetInfo}>
                        <View style={[styles.categoryColorDot, { backgroundColor: budget.color }]} />
                        <Text style={[styles.categoryBudgetName, { color: theme.colors.text }]}>{budget.category}</Text>
                      </View>
                      <View style={styles.categoryBudgetProgress}>
                        <Text style={[
                          styles.categoryBudgetPercentage,
                          { color: budget.status === 'exceeded' ? '#EF4444' : budget.status === 'warning' ? '#F59E0B' : '#6B7280' }
                        ]}>
                          {budget.limit > 0 ? `${budget.percentage.toFixed(0)}%` : `$${budget.spent.toFixed(2)}`}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>
        </TouchableOpacity>

        {/* Financial Navigation Menu */}
        <Modal
          transparent
          visible={financialMenuVisible}
          animationType="fade"
          onRequestClose={() => setFinancialMenuVisible(false)}
        >
          <Pressable style={styles.menuOverlay} onPress={() => setFinancialMenuVisible(false)}>
            <View style={[styles.menuCard, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.menuTitle, { color: theme.colors.textSecondary }]}>Go to</Text>
              {[
                { label: 'Expense', icon: 'wallet-outline', color: '#EF4444', bg: '#FEE2E2', route: '/(tabs)/expense-tracker' },
                { label: 'Budgets', icon: 'pie-chart-outline', color: theme.colors.primary, bg: theme.colors.primary + '20', route: '/(tabs)/budget-planner' },
                { label: 'Income', icon: 'cash-outline', color: '#10B981', bg: '#D1FAE5', route: '/(tabs)/income-tracker' },
              ].map((item, index, arr) => (
                <TouchableOpacity
                  key={item.label}
                  style={[styles.menuItem, index === arr.length - 1 && { borderBottomWidth: 0 }, { borderBottomColor: theme.colors.border }]}
                  activeOpacity={0.7}
                  onPress={() => {
                    setFinancialMenuVisible(false);
                    router.push(item.route);
                  }}
                >
                  <View style={[styles.menuItemIcon, { backgroundColor: item.bg }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={[styles.menuItemLabel, { color: theme.colors.text }]}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>

        {/* Quick Actions Grid */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Quick Actions</Text>
        </View>
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionCardUnified, { backgroundColor: '#FEF3C7' }]}
            onPress={handleAddExpense}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconUnified, { backgroundColor: '#F59E0B' }]}> 
              <Text style={styles.actionEmojiUnified}>💰</Text>
            </View>
            <Text style={[styles.actionLabelUnified, { color: '#1F2937' }]}>Add Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCardUnified, { backgroundColor: '#DBEAFE' }]}
            onPress={handleBudgetPlan}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconUnified, { backgroundColor: '#3B82F6' }]}>
              <Text style={styles.actionEmojiUnified}>📊</Text>
            </View>
            <Text style={[styles.actionLabelUnified, { color: '#1F2937' }]}>Budget Plan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCardUnified, { backgroundColor: '#E0E7FF' }]}
            onPress={handleSchedule}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconUnified, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.actionEmojiUnified}>📅</Text>
            </View>
            <Text style={[styles.actionLabelUnified, { color: '#1F2937' }]}>Schedule</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCardUnified, { backgroundColor: '#FCE7F3' }]}
            onPress={handlePomodoro}
            activeOpacity={0.7}
          >
            <View style={[styles.actionIconUnified, { backgroundColor: '#EC4899' }]}>
              <Text style={styles.actionEmojiUnified}>⏱️</Text>
            </View>
            <Text style={[styles.actionLabelUnified, { color: '#1F2937' }]}>Pomodoro</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Activity</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/recent-activity')}>
            <Text style={[styles.sectionLink, { color: theme.colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>
        {allActivities.length === 0 ? (
          <View style={[styles.activityCard, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.activityIcon, { backgroundColor: theme.colors.gray[100] }]}>
              <Ionicons name="time-outline" size={24} color={theme.colors.textSecondary} />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: theme.colors.text }]}>No recent activity</Text>
              <Text style={[styles.activitySubtitle, { color: theme.colors.textSecondary }]}>Your activities will appear here</Text>
            </View>
          </View>
        ) : (
          allActivities.map(activity => {
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
                  <Text style={[
                    styles.activityAmount,
                    { color: activity.amount < 0 ? '#EF4444' : '#10B981' }
                  ]}>
                    {activity.amount < 0 ? '-' : '+'}${Math.abs(activity.amount).toFixed(2)}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingContainer: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  profileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Financial Card
  financialCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  financialHeader: {
    marginBottom: 20,
  },
  financialTitle: {
  fontSize: 18,
  fontWeight: '600',
  color: '#222',
  marginBottom: 4,
  },
  financialSubtitle: {
  fontSize: 14,
  color: '#888',
  },
  financialSubtitleOutside: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  addExpenseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceContainer: {},
  balanceLabel: {
  fontSize: 14,
  color: '#888',
  marginBottom: 8,
  },
  balanceAmount: {
  fontSize: 36,
  fontWeight: '700',
  color: '#222',
  letterSpacing: -1,
  },
  financialStats: {
    flexDirection: 'row',
    gap: 20,
  },
  financialStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statItemLabel: {
  fontSize: 12,
  color: '#888',
  flex: 1,
  },
  statItemValue: {
  fontSize: 16,
  fontWeight: '600',
  color: '#222',
  },

  // Section Headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.3,
  },
  sparkleButton: {
    padding: 4,
  },
  tooltipOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  tooltipBubble: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    alignItems: 'center',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  tooltipText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 21,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366F1',
  },

  // Quick Actions Grid
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionCardUnified: {
    flex: 1,
    borderRadius: 18,
    minHeight: 125,
    alignItems: 'center',
    justifyContent: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    marginBottom: 0,
    paddingTop: 18,
  },
  actionIconUnified: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionEmojiUnified: {
    fontSize: 22,
  },
  actionLabelUnified: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginTop: 4,
  },

  // Large Stat Cards
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCardLarge: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardIcon: {
    fontSize: 22,
  },
  statBadge: {
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
  },
  statCardValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
    letterSpacing: -0.8,
  },
  statCardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 4,
  },
  statCardSubtext: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Mini Cards (2 column)
  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  miniCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  miniCardIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  miniCardEmoji: {
    fontSize: 26,
  },
  miniCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  miniCardLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6B7280',
  },

  // Activity Cards
  activityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityEmoji: {
    fontSize: 24,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  activitySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF4444',
  },
  activityTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activityBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
  },
  
  // Budget Analysis Styles
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 20,
  },
  budgetAnalysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  budgetAnalysisTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  budgetStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  budgetStatusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  budgetProgressContainer: {
    marginBottom: 20,
  },
  budgetProgressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  budgetProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  budgetProgressText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  budgetStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  budgetStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  budgetStatLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  budgetStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  topCategoriesContainer: {
    marginTop: 8,
  },
  topCategoriesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  categoryBudgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 8,
  },
  categoryBudgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  categoryColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryBudgetName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  categoryBudgetProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBudgetPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Financial Navigation Menu
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuItemLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
});
