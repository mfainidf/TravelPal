import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthState {
  session: Session | null;
  user: User | null;
  loading: boolean;
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,

  setSession: (session) => set({ session, user: session?.user ?? null }),
  
  setUser: (user) => set({ user }),
  
  setLoading: (loading) => set({ loading }),

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },

  initialize: async () => {
    try {
      set({ loading: true });
      
      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      set({ session, user: session?.user ?? null });

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null });
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ loading: false });
    }
  },
}));
