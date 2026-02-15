import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { PaperProvider, Text, Button, Surface } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import theme, { spacing } from './src/theme';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <Surface style={styles.surface} elevation={2}>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome to TravelPal
            </Text>
            <Text variant="bodyMedium" style={styles.subtitle}>
              Your travel companion app with Material Design 3
            </Text>
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={() => console.log('Primary pressed')}>
                Primary Action
              </Button>
              <Button mode="contained-tonal" onPress={() => console.log('Secondary pressed')}>
                Secondary Action
              </Button>
              <Button mode="outlined" onPress={() => console.log('Outlined pressed')}>
                Outlined Action
              </Button>
            </View>
          </Surface>
          <StatusBar style="auto" />
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  surface: {
    padding: spacing.lg,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  title: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: spacing.lg,
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonContainer: {
    gap: spacing.md,
    width: '100%',
  },
});
