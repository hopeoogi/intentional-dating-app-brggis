
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';

export default function ApplicationPendingScreen() {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/welcome');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <IconSymbol
            ios_icon_name="hourglass"
            android_material_icon_name="hourglass_empty"
            size={80}
            color="#FFFFFF"
          />
        </View>

        <Text style={styles.title}>Application Submitted!</Text>
        <Text style={styles.message}>
          Thank you for applying to join the Intentional community.
          {'\n\n'}
          Our team is carefully reviewing your application. We&apos;ll send you an email once your application has been reviewed.
          {'\n\n'}
          This typically takes 24-48 hours.
        </Text>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  message: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.8,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 48,
  },
  signOutButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  signOutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
