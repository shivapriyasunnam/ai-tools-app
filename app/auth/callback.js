import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/src/services/supabaseClient';

export default function AuthCallback() {
  const params = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.code;
    if (!code) {
      router.replace('/sign-in');
      return;
    }
    // On Android, signInWithGoogle may have already exchanged this code via
    // openAuthSessionAsync. If so, the exchange here will fail silently —
    // the session is already set and AuthGate handles the redirect to (tabs).
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        console.warn('[AuthCallback] exchange skipped (likely handled by signInWithGoogle):', error.message);
      }
    }).catch((err) => {
      console.warn('[AuthCallback] exchange exception:', err);
    });
  }, [params.code]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#6366F1" />
      <Text style={styles.text}>Signing you in...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    gap: 16,
  },
  text: {
    color: '#64748B',
    fontSize: 15,
  },
});
