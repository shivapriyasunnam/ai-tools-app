import { colors, spacing } from '@/src/constants';
import { BudgetContext } from '@/src/context/BudgetContext';
import { useContext, useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

// Form component for adding/editing budgets
function BudgetForm({ onSubmit, onCancel, initialValues = {}, isEdit }) {
  const [category, setCategory] = useState(initialValues.category || '');
  const [limit, setLimit] = useState(initialValues.limit ? initialValues.limit.toString() : '');
  const [period, setPeriod] = useState(initialValues.period || 'monthly');
  const [selectedColor, setSelectedColor] = useState(initialValues.color || '#6366F1');

  const colorOptions = [
    '#6366F1', // Indigo
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#EF4444', // Red
    '#F59E0B', // Amber
    '#10B981', // Green
    '#3B82F6', // Blue
    '#14B8A6', // Teal
  ];

  const handleSubmit = () => {
    if (!category.trim()) {
      Alert.alert('Error', 'Please enter a category name');
      return;
    }
    if (!limit.trim() || isNaN(parseFloat(limit)) || parseFloat(limit) <= 0) {
      Alert.alert('Error', 'Please enter a valid budget limit');
      return;
    }

    onSubmit({
      ...initialValues,
      category: category.trim(),
      limit: parseFloat(limit),
      period,
      color: selectedColor,
    });

    if (!isEdit) {
      setCategory('');
      setLimit('');
      setPeriod('monthly');
      setSelectedColor('#6366F1');
    }
  };

  return (
    <View style={formStyles.formContainer}>
      <Text style={formStyles.formTitle}>{isEdit ? '✎ Edit Budget' : '➕ Add New Budget'}</Text>
      
      <TextInput
        placeholder="Category (e.g., Food, Transport) *"
        value={category}
        onChangeText={setCategory}
        style={formStyles.input}
        placeholderTextColor={colors.gray[400]}
      />

      <TextInput
        placeholder="Budget Limit ($) *"
        value={limit}
        onChangeText={setLimit}
        keyboardType="decimal-pad"
        style={formStyles.input}
        placeholderTextColor={colors.gray[400]}
      />

      {/* Period Selection */}
      <Text style={formStyles.label}>Period</Text>
      <View style={formStyles.optionsRow}>
        <TouchableOpacity
          style={[formStyles.optionButton, period === 'daily' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          onPress={() => setPeriod('daily')}
        >
          <Text style={[formStyles.optionText, period === 'daily' && { color: colors.white }]}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[formStyles.optionButton, period === 'weekly' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          onPress={() => setPeriod('weekly')}
        >
          <Text style={[formStyles.optionText, period === 'weekly' && { color: colors.white }]}>Weekly</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[formStyles.optionButton, period === 'monthly' && { backgroundColor: colors.primary, borderColor: colors.primary }]}
          onPress={() => setPeriod('monthly')}
        >
          <Text style={[formStyles.optionText, period === 'monthly' && { color: colors.white }]}>Monthly</Text>
        </TouchableOpacity>
      </View>

      {/* Color Selection */}
      <Text style={formStyles.label}>Color</Text>
      <View style={formStyles.colorRow}>
        {colorOptions.map(color => (
          <TouchableOpacity
            key={color}
            style={[
              formStyles.colorOption,
              { backgroundColor: color },
              selectedColor === color && formStyles.colorOptionSelected
            ]}
            onPress={() => setSelectedColor(color)}
          >
            {selectedColor === color && <Text style={formStyles.checkmark}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={formStyles.buttonRow}>
        <TouchableOpacity
          onPress={handleSubmit}
          style={[formStyles.button, { backgroundColor: colors.primary }]}
        >
          <Text style={formStyles.buttonText}>{isEdit ? 'Save Changes' : 'Add Budget'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          style={[formStyles.button, { backgroundColor: colors.gray[300], marginLeft: spacing.sm }]}
        >
          <Text style={[formStyles.buttonText, { color: colors.gray[700] }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const formStyles = StyleSheet.create({
  formContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
    color: colors.gray[900],
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[200],
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.gray[50],
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  optionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.gray[300],
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.gray[700],
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: colors.gray[900],
  },
  checkmark: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default function BudgetPlannerScreen() {
  const [mode, setMode] = useState('view'); // 'view', 'add', 'edit'
  const [editBudget, setEditBudget] = useState(null);

  const {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getBudgetStatus,
    getTotalBudget,
    getTotalSpent,
    getTotalRemaining,
  } = useContext(BudgetContext);

  const budgetStatus = getBudgetStatus();
  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpent();
  const totalRemaining = getTotalRemaining();

  const handleAddBudget = (budget) => {
    addBudget(budget);
    setMode('view');
    Alert.alert('Success', 'Budget added successfully!');
  };

  const handleEditBudget = (budget) => {
    setEditBudget(budget);
    setMode('edit');
  };

  const handleUpdateBudget = (updated) => {
    updateBudget(updated.id, updated);
    setEditBudget(null);
    setMode('view');
    Alert.alert('Success', 'Budget updated!');
  };

  const handleDeleteBudget = (id) => {
    Alert.alert(
      'Delete Budget',
      'Are you sure you want to delete this budget?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteBudget(id) },
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'exceeded': return colors.error;
      case 'warning': return '#F59E0B';
      case 'good': return colors.success;
      default: return colors.gray[400];
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        {mode === 'view' && (
          <View>
            <Text style={styles.title}>📊 Budget Planner</Text>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Budget (Monthly)</Text>
              <Text style={styles.summaryAmount}>${totalBudget.toFixed(2)}</Text>
              <View style={styles.summaryStats}>
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatLabel}>Spent</Text>
                  <Text style={styles.summaryStatValue}>${totalSpent.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryStatItem}>
                  <Text style={styles.summaryStatLabel}>Remaining</Text>
                  <Text style={[styles.summaryStatValue, totalRemaining < 0 && { color: '#FCA5A5' }]}>
                    ${totalRemaining.toFixed(2)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              onPress={() => setMode('add')}
              style={[styles.addButton, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.addButtonText}>➕ Add Budget Category</Text>
            </TouchableOpacity>

            {/* Budget List */}
            {budgetStatus.length > 0 ? (
              <View>
                <Text style={styles.listTitle}>📋 Budget Categories ({budgetStatus.length})</Text>
                {budgetStatus.map(budget => (
                  <View key={budget.id} style={styles.budgetItem}>
                    <View style={styles.budgetHeader}>
                      <View style={styles.budgetInfo}>
                        <View style={[styles.categoryDot, { backgroundColor: budget.color }]} />
                        <Text style={styles.budgetCategory}>{budget.category}</Text>
                      </View>
                      <Text style={[styles.budgetPercentage, { color: getStatusColor(budget.status) }]}>
                        {budget.percentage.toFixed(0)}%
                      </Text>
                    </View>
                    
                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                      <View 
                        style={[
                          styles.progressBar, 
                          { 
                            width: `${budget.percentage}%`,
                            backgroundColor: getStatusColor(budget.status)
                          }
                        ]} 
                      />
                    </View>

                    <View style={styles.budgetDetails}>
                      <Text style={styles.budgetDetailText}>
                        ${budget.spent.toFixed(2)} of ${budget.limit.toFixed(2)}
                      </Text>
                      <Text style={styles.budgetPeriod}>{budget.period}</Text>
                    </View>

                    {budget.remaining < 0 && (
                      <Text style={styles.exceededText}>
                        Over budget by ${Math.abs(budget.remaining).toFixed(2)}
                      </Text>
                    )}

                    <View style={styles.budgetActions}>
                      <TouchableOpacity onPress={() => handleEditBudget(budget)} style={styles.actionButton}>
                        <Text style={styles.editText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteBudget(budget.id)} style={styles.actionButton}>
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💰</Text>
                <Text style={styles.emptyText}>No budgets set yet</Text>
                <Text style={styles.emptySubtext}>Add your first budget category to start tracking</Text>
              </View>
            )}
          </View>
        )}

        {/* Add Budget Form */}
        {mode === 'add' && (
          <BudgetForm
            onSubmit={handleAddBudget}
            onCancel={() => setMode('view')}
          />
        )}

        {/* Edit Budget Form */}
        {mode === 'edit' && editBudget && (
          <BudgetForm
            onSubmit={handleUpdateBudget}
            onCancel={() => { setEditBudget(null); setMode('view'); }}
            initialValues={editBudget}
            isEdit
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
    backgroundColor: colors.accent,
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
    marginBottom: spacing.md,
  },
  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  summaryStatItem: {
    alignItems: 'center',
  },
  summaryStatLabel: {
    fontSize: 12,
    color: colors.gray[100],
    marginBottom: 4,
  },
  summaryStatValue: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.white,
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  addButton: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  addButtonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray[900],
    marginBottom: spacing.md,
  },
  budgetItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: spacing.sm,
  },
  budgetCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[900],
  },
  budgetPercentage: {
    fontSize: 16,
    fontWeight: '700',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.gray[200],
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  budgetDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  budgetDetailText: {
    fontSize: 13,
    color: colors.gray[600],
  },
  budgetPeriod: {
    fontSize: 12,
    color: colors.gray[500],
    textTransform: 'capitalize',
  },
  exceededText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.error,
    marginBottom: spacing.xs,
  },
  budgetActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray[100],
    paddingTop: spacing.sm,
  },
  actionButton: {
    paddingVertical: 4,
  },
  editText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  deleteText: {
    fontSize: 13,
    color: colors.error,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: spacing.sm,
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
    textAlign: 'center',
    paddingHorizontal: spacing.lg,
  },
});
