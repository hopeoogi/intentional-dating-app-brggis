
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function MatchFiltersScreen() {
  const [ageRange, setAgeRange] = useState<[number, number]>([25, 35]);
  const [distance, setDistance] = useState(50);

  // TODO: Backend Integration - Save filters to API
  const handleSave = () => {
    Alert.alert('Success', 'Match filters saved successfully');
    router.back();
  };

  return (
    <ScrollView style={commonStyles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.backgroundLight },
          headerTintColor: colors.text,
          headerTitle: 'Match Filters',
        }}
      />

      <View style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Range</Text>
          <Text style={styles.sectionValue}>
            {ageRange[0]} - {ageRange[1]} years
          </Text>
          <Text style={styles.sectionHint}>
            Adjust your preferred age range for matches
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distance</Text>
          <Text style={styles.sectionValue}>{distance} miles</Text>
          <Text style={styles.sectionHint}>
            Maximum distance for potential matches
          </Text>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Filters</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
  section: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  sectionValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 8,
  },
  sectionHint: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
