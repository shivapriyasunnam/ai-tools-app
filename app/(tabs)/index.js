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

  const aiTools = [
    {
      id: 'expense-tracker',
      name: 'Expense Tracker',
      description: 'Track and analyze your expenses',
      icon: '💰',
      color: colors.secondary,
    },
    {
      id: 'budget-planner',
      name: 'Budget Planner',
      description: 'Plan and manage your budget',
      icon: '📊',
      color: colors.accent,
    },
    {
      id: 'meetings-scheduler',
      name: 'Meetings Scheduler',
      description: 'Schedule and organize meetings',
      icon: '📅',
      color: colors.primary,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* App Summary Bar */}
        <View style={styles.summaryBar}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>💰</Text>
              <View>
                <Text style={styles.summaryLabel}>Total Expenses</Text>
                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>📅</Text>
              <View>
                <Text style={styles.summaryLabel}>Upcoming Meetings</Text>
                <Text style={styles.summaryValue}>2 Today</Text>
              </View>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>📊</Text>
              <View>
                <Text style={styles.summaryLabel}>Budget Status</Text>
                <Text style={styles.summaryValue}>On Track</Text>
              </View>
            </View>

            <View style={styles.summaryItem}>
              <Text style={styles.summaryIcon}>✨</Text>
              <View>
                <Text style={styles.summaryLabel}>This Month</Text>
                <Text style={styles.summaryValue}>$2,450</Text>
              </View>
            </View>
          </View>
        </View>

                <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>AI Tools</Text>
            <Text style={styles.subtitle}>Your personal AI assistant hub</Text>
          </View>

          <View style={styles.toolsContainer}>
            {aiTools.map((tool) => (
              <Card
                key={tool.id}
                title={tool.name}
                description={tool.description}
                color={tool.color}
              >
                <Text style={styles.icon}>{tool.icon}</Text>
              </Card>
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>More tools coming soon...</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  summaryBar: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    flexDirection: 'column',
    gap: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  summaryItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  summaryIcon: {
    fontSize: 28,
    marginRight: spacing.xs,
  },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: colors.gray[200],
    marginHorizontal: spacing.md,
  },
  header: {
    marginBottom: spacing.xl,
    paddingVertical: spacing.md,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray[500],
  },
  toolsContainer: {
    marginBottom: spacing.lg,
  },
  icon: {
    fontSize: 32,
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  footerText: {
    fontSize: 14,
    color: colors.gray[400],
  },
});
