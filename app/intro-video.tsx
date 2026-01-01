
import React, { useEffect, useState, useRef } from 'react';
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

  useEffect(() => {
    loadIntroSettings();
  }, []);

  const loadIntroSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('setting_value')
        .eq('setting_key', 'intro_video')
        .single();

      if (error) {
        console.error('Error loading intro settings:', error);
        navigateToNext();
        return;
      }

      const introSettings = data.setting_value as IntroVideoSettings;
      setSettings(introSettings);

      if (!introSettings.enabled) {
        navigateToNext();
        return;
      }

      // Check if URL is a video or image
      const url = introSettings.url.toLowerCase();
      const videoExtensions = ['.mp4', '.mov', '.m4v', '.avi'];
      const isVideoFile = videoExtensions.some(ext => url.includes(ext));
      setIsVideo(isVideoFile);

      // If it's an image, show for specified duration
      if (!isVideoFile) {
        setTimeout(() => {
          navigateToNext();
        }, introSettings.duration || 3000);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error in loadIntroSettings:', error);
      navigateToNext();
    }
  };

  const navigateToNext = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: userData } = await supabase
          .from('users')
          .select('onboarding_complete')
          .eq('auth_user_id', session.user.id)
          .single();

        if (userData?.onboarding_complete) {
          router.replace('/(tabs)/(home)/');
        } else {
          const { data: pendingData } = await supabase
            .from('pending_users')
            .select('status')
            .eq('auth_user_id', session.user.id)
            .single();

          if (pendingData?.status === 'pending') {
            router.replace('/application-pending');
          } else {
            router.replace('/apply/step-1');
          }
        }
      } else {
        router.replace('/signin');
      }
    } catch (error) {
      console.error('Error in navigateToNext:', error);
      router.replace('/signin');
    }
  };

  const handleVideoStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded && status.didJustFinish) {
      navigateToNext();
    }
  };

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
