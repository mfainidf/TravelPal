import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { theme } from '../src/theme/theme';
import { queryClient } from '../src/services/queryClient';
import { useAuthStore } from '../src/stores/authStore';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { session, loading, initialize, cleanup } = useAuthStore();

  useEffect(() => {
    initialize();
    return () => cleanup();
    // initialize and cleanup are stable functions from Zustand and don't need to be in deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!session && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Redirect to tabs if authenticated
      router.replace('/(tabs)');
    }
  }, [session, segments, loading, router]);

  if (loading) {
    return null; // Or a loading screen
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <Slot />
      </PaperProvider>
    </QueryClientProvider>
  );
}
