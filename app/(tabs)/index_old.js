import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '@/src/constants';
import { Card } from '@/src/components/ui';
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
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Your productivity overview</Text>
        </View>

        {/* Main Summary Card with All Stats */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrapper}>
                <Text style={styles.summaryIcon}>💰</Text>
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Total Expenses</Text>
                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrapper}>
                <Text style={styles.summaryIcon}>📅</Text>
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Upcoming Meetings</Text>
                <Text style={styles.summaryValue}>2 Today</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrapper}>
                <Text style={styles.summaryIcon}>�</Text>
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Budget Status</Text>
                <Text style={styles.summaryValue}>On Track</Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrapper}>
                <Text style={styles.summaryIcon}>✨</Text>
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>This Month</Text>
                <Text style={styles.summaryValue}>$2,450</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrapper}>
                <Text style={styles.summaryIcon}>⏱️</Text>
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Pomodoros</Text>
                <Text style={styles.summaryValue}>12 Today</Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrapper}>
                <Text style={styles.summaryIcon}>🔔</Text>
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Reminders</Text>
                <Text style={styles.summaryValue}>3 Pending</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrapper}>
                <Text style={styles.summaryIcon}>✅</Text>
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Tasks</Text>
                <Text style={styles.summaryValue}>8/15</Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <View style={styles.summaryIconWrapper}>
                <Text style={styles.summaryIcon}>📝</Text>
              </View>
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summaryLabel}>Quick Notes</Text>
                <Text style={styles.summaryValue}>7 Notes</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
          
          <View style={styles.insightCard}>
            <View style={styles.insightIconContainer}>
              <Text style={styles.insightIcon}>📈</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Spending Trend</Text>
              <Text style={styles.insightText}>You're spending 15% less than last month. Great job!</Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightIconContainer}>
              <Text style={styles.insightIcon}>🎯</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Productivity</Text>
              <Text style={styles.insightText}>You've completed 12 pomodoro sessions today. Keep it up!</Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View style={styles.insightIconContainer}>
              <Text style={styles.insightIcon}>📝</Text>
            </View>
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Tasks</Text>
              <Text style={styles.insightText}>7 tasks remaining for today. You're on track!</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 20,
    paddingTop: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#8E8E93',
    fontWeight: '400',
  },
  summaryCard: {
    backgroundColor: '#6366F1',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 20,
  },
  summaryItem: {
    flex: 1,
    gap: 12,
  },
  summaryIconWrapper: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryIcon: {
    fontSize: 28,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 6,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  insightsSection: {
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  insightIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightIcon: {
    fontSize: 28,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  insightText: {
    fontSize: 14,
    color: '#6E6E73',
    lineHeight: 20,
    fontWeight: '400',
  },
});
