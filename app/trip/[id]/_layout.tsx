import { Stack } from 'expo-router';

export default function TripIdLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: 'Indietro',
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'Dettagli Viaggio',
        }}
      />
    </Stack>
  );
}
