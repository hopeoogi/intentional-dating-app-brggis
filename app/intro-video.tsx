
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
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
  const [showSkipButton, setShowSkipButton] = useState(false);
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
      console.log('[IntroVideo] Supabase client initialized:', !!supabase);
      
      // Show skip button after 2 seconds
      setTimeout(() => {
        setShowSkipButton(true);
      }, 2000);
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 10000)
      );
      
      const fetchPromise = supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'intro_video')
        .maybeSingle();
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]) as any;

      if (error) {
        console.error('[IntroVideo] Error loading intro settings:', error);
        console.error('[IntroVideo] Error code:', error.code);
        console.error('[IntroVideo] Error message:', error.message);
        console.error('[IntroVideo] Error details:', JSON.stringify(error, null, 2));
        
        // Show branded splash screen for 3 seconds then navigate
        console.log('[IntroVideo] Showing branded splash screen due to database error');
        setSettings({
          url: '',
          enabled: true,
          duration: 3000
        });
        setLoading(false);
        setTimeout(() => {
          navigateToNext();
        }, 3000);
        return;
      }

      if (!data || !data.setting_value) {
        console.log('[IntroVideo] No intro video settings found in database, showing splash...');
        setSettings({
          url: '',
          enabled: true,
          duration: 3000
        });
        setLoading(false);
        setTimeout(() => {
          navigateToNext();
        }, 3000);
        return;
      }

      const introSettings = data.setting_value as IntroVideoSettings;
      console.log('[IntroVideo] Settings loaded successfully:', {
        enabled: introSettings.enabled,
        hasUrl: !!introSettings.url,
        duration: introSettings.duration
      });
      
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
      console.error('[IntroVideo] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      
      // Show branded splash screen for 3 seconds then navigate
      console.log('[IntroVideo] Showing branded splash screen due to unexpected error');
      setSettings({
        url: '',
        enabled: true,
        duration: 3000
      });
      setLoading(false);
      setTimeout(() => {
        navigateToNext();
      }, 3000);
    }
  }, [navigateToNext]);

  useEffect(() => {
    loadIntroSettings();
  }, [loadIntroSettings]);

  const handleVideoStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      console.log('[IntroVideo] Video finished playing, navigating to next screen...');
      navigateToNext();
    }
  }, [navigateToNext]);

  const handleSkip = useCallback(() => {
    console.log('[IntroVideo] User skipped intro');
    navigateToNext();
  }, [navigateToNext]);

  if (loading || !settings) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isVideo && settings.url ? (
        <Video
          ref={videoRef}
          source={{ uri: settings.url }}
          style={styles.media}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          isMuted={false}
          onPlaybackStatusUpdate={handleVideoStatusUpdate}
          onError={(error) => {
            console.error('[IntroVideo] Video playback error:', error);
            // If video fails, show splash screen and navigate
            navigateToNext();
          }}
        />
      ) : settings.url ? (
        <Image
          source={{ uri: settings.url }}
          style={styles.media}
          resizeMode="cover"
          onError={(error) => {
            console.error('[IntroVideo] Image load error:', error);
            navigateToNext();
          }}
        />
      ) : null}
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
