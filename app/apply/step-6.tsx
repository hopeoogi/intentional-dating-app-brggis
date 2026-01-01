
import React, { useState, useEffect } from 'react';
import { Alert, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ApplicationStep } from '@/components/ApplicationStep';
import { PhotoUpload } from '@/components/PhotoUpload';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step6Screen() {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('application_step_6');
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
        'application_step_6',
        JSON.stringify({ photoUrl: url, photoType: 'selfie' })
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: questionData } = await supabase
          .from('application_questions')
          .select('id')
          .eq('question_order', 6)
          .single();

        if (questionData) {
          await supabase.from('application_responses').upsert({
            auth_user_id: session.user.id,
            question_id: questionData.id,
            response_value: url,
            response_data: { photoType: 'selfie' },
          });
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleNext = () => {
    if (!photoUrl) {
      Alert.alert('Required', 'Please upload a selfie to continue.');
      return;
    }
    router.push('/apply/step-7');
  };

  return (
    <ApplicationStep
      stepNumber={6}
      totalSteps={10}
      title="Upload a clear selfie"
      subtitle="No sunglasses, hats, or filters. Just you!"
      onNext={handleNext}
      onBack={() => router.back()}
      nextButtonDisabled={!photoUrl}
    >
      <Text style={styles.requirement}>✓ Face clearly visible</Text>
      <Text style={styles.requirement}>✓ No sunglasses or hats</Text>
      <Text style={styles.requirement}>✓ No filters or heavy editing</Text>
      <Text style={styles.requirement}>✓ Good lighting</Text>
      
      <PhotoUpload
        photoUrl={photoUrl}
        onPhotoSelected={handlePhotoSelected}
        photoType="selfie"
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
