
import { Stack } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export default function ApplyLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.backgroundLight },
        headerTintColor: colors.text,
        headerBackTitle: 'Back',
      }}
    />
  );
}
