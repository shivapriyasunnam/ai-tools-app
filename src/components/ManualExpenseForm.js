import { useState, useContext } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing } from '../constants';
import { DEFAULT_CATEGORIES } from '../constants/categories';
import { BudgetContext } from '../context/BudgetContext';
import { useTheme } from '../context/ThemeContext';

function getTodayStr() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function getDateOptions() {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
}

function getInitialDateStr(initialDate) {
  if (!initialDate) return getTodayStr();
  const d = new Date(initialDate);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatDateDisplay(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });
}

function formatDateOption(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const target = new Date(year, month - 1, day);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - target) / 86400000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return target.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export const ManualExpenseForm = ({ onExpenseAdded, onCancel, loading, initialValues, isEdit }) => {
  const { theme } = useTheme();
  const { budgets } = useContext(BudgetContext);

  // Derive categories from budget records; fall back to defaults while loading
  const CATEGORIES = budgets.length > 0
    ? budgets.map(b => ({ name: b.category, color: b.color || '#9ca3af' }))
    : DEFAULT_CATEGORIES;

  const [description, setDescription] = useState(initialValues?.description || '');
  const [amount, setAmount] = useState(initialValues?.amount?.toString() || '');
  const [selectedCategory, setSelectedCategory] = useState(initialValues?.category || CATEGORIES[0]?.name || 'Other');
  const [date, setDate] = useState(getInitialDateStr(initialValues?.date));
  const [notes, setNotes] = useState(initialValues?.notes || '');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);

  const dateOptions = getDateOptions();
  const selectedCategoryObj = CATEGORIES.find(c => c.name === selectedCategory) || CATEGORIES[0] || DEFAULT_CATEGORIES[0];

  function validate() {
    const errs = {};
    if (!description.trim()) errs.description = 'Description is required';
    if (!amount.trim() || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      errs.amount = 'Enter a valid amount';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const handleSubmit = async () => {
    if (!validate()) return;

    const [year, month, day] = date.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day, 12, 0, 0);

    const expense = {
      ...(initialValues || {}),
      description: description.trim(),
      amount: parseFloat(amount),
      category: selectedCategory,
      date: dateObj.toISOString(),
      notes: notes.trim(),
      method: isEdit ? (initialValues?.method || 'manual') : 'manual',
    };

    setSubmitting(true);
    try {
      await onExpenseAdded(expense);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to save expense');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{ backgroundColor: theme.colors.background }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.formContainer, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {isEdit ? 'Edit Expense' : 'Add Expense'}
          </Text>

          {/* Description */}
          <TextInput
            placeholder="Description *"
            value={description}
            onChangeText={t => { setDescription(t); if (errors.description) setErrors(e => ({ ...e, description: undefined })); }}
            placeholderTextColor={theme.colors.textSecondary}
            autoFocus={!isEdit}
            style={[
              styles.input,
              { color: theme.colors.text, backgroundColor: theme.colors.background, borderColor: errors.description ? colors.error : theme.colors.border },
            ]}
          />
          {errors.description ? <Text style={styles.errorText}>{errors.description}</Text> : null}

          {/* Amount */}
          <TextInput
            placeholder="Amount ($) *"
            value={amount}
            onChangeText={t => { setAmount(t); if (errors.amount) setErrors(e => ({ ...e, amount: undefined })); }}
            keyboardType="decimal-pad"
            placeholderTextColor={theme.colors.textSecondary}
            style={[
              styles.input,
              { color: theme.colors.text, backgroundColor: theme.colors.background, borderColor: errors.amount ? colors.error : theme.colors.border },
            ]}
          />
          {errors.amount ? <Text style={styles.errorText}>{errors.amount}</Text> : null}

          {/* Date */}
          <TouchableOpacity
            style={[styles.selector, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={[styles.selectorText, { color: theme.colors.text }]}>{formatDateDisplay(date)}</Text>
            <Text style={[styles.selectorChevron, { color: theme.colors.textSecondary }]}>▼</Text>
          </TouchableOpacity>

          {/* Category */}
          <TouchableOpacity
            style={[styles.selector, { backgroundColor: theme.colors.background, borderColor: selectedCategoryObj.color }]}
            onPress={() => setShowCategoryPicker(true)}
          >
            <View style={styles.catRow}>
              <View style={[styles.catDot, { backgroundColor: selectedCategoryObj.color }]} />
              <Text style={[styles.selectorText, { color: theme.colors.text }]}>{selectedCategory}</Text>
            </View>
            <Text style={[styles.selectorChevron, { color: theme.colors.textSecondary }]}>▼</Text>
          </TouchableOpacity>

          {/* Notes */}
          <TextInput
            placeholder="Notes (optional)"
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={2}
            placeholderTextColor={theme.colors.textSecondary}
            style={[
              styles.input,
              styles.multilineInput,
              { color: theme.colors.text, backgroundColor: theme.colors.background, borderColor: theme.colors.border },
            ]}
          />

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={onCancel}
              disabled={submitting || loading}
              style={[styles.iconButton, { backgroundColor: theme.colors.border }]}
            >
              <Ionicons name="arrow-back" size={20} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submitting || loading}
              style={[styles.iconButton, { backgroundColor: theme.colors.primary, opacity: (submitting || loading) ? 0.6 : 1, marginLeft: 8 }]}
            >
              <Ionicons name="checkmark" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Date</Text>
            <View style={[styles.modalDivider, { backgroundColor: theme.colors.border }]} />
            <FlatList
              data={dateOptions}
              keyExtractor={d => d}
              style={{ maxHeight: 320 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerOption, { borderBottomColor: theme.colors.border }]}
                  onPress={() => { setDate(item); setShowDatePicker(false); }}
                >
                  <Text style={[styles.pickerOptionText, { color: theme.colors.text }]}>
                    {formatDateOption(item)}
                  </Text>
                  {date === item && <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.modalCancelBtn, { borderTopColor: theme.colors.border }]}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Category Picker Modal */}
      <Modal visible={showCategoryPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Select Category</Text>
            <View style={[styles.modalDivider, { backgroundColor: theme.colors.border }]} />
            <FlatList
              data={CATEGORIES}
              keyExtractor={c => c.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.pickerOption, { borderBottomColor: theme.colors.border }]}
                  onPress={() => { setSelectedCategory(item.name); setShowCategoryPicker(false); }}
                >
                  <View style={[styles.catDot, { backgroundColor: item.color }]} />
                  <Text style={[styles.pickerOptionText, { color: theme.colors.text, marginLeft: spacing.sm }]}>
                    {item.name}
                  </Text>
                  {selectedCategory === item.name && (
                    <Text style={[styles.checkmark, { color: theme.colors.primary }]}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={[styles.modalCancelBtn, { borderTopColor: theme.colors.border }]}
              onPress={() => setShowCategoryPicker(false)}
            >
              <Text style={[styles.modalCancelText, { color: theme.colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    borderRadius: 12,
    padding: spacing.md,
    margin: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.md,
    marginBottom: spacing.md,
    fontSize: 14,
  },
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 60,
  },
  selector: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: { fontSize: 14 },
  selectorChevron: { fontSize: 12 },
  catRow: { flexDirection: 'row', alignItems: 'center' },
  catDot: { width: 10, height: 10, borderRadius: 5 },
  errorText: { fontSize: 12, color: colors.error, marginTop: -spacing.sm, marginBottom: spacing.sm },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Modals
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: spacing.lg,
    paddingBottom: 32,
    maxHeight: '70%',
  },
  modalTitle: { fontSize: 17, fontWeight: '700', marginBottom: spacing.sm },
  modalDivider: { height: StyleSheet.hairlineWidth, marginBottom: spacing.sm },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  pickerOptionText: { flex: 1, fontSize: 15 },
  checkmark: { fontSize: 16, fontWeight: '700' },
  modalCancelBtn: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: spacing.sm,
  },
  modalCancelText: { fontSize: 15, fontWeight: '500' },
});
