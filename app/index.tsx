
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';
import { colors } from '@/styles/commonStyles';

// ============================================================================
// BUILD 163 - ROBUST APP ENTRY POINT
// ============================================================================
// This is the main entry point of the app. It checks authentication status
// and redirects to the appropriate screen.
// 
// Key improvements:
// 1. Check auth status before navigation
// 2. Direct navigation without intermediate screens
// 3. Better error handling
// 4. Fallback to signin if anything fails
// ============================================================================

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    console.log('[Index] App starting - BUILD 163');
    checkAuthAndIntro();
  }, []);

  const checkAuthAndIntro = async () => {
    try {
      console.log('[Index] Checking authentication status...');
      
      // Check if user has seen intro
      const hasSeenIntro = await checkIfSeenIntro();
      console.log('[Index] Has seen intro:', hasSeenIntro);
      setShowIntro(!hasSeenIntro);

      // Check authentication
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('[Index] Auth check error:', error);
        setIsAuthenticated(false);
      } else if (session) {
        console.log('[Index] User is authenticated');
        setIsAuthenticated(true);
      } else {
        console.log('[Index] User is not authenticated');
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('[Index] Error checking auth:', error);
      setIsAuthenticated(false);
      setShowIntro(false); // Skip intro on error
    } finally {
      setIsReady(true);
    }
  };

  const checkIfSeenIntro = async (): Promise<boolean> => {
    try {
      // For now, always show intro on first launch
      // You can implement AsyncStorage check here if needed
      return false;
    } catch (error) {
      console.error('[Index] Error checking intro status:', error);
      return true; // Skip intro on error
    }
  };

  if (!isReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // If authenticated, go to home
  if (isAuthenticated) {
    console.log('[Index] Redirecting to home...');
    return <Redirect href="/(tabs)/(home)/" />;
  }

  // If should show intro, go to intro
  if (showIntro) {
    console.log('[Index] Redirecting to intro...');
    return <Redirect href="/intro-video" />;
  }

  // Default: go to signin
  console.log('[Index] Redirecting to signin...');
  return <Redirect href="/signin" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
