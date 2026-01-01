
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import { ApplicationStep } from '@/components/ApplicationStep';
import { colors } from '@/styles/commonStyles';
import { supabase } from '@/app/integrations/supabase/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function Step2Screen() {
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const saved = await AsyncStorage.getItem('application_step_2');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.dateOfBirth) {
          setDateOfBirth(new Date(data.dateOfBirth));
        }
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleNext = async () => {
    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      Alert.alert('Age Requirement', 'You must be at least 18 years old to join Intentional.');
      return;
    }

    if (age > 100) {
      Alert.alert('Invalid Date', 'Please enter a valid date of birth.');
      return;
    }

    try {
      await AsyncStorage.setItem(
        'application_step_2',
        JSON.stringify({ dateOfBirth: dateOfBirth.toISOString(), age })
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: questionData } = await supabase
          .from('application_questions')
          .select('id')
          .eq('question_order', 2)
          .single();

        if (questionData) {
          await supabase.from('application_responses').upsert({
            auth_user_id: session.user.id,
            question_id: questionData.id,
            response_value: dateOfBirth.toISOString(),
            response_data: { age },
          });
        }
      }

      router.push('/apply/step-3');
    } catch (error) {
      console.error('Error saving data:', error);
      Alert.alert('Error', 'Failed to save your response. Please try again.');
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const age = calculateAge(dateOfBirth);
  const isValidAge = age >= 18 && age <= 100;

  return (
    <ApplicationStep
      stepNumber={2}
      totalSteps={10}
      title="What is your date of birth?"
      subtitle="You must be at least 18 years old to join"
      onNext={handleNext}
      onBack={() => router.back()}
      nextButtonDisabled={!isValidAge}
    >
      <View style={styles.pickerContainer}>
        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1924, 0, 1)}
            textColor={colors.text}
          />
        )}
      </View>
    </ApplicationStep>
  );
}

const styles = StyleSheet.create({
  pickerContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
});
