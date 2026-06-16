import { colors, spacing } from '@/src/constants';
import { IncomeContext } from '@/src/context/IncomeContext';
import { useTheme } from '@/src/context/ThemeContext';
import { useContext, useState } from 'react';
import {
    Alert,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

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

function IncomeForm({ onSubmit, onCancel, initialValues = {}, loading, isEdit }) {
  const [description, setDescription] = useState(initialValues.description || '');
  const [amount, setAmount] = useState(initialValues.amount ? initialValues.amount.toString() : '');
  const now = new Date();
  const pad = n => n.toString().padStart(2, '0');
  const initialDateObj = initialValues.date ? new Date(initialValues.date) : now;
  const localYear = initialDateObj.getFullYear();
  const localMonth = pad(initialDateObj.getMonth() + 1);
  const localDay = pad(initialDateObj.getDate());
  const [date, setDate] = useState(`${localYear}-${localMonth}-${localDay}`);
  const [notes, setNotes] = useState(initialValues.notes || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    const [y, m, d] = date.split('-').map(Number);
    const isoDate = new Date(y, m - 1, d).toISOString();
    setSubmitting(true);
    try {
      await onSubmit({
        ...initialValues,
        description: description.trim(),
        amount: parseFloat(amount),
        date: isoDate,
        notes,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={formStyles.formContainer}>
      <Text style={formStyles.formTitle}>{isEdit ? 'Edit Income' : 'Add Income'}</Text>
      <TextInput
        placeholder="Description *"
        value={description}
        onChangeText={setDescription}
        style={formStyles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Amount ($) *"
        value={amount}
        onChangeText={setAmount}
        keyboardType="decimal-pad"
        style={formStyles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
        style={formStyles.input}
        placeholderTextColor="#aaa"
      />
      <TextInput
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        style={[formStyles.input, { minHeight: 60 }]}
        placeholderTextColor="#aaa"
        multiline
      />
      <View style={formStyles.buttonRow}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting || loading}
          style={[formStyles.button, { backgroundColor: colors.accent, opacity: (submitting || loading) ? 0.6 : 1 }]}
        >
          <Text style={formStyles.buttonText}>{submitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Income'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          disabled={submitting || loading}
          style={[formStyles.button, { backgroundColor: colors.gray[300], marginLeft: 8 }]}
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
    margin: spacing.md,
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
  buttonRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  button: {
    flex: 1,
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default function IncomeTrackerScreen() {
  const { theme } = useTheme();
  const [mode, setMode] = useState('view'); // 'view', 'add', 'edit'
  const [editIncome, setEditIncome] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());

  const { incomes, addIncome, deleteIncome, updateIncome, getIncomesByMonth } = useContext(IncomeContext);

  const isCurrentMonth = selectedMonth === getCurrentMonthKey();
  const monthIncomes = [...(getIncomesByMonth(selectedMonth) || [])].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const monthTotal = monthIncomes.reduce((sum, i) => sum + i.amount, 0);

  const handleAddIncome = async (income) => {
    try {
      await addIncome(income);
      setMode('view');
      Alert.alert('Success', 'Income added successfully!');
    } catch (err) {
      Alert.alert('Error', 'Failed to add income: ' + err.message);
    }
  };

  const handleUpdateIncome = async (updated) => {
    try {
      await updateIncome(updated.id, updated);
      setEditIncome(null);
      setMode('view');
      Alert.alert('Success', 'Income updated!');
    } catch (err) {
      Alert.alert('Error', 'Failed to update income: ' + err.message);
    }
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <IncomeForm
          onSubmit={mode === 'edit' ? handleUpdateIncome : handleAddIncome}
          onCancel={() => { setEditIncome(null); setMode('view'); }}
          loading={false}
          initialValues={editIncome}
          isEdit={mode === 'edit'}
        />
      </SafeAreaView>
    );
  }

  const renderIncome = ({ item }) => (
    <View style={[styles.incomeRow, { backgroundColor: theme.colors.surface }]}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.description, { color: theme.colors.text }]}>{item.description}</Text>
        <Text style={[styles.meta, { color: theme.colors.textSecondary }]}>
          {new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
        </Text>
        {item.notes ? <Text style={[styles.notes, { color: theme.colors.textSecondary }]}>{item.notes}</Text> : null}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text style={styles.amount}>${item.amount.toFixed(2)}</Text>
        <View style={{ flexDirection: 'row', marginTop: spacing.xs }}>
          <TouchableOpacity onPress={() => { setEditIncome(item); setMode('edit'); }} style={styles.actionButton}>
            <Text style={[styles.editText, { color: theme.colors.primary }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Delete Income', 'Are you sure you want to delete this income record?', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: () => deleteIncome(item.id) },
              ])
            }
            style={styles.actionButton}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Month Navigation */}
      <View style={[styles.monthBar, { backgroundColor: theme.colors.surface }]}>
        <TouchableOpacity onPress={() => setSelectedMonth(shiftMonth(selectedMonth, -1))} style={styles.monthArrow}>
          <Text style={[styles.monthArrowText, { color: theme.colors.primary }]}>‹</Text>
        </TouchableOpacity>
        <Text style={[styles.monthLabel, { color: theme.colors.text }]}>{formatMonthLabel(selectedMonth)}</Text>
        <TouchableOpacity
          onPress={() => !isCurrentMonth && setSelectedMonth(shiftMonth(selectedMonth, 1))}
          style={[styles.monthArrow, isCurrentMonth && styles.monthArrowDisabled]}
          disabled={isCurrentMonth}
        >
          <Text style={[styles.monthArrowText, { color: isCurrentMonth ? theme.colors.textSecondary : theme.colors.primary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Monthly Total Card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Income</Text>
        <Text style={styles.totalAmount}>${monthTotal.toFixed(2)}</Text>
      </View>

      {/* Income List */}
      {monthIncomes.length === 0 ? (
        <View style={styles.centeredState}>
          <Text style={styles.emptyIcon}>💵</Text>
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>No income records</Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.textSecondary }]}>
            No income recorded for {formatMonthLabel(selectedMonth)}.
          </Text>
          <TouchableOpacity
            style={[styles.emptyAddButton, { backgroundColor: colors.accent }]}
            onPress={() => { setEditIncome(null); setMode('add'); }}
          >
            <Text style={styles.emptyAddButtonText}>Add Income</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={monthIncomes}
          keyExtractor={item => item.id.toString()}
          renderItem={renderIncome}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* FAB */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accent }]}
        onPress={() => { setEditIncome(null); setMode('add'); }}
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
    backgroundColor: colors.accent,
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
  totalLabel: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  totalAmount: { fontSize: 24, fontWeight: '700', color: '#fff' },
  list: { paddingHorizontal: spacing.md, paddingBottom: 90 },
  separator: { height: spacing.sm },
  incomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  description: { fontSize: 15, fontWeight: '600', marginBottom: 4 },
  meta: { fontSize: 12 },
  notes: { fontSize: 11, marginTop: 2, fontStyle: 'italic' },
  amount: { fontSize: 16, fontWeight: '700', color: colors.accent },
  actionButton: { marginLeft: spacing.sm, padding: 4 },
  editText: { fontSize: 13, fontWeight: '600' },
  deleteText: { fontSize: 13, color: colors.error, fontWeight: '600' },
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
