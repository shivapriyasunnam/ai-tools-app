import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { initExecutorch } from 'react-native-executorch';
import { ExpoResourceFetcher } from 'react-native-executorch-expo-resource-fetcher';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

initExecutorch({ resourceFetcher: ExpoResourceFetcher });

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '@/src/context/AppContext';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function AuthGate({ children }) {
  const { session } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) return; // still loading
    const inSignIn = segments[0] === 'sign-in';
    const inCallback = segments[0] === 'auth';
    if (!session && !inSignIn && !inCallback) {
      router.replace('/sign-in');
    } else if (session && (inSignIn || inCallback)) {
      router.replace('/(tabs)/');
    }
  }, [session, segments]);

  return children;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthGate>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="sign-in" options={{ headerShown: false }} />
                <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
                <Stack.Screen
                  name="add-expense"
                  options={{
                    title: 'Add Expense',
                    presentation: 'modal',
                    headerStyle: { backgroundColor: '#F8F9FA' },
                    headerTintColor: '#111827',
                    headerTitleStyle: { fontWeight: '700' },
                  }}
                />
              </Stack>
            </AuthGate>
            <StatusBar style="dark" backgroundColor="#F8F9FA" />
          </ThemeProvider>
        </AppProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
