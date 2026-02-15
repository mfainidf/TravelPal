import { MD3LightTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

/**
 * TravelPal Color Palette
 * Based on Material Design 3 principles
 */
const travelPalColors = {
  primary: '#2196F3',        // Blue - represents travel and sky
  secondary: '#FF9800',      // Orange - represents adventure and sunset
  accent: '#4CAF50',         // Green - represents nature and go/success
  primaryContainer: '#BBDEFB',
  secondaryContainer: '#FFE0B2',
  error: '#B00020',
  errorContainer: '#FFDAD6',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#E3E2E6',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onBackground: '#1C1B1F',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
  outlineVariant: '#CAC4D0',
};

/**
 * Typography configuration
 */
const typography = {
  displayLarge: {
    fontSize: 57,
    lineHeight: 64,
    fontWeight: '400' as const,
  },
  displayMedium: {
    fontSize: 45,
    lineHeight: 52,
    fontWeight: '400' as const,
  },
  displaySmall: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '400' as const,
  },
  headlineLarge: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400' as const,
  },
  headlineMedium: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400' as const,
  },
  headlineSmall: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '400' as const,
  },
  titleLarge: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '400' as const,
  },
  titleMedium: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
  },
  titleSmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  bodyMedium: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  labelLarge: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
  labelMedium: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  labelSmall: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
};

/**
 * Spacing system (8px base unit)
 */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

/**
 * TravelPal Light Theme
 * Material Design 3 based theme configuration
 */
export const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...travelPalColors,
  },
  // Custom properties can be added here
};

export default theme;
