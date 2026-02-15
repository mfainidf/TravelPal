import { create } from 'zustand';
import { supabase } from '../services/supabase';
import { ProfileStorageService } from '../services/profileStorage';
import { UserProfile, ProfileSession } from '../types/profile';

interface ProfileStoreState {
  profiles: UserProfile[];
  activeProfile: UserProfile | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  loadProfiles: () => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  addProfile: (email: string, password: string, name: string) => Promise<void>;
  removeProfile: (profileId: string) => Promise<void>;
  updateActiveProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
}

export const useProfileStore = create<ProfileStoreState>((set, get) => ({
  profiles: [],
  activeProfile: null,
  isLoading: false,
  error: null,

  /**
   * Load profiles from AsyncStorage and set active profile
   */
  loadProfiles: async () => {
    set({ isLoading: true, error: null });
    try {
      const state = await ProfileStorageService.getProfilesState();
      const activeProfile = state.profiles.find((p) => p.id === state.activeProfileId) || null;

      set({
        profiles: state.profiles,
        activeProfile,
        isLoading: false,
      });

      // If there's an active profile, restore its session
      if (activeProfile && state.sessions[activeProfile.id]) {
        const session = state.sessions[activeProfile.id];
        await supabase.auth.setSession({
          access_token: session.accessToken,
          refresh_token: session.refreshToken,
        });
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Errore nel caricamento profili',
        isLoading: false,
      });
    }
  },

  /**
   * Switch to a different profile
   */
  switchProfile: async (profileId: string) => {
    set({ isLoading: true, error: null });
    try {
      const { profiles } = get();
      const profile = profiles.find((p) => p.id === profileId);

      if (!profile) {
        throw new Error('Profilo non trovato');
      }

      // Get stored session for this profile
      const session = await ProfileStorageService.getSession(profileId);

      if (session) {
        // Restore session in Supabase
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: session.accessToken,
          refresh_token: session.refreshToken,
        });

        if (sessionError) {
          throw sessionError;
        }
      }

      // Update active profile in storage
      await ProfileStorageService.setActiveProfileId(profileId);

      // Update last active time
      const updatedProfile = {
        ...profile,
        lastActiveAt: new Date().toISOString(),
      };
      await ProfileStorageService.addOrUpdateProfile(updatedProfile);

      set({
        activeProfile: updatedProfile,
        profiles: profiles.map((p) => (p.id === profileId ? updatedProfile : p)),
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Errore nel cambio profilo',
        isLoading: false,
      });
    }
  },

  /**
   * Add a new profile by signing in
   */
  addProfile: async (email: string, password: string, name: string) => {
    set({ isLoading: true, error: null });
    try {
      // Sign in with Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!data.user || !data.session) throw new Error('Sessione non valida');

      // Create profile object
      const newProfile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        name,
        avatar: data.user.user_metadata?.avatar_url,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
      };

      // Save profile
      await ProfileStorageService.addOrUpdateProfile(newProfile);

      // Save session
      const session: ProfileSession = {
        profileId: data.user.id,
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresAt: data.session.expires_at || 0,
      };
      await ProfileStorageService.saveSession(data.user.id, session);

      // Set as active profile
      await ProfileStorageService.setActiveProfileId(data.user.id);

      const { profiles } = get();
      set({
        profiles: [...profiles, newProfile],
        activeProfile: newProfile,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Errore nell\'aggiunta profilo',
        isLoading: false,
      });
    }
  },

  /**
   * Remove a profile
   */
  removeProfile: async (profileId: string) => {
    set({ isLoading: true, error: null });
    try {
      await ProfileStorageService.removeProfile(profileId);

      const { profiles, activeProfile } = get();
      const newProfiles = profiles.filter((p) => p.id !== profileId);

      // If removing active profile, switch to another or null
      let newActiveProfile = activeProfile;
      if (activeProfile?.id === profileId) {
        newActiveProfile = newProfiles[0] || null;
        if (newActiveProfile) {
          await get().switchProfile(newActiveProfile.id);
        } else {
          await supabase.auth.signOut();
          set({ activeProfile: null });
        }
      }

      set({
        profiles: newProfiles,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Errore nella rimozione profilo',
        isLoading: false,
      });
    }
  },

  /**
   * Update active profile data
   */
  updateActiveProfile: async (updates: Partial<UserProfile>) => {
    const { activeProfile, profiles } = get();
    if (!activeProfile) return;

    const updatedProfile = { ...activeProfile, ...updates };
    await ProfileStorageService.addOrUpdateProfile(updatedProfile);

    set({
      activeProfile: updatedProfile,
      profiles: profiles.map((p) => (p.id === activeProfile.id ? updatedProfile : p)),
    });
  },

  /**
   * Logout current profile
   */
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await supabase.auth.signOut();
      await ProfileStorageService.setActiveProfileId(null);

      set({
        activeProfile: null,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Errore nel logout',
        isLoading: false,
      });
    }
  },
}));
