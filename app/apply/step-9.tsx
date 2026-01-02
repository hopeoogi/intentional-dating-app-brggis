
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Step9Screen() {
  const [interestedIn, setInterestedIn] = useState<string[]>([]);

  const options = [
    { id: 'men', label: 'Men' },
    { id: 'women', label: 'Women' },
    { id: 'non-binary', label: 'Non-binary' },
  ];

  const toggleOption = (id: string) => {
    if (interestedIn.includes(id)) {
      setInterestedIn(interestedIn.filter(item => item !== id));
    } else {
      setInterestedIn([...interestedIn, id]);
    }
  };

  const handleNext = async () => {
    if (interestedIn.length === 0) {
      Alert.alert('Required', 'Please select at least one option');
      return;
    }

    await AsyncStorage.setItem('onboarding_interested_in', JSON.stringify(interestedIn));
    router.push('/apply/step-10');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
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
          <View style={[styles.progressFill, { width: '90%' }]} />
        </View>

        <View style={styles.header}>
          <Text style={styles.stepNumber}>Step 9 of 10</Text>
          <Text style={styles.title}>Who are you interested in?</Text>
          <Text style={styles.subtitle}>Select all that apply</Text>
        </View>

        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.option,
                interestedIn.includes(option.id) && styles.optionSelected,
              ]}
              onPress={() => toggleOption(option.id)}
            >
              <Text
                style={[
                  styles.optionText,
                  interestedIn.includes(option.id) && styles.optionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {interestedIn.includes(option.id) && (
                <IconSymbol
                  ios_icon_name="checkmark.circle.fill"
                  android_material_icon_name="check_circle"
                  size={24}
                  color="#000000"
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, interestedIn.length === 0 && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={interestedIn.length === 0}
        >
          <Text style={styles.nextButtonText}>Continue</Text>
          <IconSymbol
            ios_icon_name="arrow.right"
            android_material_icon_name="arrow_forward"
            size={20}
            color="#000000"
          />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  optionsContainer: {
    flex: 1,
    gap: 12,
  },
  option: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#2C2C2E',
  },
  optionSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  optionTextSelected: {
    color: '#000000',
  },
  nextButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
