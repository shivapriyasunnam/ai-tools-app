import { useContext } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { ExpenseContext } from '@/src/context/ExpenseContext';
import { ManualExpenseForm } from '@/src/components/ManualExpenseForm';

export default function AddExpenseScreen() {
  const router = useRouter();
  const { addExpense } = useContext(ExpenseContext);

  const handleExpenseAdded = async (expense) => {
    try {
      await addExpense(expense);
      Alert.alert('Success', 'Expense added successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err) {
      Alert.alert('Error', 'Failed to add expense: ' + err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <ManualExpenseForm
          onExpenseAdded={handleExpenseAdded}
          onCancel={() => router.back()}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
