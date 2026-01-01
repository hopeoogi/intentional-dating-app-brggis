
// CRITICAL: Import URL polyfill FIRST before any other imports
// This ensures URL parsing is available for all modules
import 'react-native-url-polyfill/auto';
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { UserProvider } from "@/contexts/UserContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { initializeSentry } from "@/app/integrations/sentry/client";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Initialize crash reporting
console.log('[App] Starting app initialization...');
console.log('[App] React Native version:', require('react-native/package.json').version);
console.log('[App] Expo version:', require('expo/package.json').version);

initializeSentry().catch((error) => {
  console.error('[App] Failed to initialize Sentry:', error);
});

export const unstable_settings = {
  initialRouteName: "(tabs)", // Ensure any route can link back to `/`
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      // Use hide() instead of hideAsync() for better compatibility
      SplashScreen.hide();
    }
  }, [loaded]);

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (!loaded) {
    return null;
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)", // System Blue
      background: "rgb(242, 242, 247)", // Light mode background
      card: "rgb(255, 255, 255)", // White cards/surfaces
      text: "rgb(0, 0, 0)", // Black text for light mode
      border: "rgb(216, 216, 220)", // Light gray for separators/borders
      notification: "rgb(255, 59, 48)", // System Red
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)", // System Blue (Dark Mode)
      background: "rgb(1, 1, 1)", // True black background for OLED displays
      card: "rgb(28, 28, 30)", // Dark card/surface color
      text: "rgb(255, 255, 255)", // White text for dark mode
      border: "rgb(44, 44, 46)", // Dark gray for separators/borders
      notification: "rgb(255, 69, 58)", // System Red (Dark Mode)
    },
  };
  
  return (
    <ErrorBoundary>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <UserProvider>
          <WidgetProvider>
            <GestureHandlerRootView>
              <Stack>
                {/* Main app with tabs */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Modal Demo Screens */}
                <Stack.Screen
                  name="modal"
                  options={{
                    presentation: "modal",
                    title: "Standard Modal",
                  }}
                />
                <Stack.Screen
                  name="formsheet"
                  options={{
                    presentation: "formSheet",
                    title: "Form Sheet Modal",
                    sheetGrabberVisible: true,
                    sheetAllowedDetents: [0.5, 0.8, 1.0],
                    sheetCornerRadius: 20,
                  }}
                />
                <Stack.Screen
                  name="transparent-modal"
                  options={{
                    presentation: "transparentModal",
                    headerShown: false,
                  }}
                />

                {/* Admin Portal Routes */}
                <Stack.Screen
                  name="admin/index"
                  options={{
                    title: "Admin Portal",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="admin/intro-video"
                  options={{
                    title: "Intro Video",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="admin/pending-users"
                  options={{
                    title: "Pending Users",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="admin/user-management"
                  options={{
                    title: "User Management",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="admin/analytics"
                  options={{
                    title: "Analytics",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="admin/notifications"
                  options={{
                    title: "Notifications",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="admin/promo-codes"
                  options={{
                    title: "Promo Codes",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="admin/payments"
                  options={{
                    title: "Payments",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="admin/email-campaigns"
                  options={{
                    title: "Email Campaigns",
                    headerShown: true,
                  }}
                />

                {/* Auth & Onboarding Routes */}
                <Stack.Screen
                  name="intro-video"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="signin"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="application-pending"
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="apply"
                  options={{
                    headerShown: false,
                  }}
                />

                {/* Other App Routes */}
                <Stack.Screen
                  name="chat"
                  options={{
                    title: "Chat",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="profile-detail"
                  options={{
                    title: "Profile",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="start-conversation"
                  options={{
                    title: "Start Conversation",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="settings"
                  options={{
                    title: "Settings",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="match-filters"
                  options={{
                    title: "Match Filters",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="subscription"
                  options={{
                    title: "Subscription",
                    headerShown: true,
                  }}
                />
                <Stack.Screen
                  name="rejection-feedback"
                  options={{
                    title: "Rejection Feedback",
                    headerShown: true,
                  }}
                />
              </Stack>
              <SystemBars style={"auto"} />
            </GestureHandlerRootView>
          </WidgetProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
