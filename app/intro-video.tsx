
import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

export default function IntroVideoScreen() {
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [imageError, setImageError] = useState(false);

  const navigateToNext = useCallback(async () => {
    try {
      console.log('[IntroVideo] Navigating to next screen...');
      
      // Check session with timeout protection
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), 3000)
      );
      
      const result = await Promise.race([sessionPromise, timeoutPromise]);
      const { data: { session }, error: sessionError } = result as any;
      
      if (sessionError) {
        console.log('[IntroVideo] Session error, redirecting to signin:', sessionError.message);
        router.replace('/signin');
        return;
      }
      
      if (session) {
        console.log('[IntroVideo] User authenticated, checking profile...');
        
        // Check user profile with timeout
        const userPromise = supabase
          .from('users')
          .select('onboarding_complete')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();
        
        const userTimeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('User data timeout')), 3000)
        );
        
        const userResult = await Promise.race([userPromise, userTimeoutPromise]);
        const { data: userData, error: userError } = userResult as any;

        if (userError) {
          console.log('[IntroVideo] User data error, redirecting to signin:', userError.message);
          router.replace('/signin');
          return;
        }

        if (userData?.onboarding_complete) {
          console.log('[IntroVideo] Onboarding complete, going to home...');
          router.replace('/(tabs)/(home)/');
          return;
        }

        // Check pending application status with timeout
        const pendingPromise = supabase
          .from('pending_users')
          .select('status')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();
        
        const pendingTimeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Pending check timeout')), 3000)
        );
        
        const pendingResult = await Promise.race([pendingPromise, pendingTimeoutPromise]);
        const { data: pendingData, error: pendingError } = pendingResult as any;

        if (pendingError) {
          console.log('[IntroVideo] Pending check error, going to application:', pendingError.message);
          router.replace('/apply/step-1');
          return;
        }

        if (pendingData?.status === 'pending') {
          console.log('[IntroVideo] Application pending...');
          router.replace('/application-pending');
        } else {
          console.log('[IntroVideo] No pending application, starting application...');
          router.replace('/apply/step-1');
        }
      } else {
        console.log('[IntroVideo] No session, going to signin...');
        router.replace('/signin');
      }
    } catch (error) {
      console.error('[IntroVideo] Navigation error:', error);
      // Always fallback to signin on any error
      router.replace('/signin');
    }
  }, []);

  useEffect(() => {
    console.log('[IntroVideo] Component mounted - BUILD 143');
    
    // Show skip button after 1.5 seconds
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 1500);
    
    // Auto-navigate after 3 seconds
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

  return (
    <View style={styles.container}>
      {!imageError && (
        <Image
          source={require('../assets/images/natively-dark.png')}
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
