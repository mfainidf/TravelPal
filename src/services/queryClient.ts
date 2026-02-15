import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import type { PersistedClient, Persister } from '@tanstack/react-query-persist-client';

// Create a client
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Create an AsyncStorage persister
export const asyncStoragePersister: Persister = {
  persistClient: async (client: PersistedClient) => {
    await AsyncStorage.setItem('REACT_QUERY_OFFLINE_CACHE', JSON.stringify(client));
  },
  restoreClient: async () => {
    const cachedClient = await AsyncStorage.getItem('REACT_QUERY_OFFLINE_CACHE');
    return cachedClient ? JSON.parse(cachedClient) : undefined;
  },
  removeClient: async () => {
    await AsyncStorage.removeItem('REACT_QUERY_OFFLINE_CACHE');
  },
};

// Export the configured provider props
export const persistOptions = {
  persister: asyncStoragePersister,
  maxAge: 1000 * 60 * 60 * 24, // 24 hours
};

export { PersistQueryClientProvider };
