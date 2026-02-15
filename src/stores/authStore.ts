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
  initialize: () => void;
  cleanup: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  let authSubscription: { subscription: { unsubscribe: () => void } } | null = null;

  return {
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
    
    initialize: () => {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        set({ session, user: session?.user ?? null, loading: false });
      });

      // Subscribe to auth changes
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        set({ session, user: session?.user ?? null, loading: false });
      });
      authSubscription = data;
    },
    
    cleanup: () => {
      authSubscription?.subscription?.unsubscribe();
    },
  };
});
