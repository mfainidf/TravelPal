import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PersistQueryClientProvider, queryClient, persistOptions } from './src/services/queryClient';
import { useAuthStore } from './src/stores/authStore';

function AppContent() {
  const { loading, user, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to TravelPal!</Text>
      {user ? (
        <Text style={styles.subtext}>Logged in as: {user.email}</Text>
      ) : (
        <Text style={styles.subtext}>Not logged in</Text>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

export default function App() {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={persistOptions}>
      <AppContent />
    </PersistQueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtext: {
    fontSize: 16,
    color: '#666',
  },
});
