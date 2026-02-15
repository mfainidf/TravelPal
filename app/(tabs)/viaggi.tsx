import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { spacing } from '../../src/theme/theme';

export default function TripsScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Viaggi</Text>
      <Text>Nessun viaggio ancora</Text>
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
});
