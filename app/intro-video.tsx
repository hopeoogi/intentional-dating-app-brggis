
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================================================
// BUILD 171 - DEEP DIVE API SYNC FIX
// ============================================================================
// This screen shows a brief intro with New York skyline and then navigates to signin.
// 
// CRITICAL FIXES:
// 1. Fixed Edge Functions - removed old serve imports
// 2. Fixed environment variable names in Edge Functions
// 3. Enhanced CORS headers on ALL responses
// 4. Comprehensive error handling with request IDs
// 5. Better logging and debugging capabilities
// 6. Maintained all previous fixes from Build 170
// ============================================================================

export default function IntroVideoScreen() {
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    console.log('[IntroVideo] Component mounted - BUILD 171');
    
    // Mark intro as seen
    markIntroAsSeen();
    
    // Auto-navigate after 3 seconds
    const timer = setTimeout(() => {
      console.log('[IntroVideo] Auto-navigating to signin...');
      navigateToSignIn();
    }, 3000);
    
    return () => {
      console.log('[IntroVideo] Cleaning up timer');
      clearTimeout(timer);
    };
  }, []);

  const markIntroAsSeen = async () => {
    try {
      await AsyncStorage.setItem('hasSeenIntro', 'true');
      console.log('[IntroVideo] Marked intro as seen');
    } catch (error) {
      console.error('[IntroVideo] Error marking intro as seen:', error);
    }
  };

  const navigateToSignIn = () => {
    try {
      console.log('[IntroVideo] Navigating to signin...');
      router.replace('/signin');
    } catch (err) {
      console.error('[IntroVideo] Navigation error:', err);
      setError('Unable to continue. Please restart the app.');
    }
  };

  const handleSkip = () => {
    console.log('[IntroVideo] User skipped intro');
    navigateToSignIn();
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Continue</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!imageError ? (
        <ImageBackground
          source={{ uri: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=2070&auto=format&fit=crop' }}
          style={styles.backgroundImage}
          resizeMode="cover"
          onError={() => {
            console.log('[IntroVideo] Failed to load New York skyline image, using fallback');
            setImageError(true);
          }}
        >
          <View style={styles.overlay}>
            <Text style={styles.brandName}>Intentional</Text>
            <Text style={styles.tagline}>Where connections matter</Text>
          </View>
        </ImageBackground>
      ) : (
        <View style={styles.fallbackContainer}>
          <View style={styles.overlay}>
            <Text style={styles.brandName}>Intentional</Text>
            <Text style={styles.tagline}>Where connections matter</Text>
          </View>
        </View>
      )}
      <TouchableOpacity 
        style={styles.skipButton}
        onPress={handleSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
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
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  errorContainer: {
    padding: 30,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
