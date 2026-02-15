import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Text,
  TextInput,
  ActivityIndicator,
  SegmentedButtons,
} from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../../src/stores/authStore';
import { supabase } from '../../src/services/supabase';
import { Profile, ProfileUpdate, TravelPreferences } from '../../src/types/profile';
import { spacing, theme } from '../../src/theme';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { user, signOut } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [preferences, setPreferences] = useState<TravelPreferences>({});

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url);
        setPreferences(data.travel_preferences || {});
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      Alert.alert(t('common.error'), t('messages.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);
      const updates: ProfileUpdate = {
        full_name: fullName,
        avatar_url: avatarUrl,
        travel_preferences: preferences,
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      Alert.alert(t('common.success'), t('messages.updateSuccess'));
      setEditing(false);
      await loadProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(t('common.error'), t('messages.updateError'));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url);
      setPreferences(profile.travel_preferences || {});
    }
    setEditing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      t('common.logout'),
      t('common.confirm'),
      [
        { text: t('common.no'), style: 'cancel' },
        {
          text: t('common.yes'),
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.card}>
        <Card.Content>
          {/* Avatar Section */}
          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Avatar.Image size={120} source={{ uri: avatarUrl }} />
            ) : (
              <Avatar.Icon size={120} icon="account" />
            )}
            {editing && (
              <Button
                mode="outlined"
                onPress={pickImage}
                style={styles.avatarButton}
                icon="camera"
              >
                {t('profile.selectAvatar')}
              </Button>
            )}
          </View>

          {/* Name Section */}
          {editing ? (
            <TextInput
              label={t('profile.fullName')}
              value={fullName}
              onChangeText={setFullName}
              mode="outlined"
              style={styles.input}
            />
          ) : (
            <View style={styles.infoSection}>
              <Text variant="labelLarge" style={styles.label}>
                {t('profile.fullName')}
              </Text>
              <Text variant="bodyLarge">{profile?.full_name || t('common.noData')}</Text>
            </View>
          )}

          {/* Email Section */}
          <View style={styles.infoSection}>
            <Text variant="labelLarge" style={styles.label}>
              {t('common.email')}
            </Text>
            <Text variant="bodyLarge">{profile?.email}</Text>
          </View>

          {/* Travel Preferences Section */}
          <Text variant="titleMedium" style={styles.sectionTitle}>
            {t('profile.travelPreferences')}
          </Text>

          {/* Budget */}
          <View style={styles.preferenceSection}>
            <Text variant="labelLarge" style={styles.label}>
              {t('profile.budget')}
            </Text>
            {editing ? (
              <SegmentedButtons
                value={preferences.budget || ''}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, budget: value as any })
                }
                buttons={[
                  { value: 'low', label: t('profile.budgetLow') },
                  { value: 'medium', label: t('profile.budgetMedium') },
                  { value: 'high', label: t('profile.budgetHigh') },
                ]}
                style={styles.segmentedButtons}
              />
            ) : (
              <Text variant="bodyLarge">
                {preferences.budget
                  ? t(`profile.budget${preferences.budget.charAt(0).toUpperCase() + preferences.budget.slice(1)}`)
                  : t('common.noData')}
              </Text>
            )}
          </View>

          {/* Travel Style */}
          <View style={styles.preferenceSection}>
            <Text variant="labelLarge" style={styles.label}>
              {t('profile.travelStyle')}
            </Text>
            {editing ? (
              <SegmentedButtons
                value={preferences.travelStyle || ''}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, travelStyle: value as any })
                }
                buttons={[
                  { value: 'adventure', label: t('profile.styleAdventure') },
                  { value: 'relaxation', label: t('profile.styleRelaxation') },
                  { value: 'culture', label: t('profile.styleCulture') },
                  { value: 'nature', label: t('profile.styleNature') },
                ]}
                style={styles.segmentedButtons}
              />
            ) : (
              <Text variant="bodyLarge">
                {preferences.travelStyle
                  ? t(`profile.style${preferences.travelStyle.charAt(0).toUpperCase() + preferences.travelStyle.slice(1)}`)
                  : t('common.noData')}
              </Text>
            )}
          </View>

          {/* Accommodation */}
          <View style={styles.preferenceSection}>
            <Text variant="labelLarge" style={styles.label}>
              {t('profile.accommodation')}
            </Text>
            {editing ? (
              <SegmentedButtons
                value={preferences.accommodation || ''}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, accommodation: value as any })
                }
                buttons={[
                  { value: 'hotel', label: t('profile.accomHotel') },
                  { value: 'hostel', label: t('profile.accomHostel') },
                  { value: 'airbnb', label: t('profile.accomAirbnb') },
                  { value: 'camping', label: t('profile.accomCamping') },
                ]}
                style={styles.segmentedButtons}
              />
            ) : (
              <Text variant="bodyLarge">
                {preferences.accommodation
                  ? t(`profile.accom${preferences.accommodation.charAt(0).toUpperCase() + preferences.accommodation.slice(1)}`)
                  : t('common.noData')}
              </Text>
            )}
          </View>

          {/* Transportation */}
          <View style={styles.preferenceSection}>
            <Text variant="labelLarge" style={styles.label}>
              {t('profile.transportation')}
            </Text>
            {editing ? (
              <SegmentedButtons
                value={preferences.transportation || ''}
                onValueChange={(value) =>
                  setPreferences({ ...preferences, transportation: value as any })
                }
                buttons={[
                  { value: 'flight', label: t('profile.transportFlight') },
                  { value: 'train', label: t('profile.transportTrain') },
                  { value: 'car', label: t('profile.transportCar') },
                  { value: 'bus', label: t('profile.transportBus') },
                ]}
                style={styles.segmentedButtons}
              />
            ) : (
              <Text variant="bodyLarge">
                {preferences.transportation
                  ? t(`profile.transport${preferences.transportation.charAt(0).toUpperCase() + preferences.transportation.slice(1)}`)
                  : t('common.noData')}
              </Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {editing ? (
              <>
                <Button
                  mode="contained"
                  onPress={handleSave}
                  loading={saving}
                  disabled={saving}
                  style={styles.button}
                >
                  {t('buttons.save')}
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleCancel}
                  disabled={saving}
                  style={styles.button}
                >
                  {t('buttons.cancel')}
                </Button>
              </>
            ) : (
              <Button
                mode="contained"
                onPress={() => setEditing(true)}
                icon="pencil"
                style={styles.button}
              >
                {t('buttons.edit')}
              </Button>
            )}
          </View>

          {/* Logout Button */}
          {!editing && (
            <Button
              mode="outlined"
              onPress={handleLogout}
              icon="logout"
              style={[styles.button, styles.logoutButton]}
              textColor={theme.colors.error}
            >
              {t('common.logout')}
            </Button>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  card: {
    marginBottom: spacing.md,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  avatarButton: {
    marginTop: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  infoSection: {
    marginBottom: spacing.md,
  },
  label: {
    color: theme.colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    fontWeight: 'bold',
  },
  preferenceSection: {
    marginBottom: spacing.md,
  },
  segmentedButtons: {
    marginTop: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  button: {
    marginTop: spacing.sm,
  },
  logoutButton: {
    borderColor: theme.colors.error,
  },
  loadingText: {
    marginTop: spacing.md,
  },
});
