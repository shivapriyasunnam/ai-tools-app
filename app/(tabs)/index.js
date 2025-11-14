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
import { TodoContext } from '@/src/context/TodoContext';
import usePomodoroStats from '@/src/hooks/usePomodoroStats';

function HomeScreen() {
  const router = useRouter();
  const { expenses, getTotal } = useContext(ExpenseContext);
  const { getTotalIncome } = useContext(require('@/src/context/IncomeContext').IncomeContext);
  const { getTotalTodos, getCompletedCount, getPendingCount } = useContext(TodoContext);
  const { getTotalBudget, getTotalSpent, getTotalRemaining, getBudgetStatus } = useContext(BudgetContext);
  const total = getTotal();
  const income = getTotalIncome();
  const { totalSessions, totalFocusedHours } = usePomodoroStats();
  const totalTodos = getTotalTodos();
  const completedTodos = getCompletedCount();
  const pendingTodos = getPendingCount();
  const recentExpenses = expenses.slice(0, 3);
  
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
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{getGreeting()}!</Text>
          </View>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>P</Text>
          </View>
        </View>

        {/* Stats Overview */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statCardLarge}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: '#DBEAFE' }]}>
                <Text style={styles.statCardIcon}>📅</Text>
              </View>
              <View style={styles.statBadge}>
                <Text style={styles.statBadgeText}>Today</Text>
              </View>
            </View>
            <Text style={styles.statCardValue}>2</Text>
            <Text style={styles.statCardLabel}>Meetings Scheduled</Text>
            <Text style={styles.statCardSubtext}>5 more this week</Text>
          </View>

          <View style={styles.statCardLarge}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FCE7F3' }]}>
                <Text style={styles.statCardIcon}>⏱️</Text>
              </View>
              <View style={[styles.statBadge, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.statBadgeText, { color: '#92400E' }]}>Active</Text>
              </View>
            </View>
            <Text style={styles.statCardValue}>{totalSessions}</Text>
            <Text style={styles.statCardLabel}>Pomodoro Sessions</Text>
            <Text style={styles.statCardSubtext}>{totalFocusedHours} focused</Text>
          </View>
        </View>


        <View style={styles.statsContainer}>
          <View style={styles.statCardLarge}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: '#F3E8FF' }]}> 
                <Text style={styles.statCardIcon}>✅</Text>
              </View>
            </View>
            <Text style={styles.statCardValue}>{completedTodos}/{totalTodos}</Text>
            <Text style={styles.statCardLabel}>Tasks</Text>
            <Text style={styles.statCardSubtext}>
              {completedTodos === 0 
                ? 'No tasks completed yet' 
                : `${completedTodos} completed${pendingTodos > 0 ? `, ${pendingTodos} pending` : ''}`
              }
            </Text>
          </View>

          {/* Reminders Card */}
          <View style={styles.statCardLarge}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: '#FEF3C7' }]}> 
                <Text style={styles.statCardIcon}>⏰</Text>
              </View>
            </View>
            <Text style={styles.statCardValue}>3</Text>
            <Text style={styles.statCardLabel}>Reminders</Text>
            <Text style={styles.statCardSubtext}>Don't forget!</Text>
          </View>
        </View>

        {/* Financial Overview Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Financial Overview</Text>
          <Text style={styles.financialSubtitleOutside}>This month</Text>
        </View>
        
        {/* Financial Overview Card */}
        <View style={styles.financialCard}>
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>${(income - total).toFixed(2)}</Text>
          </View>

          <View style={styles.financialStats}>
            <View style={styles.financialStatItem}>
              <View style={[styles.statDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statItemLabel}>Income</Text>
              <Text style={styles.statItemValue}>${income.toFixed(2)}</Text>
            </View>
            <View style={styles.financialStatItem}>
              <View style={[styles.statDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.statItemLabel}>Expenses</Text>
              <Text style={styles.statItemValue}>${total.toFixed(2)}</Text>
            </View>
          </View>

          {/* Budget Analysis Section */}
          {totalBudget > 0 && (
            <>
              <View style={styles.divider} />
              
              <View style={styles.budgetAnalysisHeader}>
                <Text style={styles.budgetAnalysisTitle}>Budget Analysis</Text>
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
                  {budgetUtilization.toFixed(0)}% of budget used
                </Text>
              </View>

              <View style={styles.budgetStatsRow}>
                <View style={styles.budgetStatItem}>
                  <Text style={styles.budgetStatLabel}>Budget</Text>
                  <Text style={styles.budgetStatValue}>${totalBudget.toFixed(2)}</Text>
                </View>
                <View style={styles.budgetStatItem}>
                  <Text style={styles.budgetStatLabel}>Spent</Text>
                  <Text style={[styles.budgetStatValue, { color: '#EF4444' }]}>
                    ${totalBudgetSpent.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.budgetStatItem}>
                  <Text style={styles.budgetStatLabel}>Remaining</Text>
                  <Text style={[
                    styles.budgetStatValue,
                    { color: totalBudgetRemaining < 0 ? '#EF4444' : '#10B981' }
                  ]}>
                    ${totalBudgetRemaining.toFixed(2)}
                  </Text>
                </View>
              </View>

              {/* Top Budget Categories */}
              {budgetStatus.length > 0 && (
                <View style={styles.topCategoriesContainer}>
                  <Text style={styles.topCategoriesTitle}>Top Categories</Text>
                  {budgetStatus.slice(0, 3).map((budget) => (
                    <View key={budget.id} style={styles.categoryBudgetRow}>
                      <View style={styles.categoryBudgetInfo}>
                        <View style={[styles.categoryColorDot, { backgroundColor: budget.color }]} />
                        <Text style={styles.categoryBudgetName}>{budget.category}</Text>
                      </View>
                      <View style={styles.categoryBudgetProgress}>
                        <Text style={[
                          styles.categoryBudgetPercentage,
                          { color: budget.status === 'exceeded' ? '#EF4444' : budget.status === 'warning' ? '#F59E0B' : '#6B7280' }
                        ]}>
                          {budget.percentage.toFixed(0)}%
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
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
            <Text style={styles.actionLabelUnified}>Add Expense</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCardUnified, { backgroundColor: '#DBEAFE' }]}
            onPress={handleBudgetPlan}
            activeOpacity={0.7}
          > 
            <View style={[styles.actionIconUnified, { backgroundColor: '#3B82F6' }]}> 
              <Text style={styles.actionEmojiUnified}>📊</Text>
            </View>
            <Text style={styles.actionLabelUnified}>Budget Plan</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCardUnified, { backgroundColor: '#E0E7FF' }]}
            onPress={handleSchedule}
            activeOpacity={0.7}
          > 
            <View style={[styles.actionIconUnified, { backgroundColor: '#6366F1' }]}> 
              <Text style={styles.actionEmojiUnified}>📅</Text>
            </View>
            <Text style={styles.actionLabelUnified}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionCardUnified, { backgroundColor: '#FCE7F3' }]}
            onPress={handlePomodoro}
            activeOpacity={0.7}
          > 
            <View style={[styles.actionIconUnified, { backgroundColor: '#EC4899' }]}> 
              <Text style={styles.actionEmojiUnified}>⏱️</Text>
            </View>
            <Text style={styles.actionLabelUnified}>Pomodoro</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        {recentExpenses.length === 0 ? (
          <View style={styles.activityCard}>
            <View style={[styles.activityIcon, { backgroundColor: '#F3F4F6' }]}> 
              <Text style={styles.activityEmoji}>💸</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>No recent expenses</Text>
              <Text style={styles.activitySubtitle}>Add an expense to see activity</Text>
            </View>
          </View>
        ) : (
          recentExpenses.map(exp => (
            <View key={exp.id} style={styles.activityCard}>
              <View style={[styles.activityIcon, { backgroundColor: '#DCFCE7' }]}> 
                <Text style={styles.activityEmoji}>💸</Text>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{exp.description}</Text>
                <Text style={styles.activitySubtitle}>{exp.category} • {exp.date}</Text>
              </View>
              <Text style={styles.activityAmount}>-${exp.amount.toFixed(2)}</Text>
            </View>
          ))
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
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
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
  balanceContainer: {
    marginBottom: 20,
  },
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
});
