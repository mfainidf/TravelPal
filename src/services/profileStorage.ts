import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, ProfilesState, ProfileSession } from '../types/profile';

const PROFILES_STORAGE_KEY = '@travelpal:profiles';
const ACTIVE_PROFILE_KEY = '@travelpal:active_profile';
const SESSIONS_STORAGE_KEY = '@travelpal:sessions';

/**
 * Service for managing multiple user profiles in AsyncStorage
 */
export class ProfileStorageService {
  /**
   * Get all stored profiles
   */
  static async getProfiles(): Promise<UserProfile[]> {
    try {
      const profilesJson = await AsyncStorage.getItem(PROFILES_STORAGE_KEY);
      return profilesJson ? JSON.parse(profilesJson) : [];
    } catch (error) {
      console.error('Error getting profiles:', error);
      return [];
    }
  }

  /**
   * Save profiles list to storage
   */
  static async saveProfiles(profiles: UserProfile[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error('Error saving profiles:', error);
      throw error;
    }
  }

  /**
   * Add or update a profile
   */
  static async addOrUpdateProfile(profile: UserProfile): Promise<void> {
    const profiles = await this.getProfiles();
    const existingIndex = profiles.findIndex((p) => p.id === profile.id);

    if (existingIndex >= 0) {
      profiles[existingIndex] = profile;
    } else {
      profiles.push(profile);
    }

    await this.saveProfiles(profiles);
  }

  /**
   * Remove a profile
   */
  static async removeProfile(profileId: string): Promise<void> {
    const profiles = await this.getProfiles();
    const filtered = profiles.filter((p) => p.id !== profileId);
    await this.saveProfiles(filtered);

    // Remove session for this profile
    await this.removeSession(profileId);

    // If removing active profile, clear active profile
    const activeId = await this.getActiveProfileId();
    if (activeId === profileId) {
      await this.setActiveProfileId(null);
    }
  }

  /**
   * Get active profile ID
   */
  static async getActiveProfileId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(ACTIVE_PROFILE_KEY);
    } catch (error) {
      console.error('Error getting active profile ID:', error);
      return null;
    }
  }

  /**
   * Set active profile ID
   */
  static async setActiveProfileId(profileId: string | null): Promise<void> {
    try {
      if (profileId) {
        await AsyncStorage.setItem(ACTIVE_PROFILE_KEY, profileId);
      } else {
        await AsyncStorage.removeItem(ACTIVE_PROFILE_KEY);
      }
    } catch (error) {
      console.error('Error setting active profile ID:', error);
      throw error;
    }
  }

  /**
   * Get all sessions
   */
  static async getSessions(): Promise<Record<string, ProfileSession>> {
    try {
      const sessionsJson = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
      return sessionsJson ? JSON.parse(sessionsJson) : {};
    } catch (error) {
      console.error('Error getting sessions:', error);
      return {};
    }
  }

  /**
   * Save session for a profile
   */
  static async saveSession(profileId: string, session: ProfileSession): Promise<void> {
    try {
      const sessions = await this.getSessions();
      sessions[profileId] = session;
      await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving session:', error);
      throw error;
    }
  }

  /**
   * Remove session for a profile
   */
  static async removeSession(profileId: string): Promise<void> {
    try {
      const sessions = await this.getSessions();
      delete sessions[profileId];
      await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error removing session:', error);
      throw error;
    }
  }

  /**
   * Get session for a profile
   */
  static async getSession(profileId: string): Promise<ProfileSession | null> {
    const sessions = await this.getSessions();
    return sessions[profileId] || null;
  }

  /**
   * Get complete profiles state
   */
  static async getProfilesState(): Promise<ProfilesState> {
    const [profiles, activeProfileId, sessions] = await Promise.all([
      this.getProfiles(),
      this.getActiveProfileId(),
      this.getSessions(),
    ]);

    return {
      profiles,
      activeProfileId,
      sessions,
    };
  }

  /**
   * Clear all profile data (for debugging/reset)
   */
  static async clearAll(): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(PROFILES_STORAGE_KEY),
      AsyncStorage.removeItem(ACTIVE_PROFILE_KEY),
      AsyncStorage.removeItem(SESSIONS_STORAGE_KEY),
    ]);
  }
}
