import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAuthStore } from '../../src/stores/authStore';
import { spacing } from '../../src/theme/theme';

export default function HomeScreen() {
  const { user, signOut } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        Benvenuto in TravelPal!
      </Text>
      {user && (
        <Text style={styles.subtitle}>
          Ciao, {user.email}!
        </Text>
      )}
      <Button mode="contained" onPress={signOut} style={styles.button}>
        Esci
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.md,
  },
});
