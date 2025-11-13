import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/src/constants';
import { ExpenseContext } from '@/src/context/ExpenseContext';

export default function HomeScreen() {
  const { getTotal } = useContext(ExpenseContext);
  const total = getTotal();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.title}>Dashboard</Text>
          </View>
          <View style={styles.profileIcon}>
            <Text style={styles.profileText}>PA</Text>
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
            <Text style={styles.statCardValue}>12</Text>
            <Text style={styles.statCardLabel}>Pomodoro Sessions</Text>
            <Text style={styles.statCardSubtext}>6 hours focused time</Text>
          </View>
        </View>


        <View style={styles.statsContainer}>
          <View style={styles.statCardLarge}>
            <View style={styles.statCardHeader}>
              <View style={[styles.statIconCircle, { backgroundColor: '#F3E8FF' }]}> 
                <Text style={styles.statCardIcon}>✅</Text>
              </View>
            </View>
            <Text style={styles.statCardValue}>8/15</Text>
            <Text style={styles.statCardLabel}>Tasks</Text>
            <Text style={styles.statCardSubtext}>5 completed today</Text>
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

        {/* Financial Overview Card */}
        <View style={styles.financialCard}>
          <View style={styles.financialHeader}>
            <Text style={styles.financialTitle}>Financial Overview</Text>
            <Text style={styles.financialSubtitle}>This month</Text>
          </View>
          
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Total Balance</Text>
            <Text style={styles.balanceAmount}>${(2450 - total).toFixed(2)}</Text>
          </View>

          <View style={styles.financialStats}>
            <View style={styles.financialStatItem}>
              <View style={[styles.statDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.statItemLabel}>Income</Text>
              <Text style={styles.statItemValue}>$2,450</Text>
            </View>
            <View style={styles.financialStatItem}>
              <View style={[styles.statDot, { backgroundColor: '#EF4444' }]} />
              <Text style={styles.statItemLabel}>Expenses</Text>
              <Text style={styles.statItemValue}>${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={styles.actionsRow}>
          <View style={[styles.actionCardUnified, { backgroundColor: '#FEF3C7' }]}> 
            <View style={[styles.actionIconUnified, { backgroundColor: '#F59E0B' }]}> 
              <Text style={styles.actionEmojiUnified}>💰</Text>
            </View>
            <Text style={styles.actionLabelUnified}>Add Expense</Text>
          </View>
          <View style={[styles.actionCardUnified, { backgroundColor: '#DBEAFE' }]}> 
            <View style={[styles.actionIconUnified, { backgroundColor: '#3B82F6' }]}> 
              <Text style={styles.actionEmojiUnified}>📊</Text>
            </View>
            <Text style={styles.actionLabelUnified}>Budget Plan</Text>
          </View>
          <View style={[styles.actionCardUnified, { backgroundColor: '#E0E7FF' }]}> 
            <View style={[styles.actionIconUnified, { backgroundColor: '#6366F1' }]}> 
              <Text style={styles.actionEmojiUnified}>📅</Text>
            </View>
            <Text style={styles.actionLabelUnified}>Schedule</Text>
          </View>
          <View style={[styles.actionCardUnified, { backgroundColor: '#FCE7F3' }]}> 
            <View style={[styles.actionIconUnified, { backgroundColor: '#EC4899' }]}> 
              <Text style={styles.actionEmojiUnified}>⏱️</Text>
            </View>
            <Text style={styles.actionLabelUnified}>Pomodoro</Text>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.sectionLink}>See all</Text>
        </View>
        
        <View style={styles.activityCard}>
          <View style={[styles.activityIcon, { backgroundColor: '#DCFCE7' }]}>
            <Text style={styles.activityEmoji}>💸</Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Expense Added</Text>
            <Text style={styles.activitySubtitle}>Groceries • 2 hours ago</Text>
          </View>
          <Text style={styles.activityAmount}>-$52.40</Text>
        </View>

        <View style={styles.activityCard}>
          <View style={[styles.activityIcon, { backgroundColor: '#E0E7FF' }]}>
            <Text style={styles.activityEmoji}>📅</Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Meeting Scheduled</Text>
            <Text style={styles.activitySubtitle}>Team sync • Tomorrow 10 AM</Text>
          </View>
          <View style={styles.activityBadge}>
            <Text style={styles.activityBadgeText}>New</Text>
          </View>
        </View>

        <View style={styles.activityCard}>
          <View style={[styles.activityIcon, { backgroundColor: '#FCE7F3' }]}>
            <Text style={styles.activityEmoji}>⏱️</Text>
          </View>
          <View style={styles.activityContent}>
            <Text style={styles.activityTitle}>Pomodoro Completed</Text>
            <Text style={styles.activitySubtitle}>Focus session • 1 hour ago</Text>
          </View>
          <Text style={styles.activityTime}>25m</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    marginTop: 12,
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
});
