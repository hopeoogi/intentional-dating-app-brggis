
import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, ImageBackground, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';
import { colors } from '@/styles/commonStyles';

// ============================================================================
// BUILD 172 - WORKING EDGE FUNCTION PATTERN
// ============================================================================
// Simplified Edge Functions based on proven working examples
// ============================================================================

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log('[Index] App starting - BUILD 172');
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
      setShowIntro(false);
    } finally {
      setIsReady(true);
    }
  };

  const checkIfSeenIntro = async (): Promise<boolean> => {
    try {
      return false;
    } catch (error) {
      console.error('[Index] Error checking intro status:', error);
      return true;
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
              console.log('[Index] Failed to load image, using fallback');
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

  if (isAuthenticated) {
    console.log('[Index] Redirecting to home...');
    return <Redirect href="/(tabs)/(home)/" />;
  }

  if (showIntro) {
    console.log('[Index] Redirecting to intro...');
    return <Redirect href="/intro-video" />;
  }

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
