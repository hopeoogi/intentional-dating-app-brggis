
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

// ============================================================================
// BUILD 145 - SIMPLIFIED INTRO SCREEN
// ============================================================================
// This screen is intentionally simple and does NOT query the database.
// It shows a brief intro animation and then navigates to the signin screen.
// This prevents any potential database connection issues during app startup.
// ============================================================================

export default function IntroVideoScreen() {
  const [showSkipButton, setShowSkipButton] = useState(false);

  useEffect(() => {
    console.log('[IntroVideo] Component mounted - BUILD 145');
    console.log('[IntroVideo] No database queries - using local assets only');
    
    // Show skip button after 2 seconds
    const skipTimer = setTimeout(() => {
      setShowSkipButton(true);
    }, 2000);
    
    // Auto-navigate after 3 seconds
    const navTimer = setTimeout(() => {
      console.log('[IntroVideo] Auto-navigating to signin...');
      router.replace('/signin');
    }, 3000);
    
    return () => {
      clearTimeout(skipTimer);
      clearTimeout(navTimer);
    };
  }, []);

  const handleSkip = () => {
    console.log('[IntroVideo] User skipped intro');
    router.replace('/signin');
  };

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
});
