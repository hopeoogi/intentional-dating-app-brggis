
import React, { useEffect, useState } from 'react';
import { View, ImageBackground, StyleSheet, Animated } from 'react-native';
import { Redirect } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';

export default function LoadScreen() {
  const [isReady, setIsReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Check auth status after 3 seconds
    const timer = setTimeout(async () => {
      await checkAuthStatus();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        
        // Check if user has completed onboarding
        const { data: userData } = await supabase
          .from('users')
          .select('onboarding_complete')
          .eq('auth_user_id', session.user.id)
          .single();
        
        if (userData?.onboarding_complete) {
          setHasCompletedOnboarding(true);
        } else {
          // Check if they have a pending application
          const { data: pendingData } = await supabase
            .from('pending_users')
            .select('status')
            .eq('auth_user_id', session.user.id)
            .single();
          
          if (pendingData?.status === 'pending') {
            setIsPending(true);
          }
        }
      }
    } catch (error) {
      console.error('[LoadScreen] Error checking auth:', error);
    } finally {
      setIsReady(true);
    }
  };

  if (!isReady) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
        </ImageBackground>
      </View>
    );
  }

  // Redirect based on auth status
  if (isAuthenticated) {
    if (hasCompletedOnboarding) {
      return <Redirect href="/(tabs)/(home)" />;
    } else if (isPending) {
      return <Redirect href="/application-pending" />;
    } else {
      return <Redirect href="/apply/step-1" />;
    }
  }

  return <Redirect href="/welcome" />;
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
});
