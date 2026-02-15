import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider } from 'react-native-paper';
import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import theme from '../src/theme';
import { queryClient } from '../src/services/queryClient';
import { useAuthStore } from '../src/stores/authStore';
import '../src/i18n';

export default function RootLayout() {
  const { initialize, cleanup } = useAuthStore();

  useEffect(() => {
    initialize();
    return () => cleanup();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="trip" />
        </Stack>
      </PaperProvider>
    </QueryClientProvider>
  );
}
