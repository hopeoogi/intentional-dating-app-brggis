
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
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/app/integrations/supabase/client';

export default function Step10Screen() {
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(35);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);

    try {
      // Get all onboarding data from AsyncStorage
      const name = await AsyncStorage.getItem('onboarding_name');
      const age = await AsyncStorage.getItem('onboarding_age');
      const city = await AsyncStorage.getItem('onboarding_city');
      const state = await AsyncStorage.getItem('onboarding_state');
      const bio = await AsyncStorage.getItem('onboarding_bio');
      const selfie = await AsyncStorage.getItem('onboarding_selfie');
      const fullbody = await AsyncStorage.getItem('onboarding_fullbody');
      const activity1 = await AsyncStorage.getItem('onboarding_activity1');
      const activity2 = await AsyncStorage.getItem('onboarding_activity2');
      const activity3 = await AsyncStorage.getItem('onboarding_activity3');
      const interestedInStr = await AsyncStorage.getItem('onboarding_interested_in');
      const interestedIn = interestedInStr ? JSON.parse(interestedInStr) : [];

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user');

      // Create pending user application
      const { data: pendingUser, error: pendingError } = await supabase
        .from('pending_users')
        .insert({
          auth_user_id: user.id,
          name,
          age: parseInt(age || '18'),
          bio,
          city,
          state,
          status: 'pending',
        })
        .select()
        .single();

      if (pendingError) throw pendingError;

      // Upload photos
      const photos = [
        { url: selfie, type: 'selfie' },
        { url: fullbody, type: 'fullbody' },
        { url: activity1, type: 'activity' },
        { url: activity2, type: 'activity' },
        { url: activity3, type: 'activity' },
      ];

      for (const photo of photos) {
        if (photo.url) {
          await supabase.from('pending_user_photos').insert({
            pending_user_id: pendingUser.id,
            url: photo.url,
            photo_type: photo.type,
          });
        }
      }

      // Save preferences
      await supabase.from('application_responses').insert({
        pending_user_id: pendingUser.id,
        auth_user_id: user.id,
        response_data: {
          interested_in: interestedIn,
          min_age: minAge,
          max_age: maxAge,
        },
      });

      // Clear onboarding data
      await AsyncStorage.multiRemove([
        'onboarding_name',
        'onboarding_age',
        'onboarding_city',
        'onboarding_state',
        'onboarding_bio',
        'onboarding_selfie',
        'onboarding_fullbody',
        'onboarding_activity1',
        'onboarding_activity2',
        'onboarding_activity3',
        'onboarding_interested_in',
      ]);

      router.replace('/application-pending');
    } catch (error: any) {
      console.error('[Step10] Submission error:', error);
      Alert.alert('Submission Failed', 'Please try again or contact support');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: '100%' }]} />
        </View>

        <View style={styles.header}>
          <Text style={styles.stepNumber}>Step 10 of 10</Text>
          <Text style={styles.title}>Age preferences</Text>
          <Text style={styles.subtitle}>What age range are you interested in?</Text>
        </View>

        <View style={styles.ageContainer}>
          <View style={styles.ageSelector}>
            <Text style={styles.ageLabel}>Minimum Age</Text>
            <View style={styles.ageControls}>
              <TouchableOpacity
                style={styles.ageButton}
                onPress={() => setMinAge(Math.max(18, minAge - 1))}
              >
                <IconSymbol
                  ios_icon_name="minus"
                  android_material_icon_name="remove"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              <Text style={styles.ageValue}>{minAge}</Text>
              <TouchableOpacity
                style={styles.ageButton}
                onPress={() => setMinAge(Math.min(maxAge, minAge + 1))}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.ageSelector}>
            <Text style={styles.ageLabel}>Maximum Age</Text>
            <View style={styles.ageControls}>
              <TouchableOpacity
                style={styles.ageButton}
                onPress={() => setMaxAge(Math.max(minAge, maxAge - 1))}
              >
                <IconSymbol
                  ios_icon_name="minus"
                  android_material_icon_name="remove"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
              <Text style={styles.ageValue}>{maxAge}</Text>
              <TouchableOpacity
                style={styles.ageButton}
                onPress={() => setMaxAge(Math.min(100, maxAge + 1))}
              >
                <IconSymbol
                  ios_icon_name="plus"
                  android_material_icon_name="add"
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Almost done!</Text>
          <Text style={styles.summaryText}>
            Your application will be reviewed by our team. We&apos;ll notify you once it&apos;s been approved.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <>
              <Text style={styles.submitButtonText}>Submit Application</Text>
              <IconSymbol
                ios_icon_name="checkmark"
                android_material_icon_name="check"
                size={20}
                color="#000000"
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1C1C1E',
    borderRadius: 2,
    marginBottom: 32,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  header: {
    marginBottom: 48,
  },
  stepNumber: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.6,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  ageContainer: {
    gap: 24,
    marginBottom: 48,
  },
  ageSelector: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
  },
  ageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  ageControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ageButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  summary: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  summaryText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
