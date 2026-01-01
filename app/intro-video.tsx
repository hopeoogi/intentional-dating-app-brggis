
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

export default function IntroVideoScreen() {
  const [loading, setLoading] = useState(true);
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [imageError, setImageError] = useState(false);

  const navigateToNext = useCallback(async () => {
    try {
      console.log('[IntroVideo] Navigating to next screen...');
      
      // Add timeout protection for session check
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 5000)
      );
      
      const { data: { session }, error: sessionError } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;
      
      if (sessionError) {
        console.error('[IntroVideo] Session error:', sessionError);
        router.replace('/signin');
        return;
      }
      
      if (session) {
        console.log('[IntroVideo] User is authenticated, checking onboarding status...');
        
        // Add timeout protection for user data fetch
        const userPromise = supabase
          .from('users')
          .select('onboarding_complete')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();
        
        const userTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('User data fetch timeout')), 5000)
        );
        
        const { data: userData, error: userError } = await Promise.race([
          userPromise,
          userTimeoutPromise
        ]) as any;

        if (userError) {
          console.error('[IntroVideo] Error fetching user data:', userError);
          router.replace('/signin');
          return;
        }

        if (userData?.onboarding_complete) {
          console.log('[IntroVideo] User onboarding complete, going to home...');
          router.replace('/(tabs)/(home)/');
        } else {
          console.log('[IntroVideo] User onboarding incomplete, checking pending status...');
          
          // Add timeout protection for pending user check
          const pendingPromise = supabase
            .from('pending_users')
            .select('status')
            .eq('auth_user_id', session.user.id)
            .maybeSingle();
          
          const pendingTimeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Pending user check timeout')), 5000)
          );
          
          const { data: pendingData, error: pendingError } = await Promise.race([
            pendingPromise,
            pendingTimeoutPromise
          ]) as any;

          if (pendingError) {
            console.error('[IntroVideo] Error fetching pending user data:', pendingError);
            router.replace('/apply/step-1');
            return;
          }

          if (pendingData?.status === 'pending') {
            console.log('[IntroVideo] Application pending, going to pending screen...');
            router.replace('/application-pending');
          } else {
            console.log('[IntroVideo] No pending application, going to application...');
            router.replace('/apply/step-1');
          }
        }
      } else {
        console.log('[IntroVideo] No session, going to sign in...');
        router.replace('/signin');
      }
    } catch (error) {
      console.error('[IntroVideo] Unexpected error in navigateToNext:', error);
      // Default to sign in screen on any error
      router.replace('/signin');
    }
  }, []);

  useEffect(() => {
    console.log('[IntroVideo] Component mounted, starting intro sequence...');
    
    // Show skip button after 2 seconds
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 2000);
    
    // Hide loading indicator immediately
    setLoading(false);
    
    // Navigate after 3 seconds
    const navTimer = setTimeout(() => {
      navigateToNext();
    }, 3000);
    
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(navTimer);
    };
  }, [navigateToNext]);

  const handleSkip = useCallback(() => {
    console.log('[IntroVideo] User skipped intro');
    navigateToNext();
  }, [navigateToNext]);

  const handleImageError = useCallback(() => {
    console.error('[IntroVideo] Failed to load intro image');
    setImageError(true);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!imageError && (
        <Image
          source={require('../assets/images/intro-image.png')}
          style={styles.image}
          resizeMode="cover"
          onError={handleImageError}
        />
      )}
      <View style={styles.overlay}>
        <Text style={styles.brandName}>Intentional</Text>
        <Text style={styles.tagline}>Where connections matter</Text>
      </View>
      {showSkipButton && (
        <TouchableOpacity 
          style={styles.skipButton}
          onPress={handleSkip}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  brandName: {
    fontSize: 56,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 15,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 16,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
