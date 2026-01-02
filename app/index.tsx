
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';
import { colors } from '@/styles/commonStyles';

// ============================================================================
// BUILD 170 - COMPREHENSIVE API SYNC FIX
// ============================================================================
// This is the main entry point of the app. It checks authentication status
// and redirects to the appropriate screen.
// 
// Key improvements:
// 1. Fixed Edge Functions with comprehensive CORS headers
// 2. Enhanced error handling in all Edge Functions
// 3. Better logging and debugging capabilities
// 4. Maintained all previous fixes from Build 169
// ============================================================================

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log('[Index] App starting - BUILD 170');
    checkAuthAndIntro();
  }, []);

  const checkAuthAndIntro = async () => {
    try {
      console.log('[Index] Checking authentication status...');
      
      // Check if user has seen intro
      const hasSeenIntro = await checkIfSeenIntro();
      console.log('[Index] Has seen intro:', hasSeenIntro);
      setShowIntro(!hasSeenIntro);

      // Check authentication with timeout
      const authPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Auth check timeout')), 5000)
      );

      const { data: { session }, error } = await Promise.race([
        authPromise,
        timeoutPromise
      ]) as any;
      
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
        {!imageError ? (
          <ImageBackground
            source={{ uri: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop' }}
            style={styles.backgroundImage}
            resizeMode="cover"
            onError={() => {
              console.log('[Index] Failed to load New York skyline image, using fallback');
              setImageError(true);
            }}
          >
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#FFFFFF" />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          </ImageBackground>
        ) : (
          <View style={styles.fallbackContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading...</Text>
          </View>
        )}
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
    backgroundColor: '#000000',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
});
