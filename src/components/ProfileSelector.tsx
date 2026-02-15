import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Text, Card, IconButton, ActivityIndicator } from 'react-native-paper';
import { useProfileStore } from '../stores/profileStore';
import { UserProfile } from '../types/profile';

interface ProfileSelectorProps {
  onAddProfile?: () => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ onAddProfile }) => {
  const { profiles, activeProfile, isLoading, switchProfile, removeProfile } = useProfileStore();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const handleProfileSwitch = async (profileId: string) => {
    if (activeProfile?.id !== profileId) {
      await switchProfile(profileId);
    }
  };

  const handleRemoveProfile = async (profileId: string, e: any) => {
    e.stopPropagation();
    await removeProfile(profileId);
  };

  return (
    <View style={styles.container}>
      <Text variant="titleMedium" style={styles.title}>
        Profili
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isActive={activeProfile?.id === profile.id}
            onPress={() => handleProfileSwitch(profile.id)}
            onRemove={(e) => handleRemoveProfile(profile.id, e)}
          />
        ))}

        {onAddProfile && (
          <TouchableOpacity onPress={onAddProfile} style={styles.addProfileCard}>
            <Card style={styles.card}>
              <Card.Content style={styles.addProfileContent}>
                <IconButton icon="plus-circle-outline" size={32} />
                <Text variant="bodySmall">Aggiungi Profilo</Text>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

interface ProfileCardProps {
  profile: UserProfile;
  isActive: boolean;
  onPress: () => void;
  onRemove: (e: any) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, isActive, onPress, onRemove }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <Card style={[styles.card, isActive && styles.activeCard]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            {profile.avatar ? (
              <Avatar.Image size={48} source={{ uri: profile.avatar }} />
            ) : (
              <Avatar.Text size={48} label={getInitials(profile.name)} />
            )}
            {isActive && (
              <View style={styles.activeIndicator}>
                <IconButton icon="check-circle" size={16} iconColor="white" />
              </View>
            )}
          </View>

          <Text variant="bodyMedium" style={styles.profileName} numberOfLines={1}>
            {profile.name}
          </Text>
          <Text variant="bodySmall" style={styles.profileEmail} numberOfLines={1}>
            {profile.email}
          </Text>

          <IconButton
            icon="close-circle-outline"
            size={16}
            onPress={onRemove}
            style={styles.removeButton}
          />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  title: {
    paddingHorizontal: 16,
    marginBottom: 12,
    fontWeight: 'bold',
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  card: {
    width: 140,
    marginRight: 12,
    elevation: 2,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 16,
    position: 'relative',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#2196F3',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    textAlign: 'center',
    fontWeight: 'bold',
    width: '100%',
  },
  profileEmail: {
    textAlign: 'center',
    opacity: 0.7,
    width: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    margin: 0,
  },
  addProfileCard: {
    width: 140,
  },
  addProfileContent: {
    alignItems: 'center',
    paddingVertical: 16,
    minHeight: 140,
    justifyContent: 'center',
  },
});
