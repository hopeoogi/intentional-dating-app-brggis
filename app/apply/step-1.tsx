
import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { ApplicationStep } from '@/components/ApplicationStep';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step1Screen() {
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('application_step_1');
      if (saved) {
        const data = JSON.parse(saved);
        setFullName(data.fullName || '');
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const handleNext = async () => {
    if (!fullName.trim()) {
      Alert.alert('Required', 'Please enter your full name.');
      return;
    }

    if (fullName.trim().split(' ').length < 2) {
      Alert.alert('Invalid Name', 'Please enter your full name (first and last name).');
      return;
    }

    try {
      // Save to AsyncStorage
      await AsyncStorage.setItem(
        'application_step_1',
        JSON.stringify({ fullName: fullName.trim() })
      );

      // Save to database if user is authenticated
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: questionData } = await supabase
          .from('application_questions')
          .select('id')
          .eq('question_order', 1)
          .single();

        if (questionData) {
          await supabase.from('application_responses').upsert({
            auth_user_id: session.user.id,
            question_id: questionData.id,
            response_value: fullName.trim(),
          });
        }
      }

      router.push('/apply/step-2');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save your response. Please try again.');
    }
  };

  return (
    <ApplicationStep
      stepNumber={1}
      totalSteps={10}
      title="What is your full name?"
      subtitle="This will be displayed on your profile"
      onNext={handleNext}
      nextButtonDisabled={!fullName.trim() || fullName.trim().split(' ').length < 2}
    >
      <TextInput
        style={[commonStyles.input, styles.input]}
        placeholder="Enter your full name"
        placeholderTextColor={colors.textSecondary}
        value={fullName}
        onChangeText={setFullName}
        autoCapitalize="words"
        autoFocus
      />
    </ApplicationStep>
  );
}

const styles = StyleSheet.create({
  input: {
    fontSize: 18,
  },
});
