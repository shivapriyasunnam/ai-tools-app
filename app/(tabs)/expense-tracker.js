import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { colors, spacing } from '@/src/constants';
import { ExpenseContext } from '@/src/context/ExpenseContext';
import { useCSVParser } from '@/src/hooks/useCSVParser';
import { CSVUpload } from '@/src/components/CSVUpload';
import { ManualExpenseForm } from '@/src/components/ManualExpenseForm';
import { ExpensesList } from '@/src/components/ExpensesList';

export default function ExpenseTrackerScreen() {
  const [mode, setMode] = useState('view'); // 'view', 'manual', 'csv', 'edit'
  const [processingCSV, setProcessingCSV] = useState(false);
  const [filter, setFilter] = useState('');
  const [editExpense, setEditExpense] = useState(null);

  const { expenses, addExpense, addMultipleExpenses, deleteExpense, updateExpense, getTotal, getTotalByCategory } = useContext(ExpenseContext);
  const { parseCSV, error: parseError } = useCSVParser();

  const total = getTotal();
  const categoryTotals = getTotalByCategory();

  // Filtering logic
  const filteredExpenses = filter
    ? expenses.filter(e =>
        e.description.toLowerCase().includes(filter.toLowerCase()) ||
        e.category.toLowerCase().includes(filter.toLowerCase()) ||
        (e.date && e.date.includes(filter))
      )
    : expenses;

  const handleAddManualExpense = (expense) => {
    addExpense(expense);
    setMode('view');
    Alert.alert('Success', 'Expense added successfully!');
  };

  const handleEditExpense = (expense) => {
    setEditExpense(expense);
    setMode('edit');
  };

  const handleUpdateExpense = (updated) => {
    updateExpense(updated.id, updated);
    setEditExpense(null);
    setMode('view');
    Alert.alert('Success', 'Expense updated!');
  };

  const handleCSVImport = (csvText) => {
    setProcessingCSV(true);
    try {
      const parsedExpenses = parseCSV(csvText);
      if (parseError) {
        Alert.alert('Error', parseError);
        setProcessingCSV(false);
        return;
      }
      if (!parsedExpenses || parsedExpenses.length === 0) {
        Alert.alert('Error', 'No valid expenses found in CSV');
        setProcessingCSV(false);
        return;
      }
      addMultipleExpenses(parsedExpenses);
      Alert.alert('Success', `Imported ${parsedExpenses.length} expenses!`);
      setMode('view');
    } catch (err) {
      Alert.alert('Error', 'Failed to parse CSV: ' + err.message);
    } finally {
      setProcessingCSV(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        {mode === 'view' && (
          <View>
            <Text style={styles.title}>💰 Expense Tracker</Text>

            {/* Summary Cards */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Spent</Text>
              <Text style={styles.summaryAmount}>${total.toFixed(2)}</Text>
            </View>

            {/* Mode Selection */}
            <View style={styles.modeSelector}>
              <TouchableOpacity
                onPress={() => setMode('manual')}
                style={[styles.modeButton, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.modeButtonText}>➕ Add Manual</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setMode('csv')}
                style={[styles.modeButton, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.modeButtonText}>� Upload CSV</Text>
              </TouchableOpacity>
            </View>

            {/* Category Summary */}
            {Object.keys(categoryTotals).length > 0 && (
              <View style={styles.categorySummary}>
                <Text style={styles.categoryTitle}>📊 By Category</Text>
                {Object.entries(categoryTotals).map(([category, total]) => (
                  <View key={category} style={styles.categoryItem}>
                    <Text style={styles.categoryName}>{category}</Text>
                    <Text style={styles.categoryAmount}>${total.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Filter/Search Bar */}
            <View style={{ marginBottom: spacing.md }}>
              <TextInput
                placeholder="Search by description, category, or date..."
                value={filter}
                onChangeText={setFilter}
                style={{
                  backgroundColor: colors.gray[100],
                  borderRadius: 8,
                  padding: spacing.md,
                  fontSize: 14,
                  color: colors.text,
                }}
                placeholderTextColor={colors.gray[400]}
              />
            </View>

            {/* Expenses List */}
            {filteredExpenses.length > 0 && (
              <View>
                <Text style={styles.expensesTitle}>📝 Recent Expenses ({filteredExpenses.length})</Text>
                <ExpensesList
                  expenses={filteredExpenses}
                  onDeleteExpense={deleteExpense}
                  onEditExpense={handleEditExpense}
                />
              </View>
            )}

            {/* Empty State */}
            {filteredExpenses.length === 0 && (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💸</Text>
                <Text style={styles.emptyText}>No expenses found</Text>
                <Text style={styles.emptySubtext}>Try a different search or add a new expense</Text>
              </View>
            )}
          </View>
        )}


        {/* Manual Entry Mode */}
        {mode === 'manual' && (
          <ManualExpenseForm
            onExpenseAdded={handleAddManualExpense}
            onCancel={() => setMode('view')}
            loading={false}
          />
        )}

        {/* Edit Expense Mode */}
        {mode === 'edit' && editExpense && (
          <ManualExpenseForm
            onExpenseAdded={handleUpdateExpense}
            onCancel={() => { setEditExpense(null); setMode('view'); }}
            loading={false}
            initialValues={editExpense}
            isEdit
          />
        )}

        {/* CSV Upload Mode */}
        {mode === 'csv' && (
          <CSVUpload
            onExpensesLoaded={handleCSVImport}
            onCancel={() => setMode('view')}
            loading={processingCSV}
          />
        )}
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gray[900],
    marginBottom: spacing.lg,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.gray[100],
    marginBottom: spacing.sm,
  },
  summaryAmount: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.white,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  modeButton: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  modeButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  categorySummary: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.lg,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  categoryName: {
    fontSize: 13,
    color: colors.gray[700],
  },
  categoryAmount: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  expensesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.sm,
  },
  emptySubtext: {
    fontSize: 13,
    color: colors.gray[500],
  },
});
