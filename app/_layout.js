import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { initExecutorch } from 'react-native-executorch';
import { ExpoResourceFetcher } from 'react-native-executorch-expo-resource-fetcher';

initExecutorch({ resourceFetcher: ExpoResourceFetcher });

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from '@/src/context/AppContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: false 
            }} 
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
