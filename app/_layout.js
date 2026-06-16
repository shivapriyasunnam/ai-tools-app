import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { initExecutorch } from 'react-native-executorch';
import { ExpoResourceFetcher } from 'react-native-executorch-expo-resource-fetcher';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import mobileAds from 'react-native-google-mobile-ads';

initExecutorch({ resourceFetcher: ExpoResourceFetcher });

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '@/src/context/AppContext';
import { AuthProvider, useAuth } from '@/src/context/AuthContext';
import { useTheme } from '@/src/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function ThemedStatusBar() {
  const { isDarkMode, theme } = useTheme();
  return <StatusBar style={isDarkMode ? 'light' : 'dark'} backgroundColor={theme.colors.background} />;
}

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

  useEffect(() => {
    mobileAds().initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppProvider>
          <NavThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <AuthGate>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="sign-in" options={{ headerShown: false }} />
                <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
                <Stack.Screen name="add-expense" options={{ headerShown: false }} />
              </Stack>
            </AuthGate>
            <ThemedStatusBar />
          </NavThemeProvider>
        </AppProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
