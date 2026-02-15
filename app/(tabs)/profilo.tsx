import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar, Card } from 'react-native-paper';
import { useProfileStore } from '../../src/stores/profileStore';
import { ProfileSelector } from '../../src/components/ProfileSelector';
import { useRouter } from 'expo-router';

export default function ProfiloScreen() {
  const { loadProfiles, activeProfile, logout } = useProfileStore();
  const router = useRouter();

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleAddProfile = () => {
    router.push('/profile/add');
  };

  const handleLogout = async () => {
    await logout();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ScrollView style={styles.container}>
      {activeProfile ? (
        <>
          <Card style={styles.profileCard}>
            <Card.Content style={styles.profileContent}>
              {activeProfile.avatar ? (
                <Avatar.Image size={80} source={{ uri: activeProfile.avatar }} />
              ) : (
                <Avatar.Text size={80} label={getInitials(activeProfile.name)} />
              )}
              <Text variant="headlineSmall" style={styles.profileName}>
                {activeProfile.name}
              </Text>
              <Text variant="bodyMedium" style={styles.profileEmail}>
                {activeProfile.email}
              </Text>
            </Card.Content>
          </Card>

          <ProfileSelector onAddProfile={handleAddProfile} />

          <View style={styles.actions}>
            <Button mode="outlined" onPress={handleLogout} style={styles.button}>
              Logout
            </Button>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <Text variant="titleLarge" style={styles.emptyTitle}>
            Nessun profilo attivo
          </Text>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Aggiungi un profilo per iniziare
          </Text>
          <Button mode="contained" onPress={handleAddProfile} style={styles.addButton}>
            Aggiungi Profilo
          </Button>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    elevation: 2,
  },
  profileContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  profileName: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  profileEmail: {
    marginTop: 4,
    opacity: 0.7,
  },
  actions: {
    padding: 16,
  },
  button: {
    marginVertical: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    marginTop: 100,
  },
  emptyTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    opacity: 0.7,
    marginBottom: 24,
    textAlign: 'center',
  },
  addButton: {
    marginTop: 16,
  },
});
