import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useAuthStore } from '../../src/stores/authStore';
import { spacing } from '../../src/theme/theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuthStore();

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Profilo
      </Text>
      {user && (
        <>
          <Text style={styles.info}>Email: {user.email}</Text>
          <Text style={styles.info}>ID: {user.id}</Text>
        </>
      )}
      <Button mode="outlined" onPress={signOut} style={styles.button}>
        Esci
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  title: {
    marginBottom: spacing.xl,
  },
  info: {
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.xl,
  },
});
