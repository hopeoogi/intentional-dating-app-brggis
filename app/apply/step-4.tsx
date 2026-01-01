
import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Alert } from 'react-native';
import { router } from 'expo-router';
import { ApplicationStep } from '@/components/ApplicationStep';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step4Screen() {
  const [state, setState] = useState('');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('application_step_4');
      if (saved) {
        const data = JSON.parse(saved);
        setState(data.state || '');
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const handleNext = async () => {
    if (!state.trim()) {
      Alert.alert('Required', 'Please enter your state.');
      return;
    }

    try {
      await AsyncStorage.setItem(
        'application_step_4',
        JSON.stringify({ state: state.trim() })
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: questionData } = await supabase
          .from('application_questions')
          .select('id')
          .eq('question_order', 4)
          .single();

        if (questionData) {
          await supabase.from('application_responses').upsert({
            auth_user_id: session.user.id,
            question_id: questionData.id,
            response_value: state.trim(),
          });
        }
      }

      router.push('/apply/step-5');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save your response. Please try again.');
    }
  };

  return (
    <ApplicationStep
      stepNumber={4}
      totalSteps={10}
      title="What state do you live in?"
      subtitle="This helps us find matches near you"
      onNext={handleNext}
      onBack={() => router.back()}
      nextButtonDisabled={!state.trim()}
    >
      <TextInput
        style={[commonStyles.input, styles.input]}
        placeholder="Enter your state"
        placeholderTextColor={colors.textSecondary}
        value={state}
        onChangeText={setState}
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
