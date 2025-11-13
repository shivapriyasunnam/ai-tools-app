import React, { useContext, useState } from 'react';
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
import { IncomeContext } from '@/src/context/IncomeContext';

// Simple form for adding/editing income
function IncomeForm({ onSubmit, onCancel, initialValues = {}, loading, isEdit }) {
  const [description, setDescription] = useState(initialValues.description || '');
  const [amount, setAmount] = useState(initialValues.amount ? initialValues.amount.toString() : '');
  const [date, setDate] = useState(initialValues.date || new Date().toISOString().split('T')[0]);
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
    onSubmit({
      ...initialValues,
      description: description.trim(),
      amount: parseFloat(amount),
      date,
      notes,
    });
    if (!isEdit) {
      setDescription('');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
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
          style={[formStyles.button, { backgroundColor: '#10B981', opacity: loading ? 0.6 : 1 }]}
        >
          <Text style={formStyles.buttonText}>{isEdit ? '✓ Save Changes' : '✓ Add Income'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
          style={[formStyles.button, { backgroundColor: '#eee', marginLeft: 8 }]}
        >
          <Text style={[formStyles.buttonText, { color: '#222' }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const formStyles = StyleSheet.create({
  formContainer: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24, elevation: 2 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#111' },
  input: { borderWidth: 1, borderColor: '#eee', borderRadius: 8, padding: 10, marginBottom: 12, fontSize: 14, color: '#222', backgroundColor: '#f9f9f9' },
  buttonRow: { flexDirection: 'row', marginTop: 8 },
  button: { flex: 1, padding: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
});

export default function IncomeTrackerScreen() {
  const [mode, setMode] = useState('view'); // 'view', 'add', 'edit'
  const [filter, setFilter] = useState('');
  const [editIncome, setEditIncome] = useState(null);
  const { incomes, addIncome, deleteIncome, updateIncome, getTotalIncome } = useContext(IncomeContext);

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
        <Text style={styles.title}>💵 Income Tracker</Text>
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

        {/* Add/Edit Income Form */}
        {mode === 'add' && (
          <IncomeForm
            onSubmit={handleAddIncome}
            onCancel={() => setMode('view')}
            loading={false}
          />
        )}
        {mode === 'edit' && editIncome && (
          <IncomeForm
            onSubmit={handleUpdateIncome}
            onCancel={() => { setEditIncome(null); setMode('view'); }}
            loading={false}
            initialValues={editIncome}
            isEdit
          />
        )}

        {/* List incomes */}
        {filteredIncomes.length > 0 ? (
          filteredIncomes.map(income => (
            <View key={income.id} style={styles.incomeItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.description}>{income.description}</Text>
                <Text style={styles.meta}>{income.date}</Text>
              </View>
              <Text style={styles.amount}>+${income.amount.toFixed(2)}</Text>
              <TouchableOpacity onPress={() => handleEditIncome(income)} style={styles.editButton}>
                <Text style={styles.editText}>✎</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteIncome(income.id)} style={styles.deleteButton}>
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No income records yet.</Text>
        )}
      </ScrollView>
      {/* Floating Action Button to Add Income */}
      {mode === 'view' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setMode('add')}
          activeOpacity={0.8}
        >
          <Text style={styles.fabIcon}>＋</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.gray[50] },
  scrollContent: { padding: spacing.md },
  title: { fontSize: 28, fontWeight: '700', color: colors.gray[900], marginBottom: spacing.lg },
  incomeItem: {
    backgroundColor: colors.white,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  description: { fontSize: 14, fontWeight: '600', color: colors.text },
  meta: { fontSize: 12, color: colors.gray[600] },
  amount: { fontSize: 16, fontWeight: 'bold', color: colors.primary, marginLeft: 8 },
  editButton: { marginLeft: 8, padding: 4 },
  editText: { fontSize: 16, color: colors.accent },
  deleteButton: { marginLeft: 4, padding: 4 },
  deleteText: { fontSize: 16, color: colors.error },
  emptyText: { textAlign: 'center', color: colors.gray[400], marginTop: spacing.lg, fontSize: 14 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#10B981',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  fabIcon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: -2,
  },
});
