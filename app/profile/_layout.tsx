import { Stack } from 'expo-router';

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="add"
        options={{
          title: 'Aggiungi Profilo',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
