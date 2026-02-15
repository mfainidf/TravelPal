import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useProfileStore } from '../../src/stores/profileStore';
import { ProfileSelector } from '../../src/components/ProfileSelector';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { loadProfiles, activeProfile } = useProfileStore();
  const router = useRouter();

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleAddProfile = () => {
    router.push('/profile/add');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          TravelPal
        </Text>
        {activeProfile && (
          <Text variant="bodyLarge" style={styles.welcome}>
            Ciao, {activeProfile.name}!
          </Text>
        )}
      </View>

      <ProfileSelector onAddProfile={handleAddProfile} />

      <View style={styles.content}>
        <Text variant="titleLarge" style={styles.sectionTitle}>
          I tuoi viaggi
        </Text>
        <Text variant="bodyMedium" style={styles.placeholder}>
          Inizia a pianificare il tuo prossimo viaggio!
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  welcome: {
    marginTop: 8,
    opacity: 0.8,
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
  },
  placeholder: {
    opacity: 0.6,
    fontStyle: 'italic',
  },
});
