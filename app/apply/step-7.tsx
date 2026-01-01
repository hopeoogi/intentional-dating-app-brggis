
import React, { useState, useEffect } from 'react';
import { Alert, Text, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ApplicationStep } from '@/components/ApplicationStep';
import { PhotoUpload } from '@/components/PhotoUpload';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step7Screen() {
  const [photoUrl, setPhotoUrl] = useState('');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('application_step_7');
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
        'application_step_7',
        JSON.stringify({ photoUrl: url, photoType: 'fullbody' })
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: questionData } = await supabase
          .from('application_questions')
          .select('id')
          .eq('question_order', 7)
          .single();

        if (questionData) {
          await supabase.from('application_responses').upsert({
            auth_user_id: session.user.id,
            question_id: questionData.id,
            response_value: url,
            response_data: { photoType: 'fullbody' },
          });
        }
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleNext = () => {
    if (!photoUrl) {
      Alert.alert('Required', 'Please upload a full body picture to continue.');
      return;
    }
    router.push('/apply/step-8');
  };

  return (
    <ApplicationStep
      stepNumber={7}
      totalSteps={10}
      title="Upload a full body picture"
      subtitle="Show your style! No baggy clothes or jackets."
      onNext={handleNext}
      onBack={() => router.back()}
      nextButtonDisabled={!photoUrl}
    >
      <Text style={styles.requirement}>✓ Full body visible</Text>
      <Text style={styles.requirement}>✓ No baggy clothes or jackets</Text>
      <Text style={styles.requirement}>✓ Clear and well-lit</Text>
      <Text style={styles.requirement}>✓ Only you in the photo</Text>
      
      <PhotoUpload
        photoUrl={photoUrl}
        onPhotoSelected={handlePhotoSelected}
        photoType="fullbody"
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
