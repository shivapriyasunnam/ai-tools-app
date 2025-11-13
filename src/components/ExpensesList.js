import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, spacing } from '../constants';


export const ExpensesList = ({ expenses, onDeleteExpense, onEditExpense }) => {
  const renderExpense = ({ item }) => (
    <View style={styles.expenseItem}>
      <View style={styles.expenseInfo}>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.category}>📁 {item.category}</Text>
          <Text style={styles.date}>📅 {item.date}</Text>
        </View>
        {item.notes && <Text style={styles.notes}>📝 {item.notes}</Text>}
        {item.method === 'csv' && (
          <Text style={styles.method}>📤 From CSV</Text>
        )}
      </View>

      <View style={styles.expenseActions}>
        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
        <View style={{ flexDirection: 'row', gap: 4 }}>
          {onEditExpense && (
            <TouchableOpacity
              onPress={() => onEditExpense(item)}
              style={[styles.deleteButton, { backgroundColor: colors.accent + '20' }]}
            >
              <Text style={[styles.deleteText, { color: colors.accent }]}>✎</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => onDeleteExpense(item.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={expenses}
      keyExtractor={item => item.id.toString()}
      renderItem={renderExpense}
      scrollEnabled={false}
      ListEmptyComponent={
        <Text style={styles.emptyText}>
          No expenses yet. Add one to get started!
        </Text>
      }
    />
  );
};

const styles = StyleSheet.create({
  expenseItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  expenseInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  description: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  category: {
    fontSize: 12,
    color: colors.gray[600],
  },
  date: {
    fontSize: 12,
    color: colors.gray[600],
  },
  notes: {
    fontSize: 11,
    color: colors.gray[500],
    fontStyle: 'italic',
    marginTop: spacing.xs,
  },
  method: {
    fontSize: 10,
    color: colors.secondary,
    fontWeight: '500',
    marginTop: spacing.xs,
  },
  expenseActions: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  deleteButton: {
    padding: spacing.sm,
    backgroundColor: colors.error + '20',
    borderRadius: 6,
    minWidth: 32,
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: colors.error,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray[400],
    marginTop: spacing.lg,
    fontSize: 14,
  },
});
