import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Link } from 'expo-router';
import { spacing } from '../../src/theme/theme';
import { t } from '../../src/i18n';

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        {t('auth.register.title')}
      </Text>
      <Text>Schermata di registrazione - Da implementare</Text>
      <Link href="/(auth)/login" style={styles.link}>
        <Text style={styles.linkText}>Torna al login</Text>
      </Link>
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
    marginBottom: spacing.xl,
  },
  link: {
    marginTop: spacing.lg,
  },
  linkText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
});
