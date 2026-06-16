import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function AddExpenseScreen() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/(tabs)/expense-tracker?mode=add');
  }, []);

  return null;
}
