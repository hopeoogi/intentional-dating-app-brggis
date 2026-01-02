
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="apply" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="start-conversation" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="match-filters" />
        <Stack.Screen name="application-pending" />
      </Stack>
    </AuthProvider>
  );
}
