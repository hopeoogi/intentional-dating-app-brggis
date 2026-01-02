
// CRITICAL: Import URL polyfill FIRST before any other imports
import 'react-native-url-polyfill/auto';
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert, View, Text, ActivityIndicator } from "react-native";
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

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.error('[App] Failed to prevent splash screen auto-hide:', error);
});

// ============================================================================
// BUILD 169 - CRASH FIX AND NEW YORK SKYLINE LOAD SCREEN
// ============================================================================
// Key improvements:
// 1. Better error handling in initialization
// 2. Simplified splash screen management
// 3. Enhanced network detection with fallback
// 4. Robust font loading with error recovery
// 5. Maintained API sync fixes from Build 168
// ============================================================================

console.log('='.repeat(80));
console.log('[App] Starting app initialization - BUILD 169');
console.log('[App] Version: 1.2.7');
console.log('[App] Platform:', require('react-native').Platform.OS);
console.log('[App] Production-ready configuration');
console.log('[App] All HTTP libraries blocked - using native fetch only');
console.log('[App] Edge Functions CORS issues resolved');
console.log('[App] New York skyline load screen implemented');
console.log('='.repeat(80));

// Initialize Sentry for crash reporting (non-blocking)
initializeSentry().catch((error) => {
  console.error('[App] Failed to initialize Sentry:', error);
  // Don't throw - continue app initialization
});

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [isReady, setIsReady] = useState(false);

  // Handle font loading
  useEffect(() => {
    if (loaded || error) {
      console.log('[App] Fonts loaded:', loaded, 'Error:', error);
      
      // Hide splash screen after a short delay
      setTimeout(() => {
        SplashScreen.hideAsync()
          .then(() => {
            console.log('[App] Splash screen hidden successfully');
            setIsReady(true);
          })
          .catch((err) => {
            console.error('[App] Error hiding splash screen:', err);
            // Still mark as ready even if splash screen fails to hide
            setIsReady(true);
          });
      }, 500);
    }
  }, [loaded, error]);

  // Handle network state changes
  useEffect(() => {
    if (!networkState) {
      console.log('[App] Network state not available yet');
      return;
    }

    if (networkState.isConnected === false && networkState.isInternetReachable === false) {
      console.log('[App] Network offline detected');
      Alert.alert(
        "No Internet Connection",
        "Please check your internet connection and try again.",
        [{ text: 'OK' }]
      );
    } else if (networkState.isConnected) {
      console.log('[App] ✅ Network is online');
    }
  }, [networkState?.isConnected, networkState?.isInternetReachable]);

  // Show loading screen while fonts are loading
  if (!loaded && !error) {
    return null;
  }

  // Show error screen if fonts failed to load
  if (error) {
    console.error('[App] Font loading error:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Text style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>Failed to load fonts</Text>
        <Text style={{ color: '#ccc', fontSize: 14 }}>Please restart the app</Text>
      </View>
    );
  }

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)",
      background: "rgb(242, 242, 247)",
      card: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      border: "rgb(216, 216, 220)",
      notification: "rgb(255, 59, 48)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)",
      background: "rgb(1, 1, 1)",
      card: "rgb(28, 28, 30)",
      text: "rgb(255, 255, 255)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(255, 69, 58)",
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
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }}>
                {/* Entry point */}
                <Stack.Screen name="index" options={{ headerShown: false }} />

                {/* Auth & Onboarding */}
                <Stack.Screen name="intro-video" options={{ headerShown: false }} />
                <Stack.Screen name="signin" options={{ headerShown: false }} />
                <Stack.Screen name="application-pending" options={{ headerShown: false }} />
                <Stack.Screen name="apply" options={{ headerShown: false }} />

                {/* Main app with tabs */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

                {/* Modal Screens */}
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

                {/* Admin Portal */}
                <Stack.Screen name="admin/index" options={{ title: "Admin Portal" }} />
                <Stack.Screen name="admin/intro-video" options={{ title: "Intro Video", headerShown: false }} />
                <Stack.Screen name="admin/pending-users" options={{ title: "Pending Users" }} />
                <Stack.Screen name="admin/user-management" options={{ title: "User Management" }} />
                <Stack.Screen name="admin/analytics" options={{ title: "Analytics" }} />
                <Stack.Screen name="admin/notifications" options={{ title: "Notifications" }} />
                <Stack.Screen name="admin/promo-codes" options={{ title: "Promo Codes" }} />
                <Stack.Screen name="admin/payments" options={{ title: "Payments" }} />
                <Stack.Screen name="admin/email-campaigns" options={{ title: "Email Campaigns" }} />

                {/* Other App Routes */}
                <Stack.Screen name="chat" options={{ title: "Chat" }} />
                <Stack.Screen name="profile-detail" options={{ title: "Profile" }} />
                <Stack.Screen name="start-conversation" options={{ title: "Start Conversation" }} />
                <Stack.Screen name="settings" options={{ title: "Settings" }} />
                <Stack.Screen name="match-filters" options={{ title: "Match Filters" }} />
                <Stack.Screen name="subscription" options={{ title: "Subscription" }} />
                <Stack.Screen name="rejection-feedback" options={{ title: "Rejection Feedback" }} />
              </Stack>
              <SystemBars style="auto" />
            </GestureHandlerRootView>
          </WidgetProvider>
        </UserProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
