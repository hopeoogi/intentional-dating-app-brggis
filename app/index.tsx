
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';

export default function IndexScreen() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    console.log('[Index] Session:', session ? 'Authenticated' : 'Not authenticated');
    console.log('[Index] Loading:', isLoading);
  }, [session, isLoading]);

  if (isLoading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[commonStyles.body, styles.loadingText]}>Loading...</Text>
      </View>
    );
  }

  // Not authenticated - go to welcome
  if (!session) {
    return <Redirect href="/welcome" />;
  }

  // TODO: Backend Integration - Check application status from API
  // For now, redirect to home
  return <Redirect href="/(tabs)/(home)" />;
}

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 16,
    color: colors.textSecondary,
  },
});
