
import React, { useState, useEffect } from 'react';
import { Alert, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ApplicationStep } from '@/components/ApplicationStep';
import { PhotoUpload } from '@/components/PhotoUpload';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step10Screen() {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('application_step_10');
      if (saved) {
        const data = JSON.parse(saved);
        setPhotoUrl(data.photoUrl || '');
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const handlePhotoSelected = async (url: string) => {
    setPhotoUrl(url);
    try {
      await AsyncStorage.setItem(
        'application_step_10',
        JSON.stringify({ photoUrl: url, photoType: 'activity' })
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: questionData } = await supabase
          .from('application_questions')
          .select('id')
          .eq('question_order', 10)
          .single();

        if (questionData) {
          await supabase.from('application_responses').upsert({
            auth_user_id: session.user.id,
            question_id: questionData.id,
            response_value: url,
            response_data: { photoType: 'activity' },
          });
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleNext = () => {
    if (!photoUrl) {
      Alert.alert('Required', 'Please upload one more activity picture to continue.');
      return;
    }
    router.push('/apply/submit');
  };

  return (
    <ApplicationStep
      stepNumber={10}
      totalSteps={10}
      title="Upload one more activity picture"
      subtitle="Last one! Show us what makes you, you."
      onNext={handleNext}
      onBack={() => router.back()}
      nextButtonText="Review & Submit"
      nextButtonDisabled={!photoUrl}
    >
      <Text style={styles.requirement}>✓ Different from previous photos</Text>
      <Text style={styles.requirement}>✓ Only you in the photo</Text>
      <Text style={styles.requirement}>✓ Clear and well-lit</Text>
      <Text style={styles.requirement}>✓ Represents you well</Text>
      
      <PhotoUpload
        photoUrl={photoUrl}
        onPhotoSelected={handlePhotoSelected}
        photoType="activity"
      />
    </ApplicationStep>
  );
}

const styles = StyleSheet.create({
  requirement: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
});
