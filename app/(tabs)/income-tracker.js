import { colors, spacing } from '@/src/constants';
import { IncomeContext } from '@/src/context/IncomeContext';
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

// Simple form for adding/editing income

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

  const handleSubmit = () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    // Always use current local date and time for activity entry
    const isoDate = new Date().toISOString();
    onSubmit({
      ...initialValues,
      description: description.trim(),
      amount: parseFloat(amount),
      date: isoDate,
      notes,
    });
    if (!isEdit) {
      setDescription('');
      setAmount('');
      setDate(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
      setNotes('');
    }
  };

  return (
    <View style={formStyles.formContainer}>
      <Text style={formStyles.formTitle}>{isEdit ? '✎ Edit Income' : '➕ Add Income'}</Text>
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
        editable={true}
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
          disabled={loading}
          style={[formStyles.button, { backgroundColor: colors.accent, opacity: loading ? 0.6 : 1 }]}
        >
          <Text style={formStyles.buttonText}>{isEdit ? 'Save Changes' : 'Add Income'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
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
  const [mode, setMode] = useState('view'); // 'view', 'add', 'edit'
  const [filter, setFilter] = useState('');
  const [editIncome, setEditIncome] = useState(null);
  const { incomes, addIncome, deleteIncome, updateIncome, getTotalIncome } = useContext(IncomeContext);

  const total = getTotalIncome();

  const filteredIncomes = filter
    ? incomes.filter(i =>
        i.description.toLowerCase().includes(filter.toLowerCase()) ||
        (i.date && i.date.includes(filter))
      )
    : incomes;

  const handleAddIncome = (income) => {
    addIncome(income);
    setMode('view');
    Alert.alert('Success', 'Income added successfully!');
  };

  const handleEditIncome = (income) => {
    setEditIncome(income);
    setMode('edit');
  };

  const handleUpdateIncome = (updated) => {
    updateIncome(updated.id, updated);
    setEditIncome(null);
    setMode('view');
    Alert.alert('Success', 'Income updated!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        {mode === 'view' && (
          <View>
            <Text style={styles.title}>💵 Income Tracker</Text>

            {/* Summary Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Income</Text>
              <Text style={styles.summaryAmount}>${total.toFixed(2)}</Text>
            </View>

            {/* Add Button */}
            <TouchableOpacity
              onPress={() => setMode('add')}
              style={[styles.modeButton, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.modeButtonText}>➕ Add Income</Text>
            </TouchableOpacity>

            {/* Filter/Search Bar */}
            <View style={{ marginBottom: spacing.md }}>
              <TextInput
                placeholder="Search by description or date..."
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

            {/* Income List */}
            {filteredIncomes.length > 0 ? (
              <View>
                <Text style={styles.listTitle}>📝 Income Records ({filteredIncomes.length})</Text>
                {filteredIncomes.map(income => (
                  <View key={income.id} style={styles.incomeItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.description}>{income.description}</Text>
                      <Text style={styles.meta}>{income.date}</Text>
                      {income.notes ? <Text style={styles.notes}>{income.notes}</Text> : null}
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={styles.amount}>${income.amount.toFixed(2)}</Text>
                      <View style={{ flexDirection: 'row', marginTop: spacing.xs }}>
                        <TouchableOpacity onPress={() => handleEditIncome(income)} style={styles.actionButton}>
                          <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          onPress={() => {
                            Alert.alert(
                              'Delete Income',
                              'Are you sure you want to delete this income record?',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'Delete', style: 'destructive', onPress: () => deleteIncome(income.id) },
                              ]
                            );
                          }} 
                          style={styles.actionButton}
                        >
                          <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💵</Text>
                <Text style={styles.emptyText}>No income records yet</Text>
                <Text style={styles.emptySubtext}>Add your first income to start tracking</Text>
              </View>
            )}
          </View>
        )}

        {/* Add Income Form */}
        {mode === 'add' && (
          <IncomeForm
            onSubmit={handleAddIncome}
            onCancel={() => setMode('view')}
            loading={false}
          />
        )}

        {/* Edit Income Form */}
        {mode === 'edit' && editIncome && (
          <IncomeForm
            onSubmit={handleUpdateIncome}
            onCancel={() => { setEditIncome(null); setMode('view'); }}
            loading={false}
            initialValues={editIncome}
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
  },
  modeButton: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  modeButtonText: {
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
  incomeItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.accent,
  },
  description: { 
    fontSize: 15, 
    fontWeight: '600', 
    color: colors.gray[900],
    marginBottom: 4,
  },
  meta: { 
    fontSize: 13, 
    color: colors.gray[600],
  },
  notes: {
    fontSize: 12,
    color: colors.gray[500],
    marginTop: 4,
    fontStyle: 'italic',
  },
  amount: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: colors.accent,
  },
  actionButton: { 
    marginLeft: spacing.sm,
    padding: 4,
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
