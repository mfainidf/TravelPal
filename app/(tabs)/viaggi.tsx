import { View, Text, StyleSheet } from 'react-native';

export default function ViaggiScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Viaggi</Text>
      <Text style={styles.subtitle}>I tuoi viaggi</Text>
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
