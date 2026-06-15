import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../constants';
import { useTheme } from '../../context/ThemeContext';

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  size = 'medium',
}) => {
  const { theme } = useTheme();

  const getBackgroundColor = () => {
    if (disabled) return colors.gray[300];
    switch (variant) {
      case 'primary':
        return theme.colors.primary;
      case 'secondary':
        return colors.secondary;
      case 'outline':
        return colors.white;
      default:
        return theme.colors.primary;
    }
  };

  const getTextColor = () => {
    if (variant === 'outline') return theme.colors.primary;
    return colors.white;
  };

  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: spacing.sm, paddingHorizontal: spacing.md };
      case 'large':
        return { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl };
      default:
        return { paddingVertical: spacing.md, paddingHorizontal: spacing.lg };
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: variant === 'outline' ? theme.colors.primary : 'transparent',
            ...getPadding(),
          },
        ]}
      >
        <Text style={[styles.text, { color: getTextColor() }]}>
          {loading ? 'Loading...' : title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
