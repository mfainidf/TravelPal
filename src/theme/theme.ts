import { MD3LightTheme } from 'react-native-paper';

// TravelPal color scheme
const colors = {
  primary: '#2196F3', // Blue
  secondary: '#FF9800', // Orange
  accent: '#4CAF50', // Green
  background: '#FFFFFF',
  surface: '#FFFFFF',
  error: '#B00020',
  text: '#000000',
  onPrimary: '#FFFFFF',
  onSecondary: '#000000',
  onSurface: '#000000',
  onError: '#FFFFFF',
  disabled: '#00000061',
  placeholder: '#00000061',
  backdrop: '#00000080',
  notification: '#F50057',
};

// 8px-based spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...colors,
  },
  spacing,
};

export type AppTheme = typeof theme;
