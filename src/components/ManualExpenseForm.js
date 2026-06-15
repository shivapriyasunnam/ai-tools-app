import { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { colors, spacing } from '../constants';
import { useTheme } from '../context/ThemeContext';

const CATEGORIES = [
  'Groceries',
  'Transport',
  'Entertainment',
  'Dining',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Other',
];


export const ManualExpenseForm = ({ onExpenseAdded, onCancel, loading, initialValues, isEdit }) => {
  const { theme } = useTheme();
  const [description, setDescription] = useState(initialValues?.description || '');
  const [amount, setAmount] = useState(initialValues?.amount?.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(initialValues?.category || 'Other');
  // Use user's local date for default
  const now = new Date();
  const initialDateObj = initialValues?.date ? new Date(initialValues.date) : now;
  const pad = n => n.toString().padStart(2, '0');
  const localYear = initialDateObj.getFullYear();
  const localMonth = pad(initialDateObj.getMonth() + 1);
  const localDay = pad(initialDateObj.getDate());
  const [date, setDate] = useState(`${localYear}-${localMonth}-${localDay}`);
  const [notes, setNotes] = useState(initialValues?.notes || '');

  const [submitting, setSubmitting] = useState(false);

  const handleAddExpense = async () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const isoDate = new Date().toISOString();

    const expense = {
      ...(initialValues || {}),
      description: description.trim(),
      amount: parseFloat(amount),
      category: selectedCategory,
      date: isoDate,
      notes,
      method: 'manual',
    };

    setSubmitting(true);
    try {
      await onExpenseAdded(expense);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>{isEdit ? '✎ Edit Expense' : '➕ Add Expense Manually'}</Text>

      {/* Date */}
      <View>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Date</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        />
      </View>

      {/* Description */}
      <View>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Description *</Text>
        <TextInput
          placeholder="What did you buy?"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        />
      </View>

      {/* Amount */}
      <View>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Amount ($) *</Text>
        <TextInput
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, { color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        />
      </View>

      {/* Category */}
      <View>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    selectedCategory === category ? theme.colors.primary : theme.colors.gray[200],
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category ? colors.white : theme.colors.text,
                  },
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes */}
      <View>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Notes (Optional)</Text>
        <TextInput
          placeholder="Add any additional notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholderTextColor={theme.colors.textSecondary}
          style={[styles.input, { textAlignVertical: 'top', minHeight: 80, color: theme.colors.text, backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={handleAddExpense}
          disabled={submitting || loading}
          style={[styles.button, { backgroundColor: colors.accent, flex: 1, opacity: (submitting || loading) ? 0.6 : 1 }]}
        >
          <Text style={styles.buttonText}>{submitting ? 'Saving...' : isEdit ? '✓ Save Changes' : '✓ Add Expense'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          disabled={submitting || loading}
          style={[styles.button, { backgroundColor: colors.gray[300], flex: 1, marginLeft: spacing.md }]}
        >
          <Text style={[styles.buttonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.gray[50],
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.gray[700],
    marginBottom: spacing.sm,
    marginTop: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.gray[300],
    padding: spacing.md,
    borderRadius: 8,
    color: colors.text,
    backgroundColor: colors.white,
    fontSize: 14,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    width: '48%',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  button: {
    padding: spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
