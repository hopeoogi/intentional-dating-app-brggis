
import React, { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Alert, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ApplicationStep } from '@/components/ApplicationStep';
import { colors, commonStyles } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step5Screen() {
  const [bio, setBio] = useState('');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('application_step_5');
      if (saved) {
        const data = JSON.parse(saved);
        setBio(data.bio || '');
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const handleNext = async () => {
    if (!bio.trim()) {
      Alert.alert('Required', 'Please tell us about yourself.');
      return;
    }

    if (bio.trim().length < 50) {
      Alert.alert('Too Short', 'Please write at least 50 characters about yourself.');
      return;
    }

    try {
      await AsyncStorage.setItem(
        'application_step_5',
        JSON.stringify({ bio: bio.trim() })
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: questionData } = await supabase
          .from('application_questions')
          .select('id')
          .eq('question_order', 5)
          .single();

        if (questionData) {
          await supabase.from('application_responses').upsert({
            auth_user_id: session.user.id,
            question_id: questionData.id,
            response_value: bio.trim(),
          });
        }
      }

      router.push('/apply/step-6');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save your response. Please try again.');
    }
  };

  const characterCount = bio.length;
  const isValid = characterCount >= 50;

  return (
    <ApplicationStep
      stepNumber={5}
      totalSteps={10}
      title="Tell us about yourself"
      subtitle="Share what makes you unique and what you're looking for"
      onNext={handleNext}
      onBack={() => router.back()}
      nextButtonDisabled={!isValid}
    >
      <TextInput
        style={[commonStyles.input, styles.textArea]}
        placeholder="Write a brief bio (minimum 50 characters)"
        placeholderTextColor={colors.textSecondary}
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        autoFocus
      />
      <View style={styles.characterCount}>
        <Text style={[styles.countText, isValid && styles.countTextValid]}>
          {characterCount} / 50 characters
        </Text>
      </View>
    </ApplicationStep>
  );
}

const styles = StyleSheet.create({
  textArea: {
    height: 150,
    fontSize: 16,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  countText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  countTextValid: {
    color: colors.success,
  },
});
