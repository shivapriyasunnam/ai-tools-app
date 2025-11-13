import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { colors, spacing } from '../constants';

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

export const ManualExpenseForm = ({ onExpenseAdded, onCancel, loading }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Other');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const handleAddExpense = () => {
    if (!description.trim() || !amount.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const expense = {
      description: description.trim(),
      amount: parseFloat(amount),
      category: selectedCategory,
      date,
      notes,
      method: 'manual',
    };

    onExpenseAdded(expense);

    // Reset form
    setDescription('');
    setAmount('');
    setSelectedCategory('Other');
    setDate(new Date().toISOString().split('T')[0]);
    setNotes('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>➕ Add Expense Manually</Text>

      {/* Date */}
      <View>
        <Text style={styles.label}>Date</Text>
        <TextInput
          placeholder="YYYY-MM-DD"
          value={date}
          onChangeText={setDate}
          placeholderTextColor={colors.gray[400]}
          style={styles.input}
        />
      </View>

      {/* Description */}
      <View>
        <Text style={styles.label}>Description *</Text>
        <TextInput
          placeholder="What did you buy?"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={colors.gray[400]}
          style={styles.input}
        />
      </View>

      {/* Amount */}
      <View>
        <Text style={styles.label}>Amount ($) *</Text>
        <TextInput
          placeholder="0.00"
          value={amount}
          onChangeText={setAmount}
          keyboardType="decimal-pad"
          placeholderTextColor={colors.gray[400]}
          style={styles.input}
        />
      </View>

      {/* Category */}
      <View>
        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map(category => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                {
                  backgroundColor:
                    selectedCategory === category ? colors.primary : colors.gray[200],
                },
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  {
                    color: selectedCategory === category ? colors.white : colors.text,
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
        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          placeholder="Add any additional notes..."
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={3}
          placeholderTextColor={colors.gray[400]}
          style={[styles.input, { textAlignVertical: 'top', minHeight: 80 }]}
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          onPress={handleAddExpense}
          disabled={loading}
          style={[styles.button, { backgroundColor: colors.accent, flex: 1, opacity: loading ? 0.6 : 1 }]}
        >
          <Text style={styles.buttonText}>✓ Add Expense</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
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
