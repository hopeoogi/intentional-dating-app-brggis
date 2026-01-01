
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Image } from 'react-native';
import { router } from 'expo-router';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';

interface IntroVideoSettings {
  url: string;
  enabled: boolean;
  duration: number;
}

export default function IntroVideoScreen() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<IntroVideoSettings | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const videoRef = useRef<Video>(null);

  const navigateToNext = useCallback(async () => {
    try {
      console.log('[IntroVideo] Navigating to next screen...');
      
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('[IntroVideo] Session error:', sessionError);
        router.replace('/signin');
        return;
      }
      
      if (session) {
        console.log('[IntroVideo] User is authenticated, checking onboarding status...');
        
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('onboarding_complete')
          .eq('auth_user_id', session.user.id)
          .maybeSingle();

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
          
          const { data: pendingData, error: pendingError } = await supabase
            .from('pending_users')
            .select('status')
            .eq('auth_user_id', session.user.id)
            .maybeSingle();

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

  const loadIntroSettings = useCallback(async () => {
    try {
      console.log('[IntroVideo] Loading intro settings...');
      
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'intro_video')
        .maybeSingle();

      if (error) {
        console.error('[IntroVideo] Error loading intro settings:', error);
        // Skip intro video and go to next screen
        navigateToNext();
        return;
      }

      if (!data || !data.setting_value) {
        console.log('[IntroVideo] No intro video settings found, skipping...');
        navigateToNext();
        return;
      }

      const introSettings = data.setting_value as IntroVideoSettings;
      console.log('[IntroVideo] Settings loaded:', introSettings);
      
      setSettings(introSettings);

      if (!introSettings.enabled) {
        console.log('[IntroVideo] Intro video disabled, skipping...');
        navigateToNext();
        return;
      }

      // Check if URL is a video or image
      const url = introSettings.url.toLowerCase();
      const videoExtensions = ['.mp4', '.mov', '.m4v', '.avi'];
      const isVideoFile = videoExtensions.some(ext => url.includes(ext));
      setIsVideo(isVideoFile);

      console.log('[IntroVideo] Media type:', isVideoFile ? 'video' : 'image');

      // If it's an image, show for specified duration
      if (!isVideoFile) {
        const duration = introSettings.duration || 3000;
        console.log('[IntroVideo] Showing image for', duration, 'ms');
        setTimeout(() => {
          navigateToNext();
        }, duration);
      }

      setLoading(false);
    } catch (error) {
      console.error('[IntroVideo] Unexpected error in loadIntroSettings:', error);
      // Always navigate to next screen on error to prevent app from being stuck
      navigateToNext();
    }
  }, [navigateToNext]);

  useEffect(() => {
    loadIntroSettings();
  }, [loadIntroSettings]);

  const handleVideoStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      navigateToNext();
    }
  }, [navigateToNext]);

  if (loading || !settings) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isVideo ? (
        <Video
          ref={videoRef}
          source={{ uri: settings.url }}
          style={styles.media}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          isMuted={false}
          onPlaybackStatusUpdate={handleVideoStatusUpdate}
        />
      ) : (
        <Image
          source={{ uri: settings.url }}
          style={styles.media}
          resizeMode="cover"
        />
      )}
      <View style={styles.overlay}>
        <Text style={styles.brandName}>Intentional</Text>
        <Text style={styles.tagline}>Where connections matter</Text>
      </View>
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
  media: {
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
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  brandName: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});
