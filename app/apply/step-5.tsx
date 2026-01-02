
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step5Screen() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Load all application data
      const step1Data = await AsyncStorage.getItem('application_step1');
      const selfie = await AsyncStorage.getItem('application_selfie');
      const fullBody = await AsyncStorage.getItem('application_fullbody');
      const activity1 = await AsyncStorage.getItem('application_activity1');

      if (!step1Data || !selfie || !fullBody || !activity1) {
        Alert.alert('Error', 'Missing application data');
        return;
      }

      const applicationData = {
        ...JSON.parse(step1Data),
        photos: {
          selfie,
          fullBody,
          activity1,
        },
      };

      // TODO: Backend Integration - Submit application to API
      console.log('[Application] Submitting:', applicationData);

      // Clear application data
      await AsyncStorage.multiRemove([
        'application_step1',
        'application_selfie',
        'application_fullbody',
        'application_activity1',
      ]);

      // Navigate to pending screen
      router.replace('/application-pending');
    } catch (error) {
      console.error('[Application] Error:', error);
      Alert.alert('Error', 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={commonStyles.container}>
      <Stack.Screen options={{ headerTitle: 'Review & Submit' }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.progress}>Step 5 of 5</Text>
          <Text style={styles.title}>Review Your Application</Text>
          <Text style={styles.subtitle}>
            Make sure everything looks good before submitting
          </Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>What happens next?</Text>
          <Text style={styles.infoText}>
            • Our team will review your application within 24-48 hours
          </Text>
          <Text style={styles.infoText}>
            • We&apos;ll verify your photos meet our quality standards
          </Text>
          <Text style={styles.infoText}>
            • You&apos;ll receive an email with the decision
          </Text>
          <Text style={styles.infoText}>
            • If approved, you can start matching immediately
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.buttonText}>Submit Application</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  progress: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoBox: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
