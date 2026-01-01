
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

// ============================================================================
// BUILD 161 - SIMPLIFIED INTRO SCREEN WITH ENHANCED ERROR HANDLING
// ============================================================================
// This screen is intentionally simple and does NOT query the database.
// It shows a brief intro animation and then navigates to the signin screen.
// This prevents any potential database connection issues during app startup.
// ============================================================================

export default function IntroVideoScreen() {
  const [showSkipButton, setShowSkipButton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[IntroVideo] Component mounted - BUILD 161');
    console.log('[IntroVideo] No database queries - using local assets only');
    
    try {
      // Show skip button after 2 seconds
      const skipTimer = setTimeout(() => {
        console.log('[IntroVideo] Showing skip button');
        setShowSkipButton(true);
      }, 2000);
      
      // Auto-navigate after 3 seconds
      const navTimer = setTimeout(() => {
        console.log('[IntroVideo] Auto-navigating to signin...');
        handleNavigation();
      }, 3000);
      
      return () => {
        console.log('[IntroVideo] Cleaning up timers');
        clearTimeout(skipTimer);
        clearTimeout(navTimer);
      };
    } catch (err) {
      console.error('[IntroVideo] Error in useEffect:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, []);

  const handleNavigation = () => {
    try {
      console.log('[IntroVideo] Attempting navigation to signin...');
      router.replace('/signin');
      console.log('[IntroVideo] Navigation successful');
    } catch (err) {
      console.error('[IntroVideo] Navigation error:', err);
      setError(err instanceof Error ? err.message : 'Navigation failed');
      
      // Try alternative navigation method
      setTimeout(() => {
        try {
          console.log('[IntroVideo] Trying push navigation...');
          router.push('/signin');
        } catch (pushErr) {
          console.error('[IntroVideo] Push navigation also failed:', pushErr);
        }
      }, 500);
    }
  };

  const handleSkip = () => {
    console.log('[IntroVideo] User skipped intro');
    handleNavigation();
  };

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Unable to Continue</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={handleNavigation}
            activeOpacity={0.7}
          >
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/natively-dark.png')}
        style={styles.image}
        resizeMode="contain"
      />
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
