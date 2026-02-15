import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function ViaggiScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Viaggi</Text>
      <Text variant="bodyMedium" style={styles.placeholder}>
        I tuoi viaggi appariranno qui
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  placeholder: {
    marginTop: 16,
    opacity: 0.6,
  },
});
