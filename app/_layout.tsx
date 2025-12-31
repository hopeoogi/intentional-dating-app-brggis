
import "react-native-reanimated";
import React, { useEffect, useState } from "react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert, View, Text, StyleSheet } from "react-native";
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch((error) => {
  console.error('[App] Error preventing splash screen auto-hide:', error);
});

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function RootLayoutContent() {
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const [appIsReady, setAppIsReady] = useState(false);

  // Handle font loading errors
  useEffect(() => {
    if (error) {
      console.error('[App] Font loading error:', error);
      // Continue anyway with system fonts
      setAppIsReady(true);
    }
  }, [error]);

  useEffect(() => {
    async function prepare() {
      try {
        console.log('[App] Preparing app...');
        
        // Pre-load any additional resources here
        // Artificially delay for splash screen (optional)
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log('[App] App ready');
      } catch (e) {
        console.error('[App] Error during app preparation:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    if (loaded) {
      prepare();
    }
  }, [loaded]);

  useEffect(() => {
    if (appIsReady && (loaded || error)) {
      // Hide splash screen
      try {
        SplashScreen.hideAsync().catch((err) => {
          console.error('[App] Error hiding splash screen:', err);
        });
        console.log('[App] Splash screen hidden');
      } catch (err) {
        console.error('[App] Error hiding splash screen:', err);
      }
    }
  }, [appIsReady, loaded, error]);

  useEffect(() => {
    if (
      networkState.isConnected === false &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  if (!loaded && !error) {
    return null;
  }

  if (!appIsReady) {
    return null;
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
    <>
      <StatusBar style="auto" animated />
      <ThemeProvider
        value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
      >
        <UserProvider>
          <WidgetProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
                <Stack.Screen
                  name="chat"
                  options={{
                    presentation: "card",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="profile-detail"
                  options={{
                    presentation: "card",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="start-conversation"
                  options={{
                    presentation: "card",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="match-filters"
                  options={{
                    presentation: "card",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="settings"
                  options={{
                    presentation: "card",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="subscription"
                  options={{
                    presentation: "card",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="rejection-feedback"
                  options={{
                    presentation: "modal",
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  name="admin"
                  options={{
                    headerShown: false,
                  }}
                />
              </Stack>
              <SystemBars style={"auto"} />
            </GestureHandlerRootView>
          </WidgetProvider>
        </UserProvider>
      </ThemeProvider>
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <RootLayoutContent />
    </ErrorBoundary>
  );
}
