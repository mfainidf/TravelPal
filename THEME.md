# TravelPal Theme Configuration

This document describes the theme configuration for the TravelPal React Native app using React Native Paper with Material Design 3.

## Color Palette

The TravelPal color palette is designed to evoke feelings of travel, adventure, and nature:

- **Primary (Blue #2196F3)**: Represents travel and sky
- **Secondary (Orange #FF9800)**: Represents adventure and sunset
- **Accent (Green #4CAF50)**: Represents nature and go/success

## Typography

The app uses Material Design 3 typography scale with the following variants:

- Display: Large (57px), Medium (45px), Small (36px)
- Headline: Large (32px), Medium (28px), Small (24px)
- Title: Large (22px), Medium (16px), Small (14px)
- Body: Large (16px), Medium (14px), Small (12px)
- Label: Large (14px), Medium (12px), Small (11px)

## Spacing System

The app uses an 8px base unit spacing system:

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- xxl: 48px

## Usage

The theme is configured in `src/theme/theme.ts` and applied to the entire app through the `PaperProvider` component in `App.tsx`.

To use theme colors and spacing in your components:

```typescript
import theme, { spacing } from './src/theme/theme';

// Use theme colors
<View style={{ backgroundColor: theme.colors.primary }}>

// Use spacing
<View style={{ padding: spacing.md }}>
```

## Components

The app is wrapped with:
- `SafeAreaProvider`: Handles safe area insets on different devices
- `PaperProvider`: Provides Material Design 3 theme to all Paper components
