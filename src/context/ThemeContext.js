import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

const STORAGE_KEY = '@app_theme_mode';
const PRIMARY_COLOR_KEY = '@app_primary_color';

export const COLOR_PRESETS = [
  { light: '#6366f1', dark: '#818cf8', name: 'Indigo' },
  { light: '#8b5cf6', dark: '#a78bfa', name: 'Violet' },
  { light: '#3b82f6', dark: '#60a5fa', name: 'Blue' },
  { light: '#0ea5e9', dark: '#38bdf8', name: 'Sky' },
  { light: '#14b8a6', dark: '#2dd4bf', name: 'Teal' },
  { light: '#10b981', dark: '#34d399', name: 'Emerald' },
  { light: '#f43f5e', dark: '#fb7185', name: 'Rose' },
  { light: '#f97316', dark: '#fb923c', name: 'Orange' },
  { light: '#ec4899', dark: '#f472b6', name: 'Pink' },
];

// Light theme colors
const lightTheme = {
  isDark: false,
  colors: {
    background: '#f9fafb',
    surface: '#ffffff',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    primary: '#6366f1',
    error: '#ef4444',
    success: '#10b981',
    warning: '#f59e0b',
    card: '#ffffff',
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
  },
};

// Dark theme colors
const darkTheme = {
  isDark: true,
  colors: {
    background: '#111827',
    surface: '#1f2937',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    border: '#374151',
    primary: '#818cf8',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    card: '#1f2937',
    gray: {
      50: '#1f2937',
      100: '#374151',
      200: '#4b5563',
      300: '#6b7280',
      400: '#9ca3af',
      500: '#d1d5db',
      600: '#e5e7eb',
      700: '#f3f4f6',
      800: '#f9fafb',
      900: '#ffffff',
    },
  },
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [primaryColor, setPrimaryColorState] = useState(COLOR_PRESETS[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const [savedTheme, savedColor] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(PRIMARY_COLOR_KEY),
      ]);
      if (savedTheme !== null) setIsDarkMode(savedTheme === 'dark');
      if (savedColor !== null) {
        const parsed = JSON.parse(savedColor);
        const match = COLOR_PRESETS.find(c => c.name === parsed.name);
        if (match) setPrimaryColorState(match);
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    try {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      await AsyncStorage.setItem(STORAGE_KEY, newMode ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const setDarkMode = async (value) => {
    try {
      setIsDarkMode(value);
      await AsyncStorage.setItem(STORAGE_KEY, value ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  const setPrimaryColor = async (colorPreset) => {
    try {
      setPrimaryColorState(colorPreset);
      await AsyncStorage.setItem(PRIMARY_COLOR_KEY, JSON.stringify(colorPreset));
    } catch (error) {
      console.error('Failed to save primary color:', error);
    }
  };

  const baseTheme = isDarkMode ? darkTheme : lightTheme;
  const theme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: isDarkMode ? primaryColor.dark : primaryColor.light,
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        theme,
        toggleTheme,
        setDarkMode,
        primaryColor,
        setPrimaryColor,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
