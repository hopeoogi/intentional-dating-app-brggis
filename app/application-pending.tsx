
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { StatusBar } from 'expo-status-bar';

export default function ApplicationPendingScreen() {
  return (
    <View style={commonStyles.centered}>
      <StatusBar style="light" />
      
      <IconSymbol
        ios_icon_name="clock.fill"
        android_material_icon_name="schedule"
        size={80}
        color={colors.accent}
      />
      
      <Text style={styles.title}>Application Submitted!</Text>
      <Text style={styles.subtitle}>
        We&apos;re reviewing your application. You&apos;ll hear from us within 24-48 hours.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.replace('/welcome')}
      >
        <Text style={styles.buttonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 32,
    marginBottom: 32,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
