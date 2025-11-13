import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { colors, spacing } from '@/src/constants';
import { Card } from '@/src/components/ui';

export default function HomeScreen() {
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
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
    padding: spacing.md,
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
