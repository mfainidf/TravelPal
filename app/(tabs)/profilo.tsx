import { View, Text, StyleSheet } from 'react-native';

export default function ProfiloScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profilo</Text>
      <Text style={styles.subtitle}>Il tuo profilo utente</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
