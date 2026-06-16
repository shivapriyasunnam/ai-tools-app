import React, { useState, useContext, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors, spacing } from '@/src/constants';
import { ExpenseContext } from '@/src/context/ExpenseContext';
import { useHeaderAction } from '@/src/context/HeaderContext';
import { useTheme } from '@/src/context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCSVParser } from '@/src/hooks/useCSVParser';
import { CSVUpload } from '@/src/components/CSVUpload';
import { ManualExpenseForm } from '@/src/components/ManualExpenseForm';

const CATEGORY_COLORS = {
  Groceries: '#10b981',
  Transport: '#3b82f6',
  Entertainment: '#8b5cf6',
  Dining: '#f97316',
  Utilities: '#6b7280',
  Healthcare: '#ef4444',
  Shopping: '#ec4899',
  Other: '#9ca3af',
};

function getCurrentMonthKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function shiftMonth(monthKey, delta) {
  const [year, month] = monthKey.split('-').map(Number);
  const d = new Date(year, month - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function formatAmount(amount) {
  return `$${amount.toFixed(2)}`;
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

export default function ExpenseTrackerScreen() {
  const { theme } = useTheme();
  const { setRightAction } = useHeaderAction();
  const [mode, setMode] = useState('view'); // 'view' | 'add' | 'edit' | 'csv'
  const [editExpense, setEditExpense] = useState(null);
  const [processingCSV, setProcessingCSV] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());

  const {
    addExpense,
    addMultipleExpenses,
    deleteExpense,
    updateExpense,
    getExpensesByMonth,
    isLoading,
  } = useContext(ExpenseContext);
  const { parseCSV } = useCSVParser();

  const setModeRef = useRef(null);
  setModeRef.current = () => setMode('csv');

  useFocusEffect(
    useCallback(() => {
      setRightAction({
        onPress: () => setModeRef.current?.(),
        element: <MaterialCommunityIcons name="file-delimited-outline" size={24} color={theme.colors.textSecondary} />,
      });
      return () => setRightAction(null);
    }, [theme.colors.textSecondary])
  );

  const monthExpenses = [...(getExpensesByMonth(selectedMonth) || [])]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const monthTotal = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const isCurrentMonth = selectedMonth === getCurrentMonthKey();

  const handleAddExpense = async (expense) => {
    try {
      await addExpense(expense);
      setMode('view');
    } catch (err) {
      Alert.alert('Error', 'Failed to add expense: ' + err.message);
    }
  };

  const handleUpdateExpense = async (updated) => {
    try {
      await updateExpense(updated.id, updated);
      setEditExpense(null);
      setMode('view');
    } catch (err) {
      Alert.alert('Error', 'Failed to update expense: ' + err.message);
    }
  };

  const handleCSVImport = async (csvText) => {
    setProcessingCSV(true);
    try {
      const parsedExpenses = parseCSV(csvText);
      if (!parsedExpenses || parsedExpenses.length === 0) {
        Alert.alert('Error', 'No valid expenses found in CSV');
        return;
      }
      await addMultipleExpenses(parsedExpenses);
      Alert.alert('Success', `Imported ${parsedExpenses.length} expenses!`);
      setMode('view');
    } catch (err) {
      Alert.alert('Error', 'Failed to import CSV: ' + err.message);
    } finally {
      setProcessingCSV(false);
    }
  };

  function confirmDelete(expense) {
    Alert.alert('Delete Expense', `Delete "${expense.description}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteExpense(expense.id),
      },
    ]);
  }

  const renderExpense = ({ item }) => {
    const catColor = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;
    return (
      <TouchableOpacity
        style={[styles.expenseRow, { backgroundColor: theme.colors.surface }]}
        onPress={() => { setEditExpense(item); setMode('edit'); }}
        onLongPress={() => confirmDelete(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.catDot, { backgroundColor: catColor }]} />
        <View style={styles.expenseInfo}>
          <Text style={[styles.expenseTitle, { color: theme.colors.text }]} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={[styles.expenseMeta, { color: theme.colors.textSecondary }]}>
            {item.category} · {formatDateShort(item.date)}
          </Text>
          {item.notes ? (
            <Text style={[styles.expenseNotes, { color: theme.colors.textSecondary }]} numberOfLines={1}>
              {item.notes}
            </Text>
          ) : null}
        </View>
        <Text style={[styles.expenseAmount, { color: theme.colors.primary }]}>
          {formatAmount(item.amount)}
        </Text>
      </TouchableOpacity>
    );
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ManualExpenseForm
          onExpenseAdded={mode === 'edit' ? handleUpdateExpense : handleAddExpense}
          onCancel={() => { setEditExpense(null); setMode('view'); }}
          loading={false}
          initialValues={editExpense}
          isEdit={mode === 'edit'}
        />
      </SafeAreaView>
    );
  }

  if (mode === 'csv') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <CSVUpload
          onExpensesLoaded={handleCSVImport}
          onCancel={() => setMode('view')}
          loading={processingCSV}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Month Navigation */}
      <View style={[styles.monthBar, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity
          onPress={() => setSelectedMonth(shiftMonth(selectedMonth, -1))}
          style={styles.monthArrow}
        >
          <Text style={[styles.monthArrowText, { color: theme.colors.primary }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.monthLabel, { color: theme.colors.text }]}>
          {formatMonthLabel(selectedMonth)}
        </Text>
        <TouchableOpacity
          onPress={() => !isCurrentMonth && setSelectedMonth(shiftMonth(selectedMonth, 1))}
          style={[styles.monthArrow, isCurrentMonth && styles.monthArrowDisabled]}
          disabled={isCurrentMonth}
        >
          <Text style={[styles.monthArrowText, { color: isCurrentMonth ? theme.colors.textSecondary : theme.colors.primary }]}>
            ›
          </Text>
        </TouchableOpacity>
      </View>

      {/* Monthly Total Card */}
      <View style={[styles.totalCard, { backgroundColor: theme.colors.primary }]}>
        <Text style={styles.totalLabel}>Total this month</Text>
        <Text style={styles.totalAmount}>{formatAmount(monthTotal)}</Text>
      </View>

      {/* Content */}
      {isLoading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : monthExpenses.length === 0 ? (
        <View style={styles.centeredState}>
          <Text style={styles.emptyIcon}>💸</Text>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>No expenses</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            No expenses recorded for {formatMonthLabel(selectedMonth)}.
          </Text>
          <TouchableOpacity
            style={[styles.emptyAddButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => { setEditExpense(null); setMode('add'); }}
          >
            <Text style={styles.emptyAddButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={monthExpenses}
          keyExtractor={e => e.id.toString()}
          renderItem={renderExpense}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        onPress={() => { setEditExpense(null); setMode('add'); }}
        activeOpacity={0.85}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  monthBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  monthArrow: { padding: spacing.sm },
  monthArrowDisabled: { opacity: 0.3 },
  monthArrowText: { fontSize: 28, fontWeight: '600' },
  monthLabel: { fontSize: 17, fontWeight: '600' },
  totalCard: {
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  totalLabel: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
  totalAmount: { fontSize: 24, fontWeight: '700', color: '#fff' },
  list: { paddingHorizontal: spacing.md, paddingBottom: 90 },
  separator: { height: spacing.sm },
  expenseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  catDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm, flexShrink: 0 },
  expenseInfo: { flex: 1 },
  expenseTitle: { fontSize: 15, fontWeight: '600' },
  expenseMeta: { fontSize: 12, marginTop: 2 },
  expenseNotes: { fontSize: 11, marginTop: 2, fontStyle: 'italic' },
  expenseAmount: { fontSize: 15, fontWeight: '700', marginLeft: spacing.sm },
  centeredState: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyText: { fontSize: 16, fontWeight: '600', marginBottom: spacing.sm },
  emptySubtext: { fontSize: 13, textAlign: 'center', marginBottom: spacing.lg },
  emptyAddButton: { paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, borderRadius: 8 },
  emptyAddButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  fabIcon: { color: '#fff', fontSize: 32, fontWeight: '300', lineHeight: 36 },
});
