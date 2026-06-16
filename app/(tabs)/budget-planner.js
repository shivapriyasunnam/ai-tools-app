import { colors, spacing } from '@/src/constants';
import { BudgetContext } from '@/src/context/BudgetContext';
import { useHeaderAction } from '@/src/context/HeaderContext';
import { useTheme } from '@/src/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { useCallback, useContext, useRef, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const COLOR_OPTIONS = [
  '#6366F1', '#8B5CF6', '#EC4899', '#EF4444',
  '#F59E0B', '#10B981', '#3B82F6', '#14B8A6',
  '#F97316', '#06B6D4', '#84CC16', '#A855F7',
];

function currentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function addMonths(yyyyMM, n) {
  const [year, month] = yyyyMM.split('-').map(Number);
  const d = new Date(year, month - 1 + n, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function formatMonth(yyyyMM) {
  const [year, month] = yyyyMM.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleString('default', { month: 'long', year: 'numeric' });
}

function ColorPicker({ selected, onSelect }) {
  const { theme } = useTheme();
  return (
    <View style={pickerStyles.row}>
      {COLOR_OPTIONS.map(c => (
        <TouchableOpacity
          key={c}
          style={[pickerStyles.swatch, { backgroundColor: c }, selected === c && pickerStyles.swatchSelected]}
          onPress={() => onSelect(c)}>
          {selected === c && <Text style={pickerStyles.checkmark}>✓</Text>}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const pickerStyles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  swatch: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  swatchSelected: { borderColor: colors.gray[900] },
  checkmark: { color: colors.white, fontSize: 16, fontWeight: '700' },
});

export default function BudgetPlannerScreen() {
  const { theme } = useTheme();
  const { setRightAction } = useHeaderAction();
  const {
    budgets,
    addBudget,
    updateBudget,
    deleteBudget,
    getTotalBudget,
    getBudgetStatusForMonth,
    getCategorySpendForMonth,
    getTotalSpentForMonth,
    getUnbudgetedForMonth,
  } = useContext(BudgetContext);

  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [editingBudget, setEditingBudget] = useState(null);
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editAmount, setEditAmount] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editColor, setEditColor] = useState(COLOR_OPTIONS[0]);
  const [editPeriod, setEditPeriod] = useState('monthly');

  // Keep a stable ref so the header action always calls the latest openNewCategory
  const openNewCategoryRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setRightAction({
        onPress: () => openNewCategoryRef.current?.(),
        element: <Ionicons name="add-circle-outline" size={24} color={theme.colors.primary} />,
      });
      return () => setRightAction(null);
    }, [theme.colors.primary])
  );

  const isCurrentMonth = selectedMonth === currentMonth();
  const budgetStatus = [...getBudgetStatusForMonth(selectedMonth)].sort((a, b) => {
    const tier = (row) => row.limit > 0 ? 0 : row.spent > 0 ? 1 : 2;
    return tier(a) - tier(b);
  });
  const totalBudget = getTotalBudget();
  const totalSpent = getTotalSpentForMonth(selectedMonth);
  const remaining = totalBudget - totalSpent;
  const unbudgetedCategories = getUnbudgetedForMonth(selectedMonth);

  function openEdit(row) {
    setEditingBudget(row);
    setEditAmount(row.limit > 0 ? row.limit.toString() : '');
    setEditCategoryName(row.category);
    setEditColor(row.color || COLOR_OPTIONS[0]);
    setEditPeriod(row.period || 'monthly');
  }

  function openNewCategory(prefillName = '') {
    setCreatingCategory(true);
    setEditCategoryName(prefillName);
    setEditAmount('');
    setEditColor(COLOR_OPTIONS[0]);
    setEditPeriod('monthly');
  }

  async function saveEdit() {
    if (!editingBudget) return;
    if (!editCategoryName.trim()) {
      Alert.alert('Required', 'Please enter a category name.');
      return;
    }
    const limit = parseFloat(editAmount);
    if (isNaN(limit) || limit <= 0) {
      Alert.alert('Invalid', 'Enter a valid budget amount.');
      return;
    }
    setSaving(true);
    try {
      await updateBudget(editingBudget.id, {
        category: editCategoryName.trim(),
        limit,
        color: editColor,
        period: editPeriod,
      });
      setEditingBudget(null);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!editingBudget) return;
    Alert.alert(
      'Delete Category',
      `Delete budget for "${editingBudget.category}"? This will not remove existing expenses.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive', onPress: async () => {
            setSaving(true);
            try {
              await deleteBudget(editingBudget.id);
              setEditingBudget(null);
            } finally {
              setSaving(false);
            }
          },
        },
      ]
    );
  }

  async function saveNewCategory() {
    if (!editCategoryName.trim()) {
      Alert.alert('Required', 'Please enter a category name.');
      return;
    }
    const limit = parseFloat(editAmount);
    if (isNaN(limit) || limit <= 0) {
      Alert.alert('Invalid', 'Enter a valid budget amount.');
      return;
    }
    setSaving(true);
    try {
      await addBudget({
        category: editCategoryName.trim(),
        limit,
        period: editPeriod,
        color: editColor,
      });
      setCreatingCategory(false);
    } finally {
      setSaving(false);
    }
  }

  // Keep ref in sync so the header button always calls the latest function
  openNewCategoryRef.current = openNewCategory;

  function getStatusColor(status) {
    if (status === 'exceeded') return colors.error;
    if (status === 'warning') return colors.warning;
    return colors.success;
  }

  const s = makeStyles(theme);

  return (
    <SafeAreaView style={s.container}>
      {/* Month Navigation Bar */}
      <View style={s.monthBar}>
        <TouchableOpacity onPress={() => setSelectedMonth(m => addMonths(m, -1))} style={s.monthArrow}>
          <Text style={s.monthArrowText}>‹</Text>
        </TouchableOpacity>
        <Text style={s.monthLabel}>{formatMonth(selectedMonth)}</Text>
        <TouchableOpacity
          onPress={() => !isCurrentMonth && setSelectedMonth(m => addMonths(m, 1))}
          style={s.monthArrow}
          disabled={isCurrentMonth}>
          <Text style={[s.monthArrowText, isCurrentMonth && s.monthArrowDisabled]}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content}>
        {/* Summary Cards */}
        <View style={s.summaryRow}>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Total Budget</Text>
            <Text style={s.summaryAmount}>${totalBudget.toFixed(2)}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Spent</Text>
            <Text style={[s.summaryAmount, { color: colors.error }]}>${totalSpent.toFixed(2)}</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>Remaining</Text>
            <Text style={[s.summaryAmount, { color: remaining >= 0 ? colors.success : colors.error }]}>
              ${Math.abs(remaining).toFixed(2)}{remaining < 0 ? ' over' : ''}
            </Text>
          </View>
        </View>

        {/* Budget Rows */}
        {budgetStatus.length === 0 ? (
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>💰</Text>
            <Text style={s.emptyText}>No budgets set yet</Text>
            <Text style={s.emptySubtext}>Tap + to add a budget category</Text>
          </View>
        ) : (
          budgetStatus.map(row => (
            <TouchableOpacity key={row.id} onPress={() => openEdit(row)} activeOpacity={0.7}>
              <View style={[s.budgetCard, row.status === 'exceeded' && s.overBudgetCard]}>
                <View style={s.budgetHeader}>
                  <View style={s.budgetLeft}>
                    <View style={[s.catDot, { backgroundColor: row.color || theme.colors.primary }]} />
                    <Text style={s.budgetCatName}>{row.category}</Text>
                  </View>
                  <View style={s.budgetRight}>
                    {row.limit > 0 ? (
                      <>
                        <Text style={s.budgetSpent}>${row.spent.toFixed(2)}</Text>
                        <Text style={s.budgetOf}> / ${row.limit.toFixed(2)}</Text>
                      </>
                    ) : row.spent > 0 ? (
                      <Text style={s.budgetSpent}>${row.spent.toFixed(2)} spent</Text>
                    ) : (
                      <Text style={s.noBudget}>No budget set</Text>
                    )}
                  </View>
                </View>
                {row.limit > 0 ? (
                  <>
                    <View style={s.progressRow}>
                      <View style={s.progressBarContainer}>
                        <View style={[s.progressBar, { width: `${row.percentage}%`, backgroundColor: getStatusColor(row.status) }]} />
                      </View>
                      <Text style={s.percentText}>{Math.round(row.percentage)}%</Text>
                    </View>
                    {row.status === 'exceeded' && (
                      <Text style={s.overBudgetText}>
                        Over budget by ${Math.abs(row.remaining).toFixed(2)}
                      </Text>
                    )}
                  </>
                ) : row.spent > 0 && (
                  <Text style={s.noBudget}>No budget set — tap to add a limit</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Unbudgeted Categories */}
        {unbudgetedCategories.length > 0 && (
          <View style={s.unbudgetedContainer}>
            <Text style={s.unbudgetedTitle}>No Budget Set</Text>
            {unbudgetedCategories.map(cat => {
              const spent = getCategorySpendForMonth(cat, selectedMonth);
              return (
                <View key={cat} style={s.unbudgetedItem}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.unbudgetedCategory}>{cat}</Text>
                    <Text style={s.unbudgetedMessage}>Expenses present but no budget set</Text>
                  </View>
                  <View style={s.unbudgetedRight}>
                    <Text style={s.unbudgetedSpent}>${spent.toFixed(2)}</Text>
                    <TouchableOpacity
                      style={[s.setBudgetButton, { backgroundColor: theme.colors.primary }]}
                      onPress={() => openNewCategory(cat)}>
                      <Text style={s.setBudgetButtonText}>Set Budget</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Edit Budget Modal */}
      <Modal
        visible={!!editingBudget}
        transparent
        animationType="fade"
        onRequestClose={() => setEditingBudget(null)}>
        <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={s.modalBox}>
            <View style={s.modalHeader}>
              <View style={[s.catDot, { backgroundColor: editingBudget?.color || theme.colors.primary }]} />
              <Text style={s.modalTitle}>{editingBudget?.category}</Text>
            </View>
            <Text style={s.modalSubtitle}>Set budget for {formatMonth(selectedMonth)}</Text>
            <View style={s.divider} />

            <Text style={s.inputLabel}>Budget Amount</Text>
            <TextInput
              style={s.input}
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.gray[400]}
              autoFocus
            />

            <Text style={s.inputLabel}>Category Name</Text>
            <TextInput
              style={s.input}
              value={editCategoryName}
              onChangeText={setEditCategoryName}
              placeholder="Category name"
              placeholderTextColor={colors.gray[400]}
            />

            <Text style={s.inputLabel}>Period</Text>
            <View style={s.periodRow}>
              {['daily', 'weekly', 'monthly'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[s.periodBtn, editPeriod === p && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
                  onPress={() => setEditPeriod(p)}>
                  <Text style={[s.periodBtnText, editPeriod === p && { color: colors.white }]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.inputLabel}>Category Color</Text>
            <ColorPicker selected={editColor} onSelect={setEditColor} />

            <View style={s.modalButtons}>
              <TouchableOpacity onPress={() => setEditingBudget(null)} style={[s.modalBtn, s.cancelBtn]}>
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={[s.modalBtn, s.deleteBtn]} disabled={saving}>
                <Text style={s.modalBtnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveEdit} style={[s.modalBtn, { backgroundColor: theme.colors.primary }]} disabled={saving}>
                <Text style={s.modalBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* New Category Modal */}
      <Modal
        visible={creatingCategory}
        transparent
        animationType="fade"
        onRequestClose={() => setCreatingCategory(false)}>
        <KeyboardAvoidingView style={s.overlay} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={s.modalBox}>
            <Text style={s.modalTitle}>New Category</Text>
            <Text style={s.modalSubtitle}>Create a new budget category</Text>
            <View style={s.divider} />

            <Text style={s.inputLabel}>Category Name</Text>
            <TextInput
              style={s.input}
              value={editCategoryName}
              onChangeText={setEditCategoryName}
              placeholder="e.g. Groceries, Transport"
              placeholderTextColor={colors.gray[400]}
              autoFocus
            />

            <Text style={s.inputLabel}>Budget Amount</Text>
            <TextInput
              style={s.input}
              value={editAmount}
              onChangeText={setEditAmount}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.gray[400]}
            />

            <Text style={s.inputLabel}>Period</Text>
            <View style={s.periodRow}>
              {['daily', 'weekly', 'monthly'].map(p => (
                <TouchableOpacity
                  key={p}
                  style={[s.periodBtn, editPeriod === p && { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }]}
                  onPress={() => setEditPeriod(p)}>
                  <Text style={[s.periodBtnText, editPeriod === p && { color: colors.white }]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.inputLabel}>Category Color</Text>
            <ColorPicker selected={editColor} onSelect={setEditColor} />

            <View style={s.modalButtons}>
              <TouchableOpacity onPress={() => setCreatingCategory(false)} style={[s.modalBtn, s.cancelBtn]}>
                <Text style={s.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveNewCategory} style={[s.modalBtn, { backgroundColor: theme.colors.primary }]} disabled={saving}>
                <Text style={s.modalBtnText}>{saving ? 'Saving…' : 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function makeStyles(theme) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },

    // Month bar
    monthBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.gray[200],
    },
    monthArrow: { padding: spacing.sm },
    monthArrowText: { fontSize: 26, color: theme.colors.primary, fontWeight: '600' },
    monthArrowDisabled: { color: colors.gray[300] },
    monthLabel: { fontSize: 17, fontWeight: '600', color: theme.colors.text },

    content: { padding: spacing.md, paddingBottom: spacing.xl },

    // Summary
    summaryRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
    summaryCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: spacing.sm,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    summaryLabel: { fontSize: 11, color: theme.colors.textSecondary, marginBottom: 4, textAlign: 'center' },
    summaryAmount: { fontSize: 15, fontWeight: '700', color: theme.colors.text, textAlign: 'center' },

    // Budget cards
    budgetCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: spacing.md,
      marginBottom: spacing.sm,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    overBudgetCard: { borderLeftWidth: 3, borderLeftColor: colors.error },
    budgetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
    budgetLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    catDot: { width: 10, height: 10, borderRadius: 5, marginRight: spacing.sm },
    budgetCatName: { fontSize: 15, fontWeight: '600', color: theme.colors.text },
    budgetRight: { flexDirection: 'row', alignItems: 'center' },
    budgetSpent: { fontSize: 14, fontWeight: '600', color: theme.colors.text },
    budgetOf: { fontSize: 13, color: theme.colors.textSecondary },
    noBudget: { fontSize: 13, color: theme.colors.textSecondary, fontStyle: 'italic' },
    progressRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    progressBarContainer: { flex: 1, height: 8, backgroundColor: colors.gray[200], borderRadius: 4, overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: 4 },
    percentText: { fontSize: 12, color: theme.colors.textSecondary, width: 34, textAlign: 'right' },
    overBudgetText: { fontSize: 12, fontWeight: '600', color: colors.error, marginTop: spacing.xs },

    // Empty state
    emptyState: {
      alignItems: 'center',
      paddingVertical: spacing.xl,
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
    },
    emptyIcon: { fontSize: 48, marginBottom: spacing.md },
    emptyText: { fontSize: 16, fontWeight: '600', color: theme.colors.text, marginBottom: spacing.xs },
    emptySubtext: { fontSize: 13, color: theme.colors.textSecondary },

    // Unbudgeted
    unbudgetedContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: 10,
      padding: spacing.md,
      marginTop: spacing.sm,
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    unbudgetedTitle: { fontSize: 14, fontWeight: '600', color: theme.colors.text, marginBottom: spacing.sm },
    unbudgetedItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      borderTopWidth: 1,
      borderTopColor: colors.gray[100],
      paddingVertical: spacing.sm,
      gap: spacing.md,
    },
    unbudgetedCategory: { fontSize: 13, fontWeight: '600', color: theme.colors.text, marginBottom: 2 },
    unbudgetedMessage: { fontSize: 12, color: theme.colors.textSecondary },
    unbudgetedRight: { alignItems: 'flex-end', gap: spacing.xs },
    unbudgetedSpent: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
    setBudgetButton: { paddingVertical: 5, paddingHorizontal: spacing.sm, borderRadius: 6 },
    setBudgetButtonText: { fontSize: 12, fontWeight: '600', color: colors.white },

    // Modal
    overlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      padding: spacing.lg,
    },
    modalBox: {
      backgroundColor: theme.colors.surface,
      borderRadius: 16,
      padding: spacing.lg,
    },
    modalHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.xs },
    modalTitle: { fontSize: 18, fontWeight: '700', color: theme.colors.text },
    modalSubtitle: { fontSize: 13, color: theme.colors.textSecondary, marginBottom: spacing.xs },
    divider: { height: 1, backgroundColor: colors.gray[200], marginVertical: spacing.sm },
    inputLabel: { fontSize: 13, fontWeight: '600', color: theme.colors.text, marginBottom: spacing.xs },
    input: {
      borderWidth: 1,
      borderColor: colors.gray[200],
      borderRadius: 8,
      padding: spacing.sm,
      marginBottom: spacing.md,
      fontSize: 14,
      color: theme.colors.text,
      backgroundColor: colors.gray[50],
    },
    periodRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
    periodBtn: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: colors.gray[300],
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
    },
    periodBtnText: { fontSize: 13, fontWeight: '600', color: theme.colors.text },
    modalButtons: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.xs },
    modalBtn: { flex: 1, padding: spacing.sm, borderRadius: 8, alignItems: 'center' },
    cancelBtn: { backgroundColor: colors.gray[200] },
    cancelBtnText: { fontSize: 14, fontWeight: '600', color: colors.gray[700] },
    deleteBtn: { backgroundColor: colors.error },
    modalBtnText: { fontSize: 14, fontWeight: '600', color: colors.white },
  });
}
