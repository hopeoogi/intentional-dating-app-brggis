
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const REJECTION_REASONS = [
  { id: 'know_person', label: 'I know this person' },
  { id: 'previously_dated', label: 'Previously dated' },
  { id: 'not_interested', label: 'Not interested' },
  { id: 'met_someone', label: 'Met somebody else' },
  { id: 'other', label: 'Other' },
];

export default function RejectionFeedbackScreen() {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [otherReason, setOtherReason] = useState('');

  const handleSubmit = () => {
    if (!selectedReason) {
      Alert.alert('Please select a reason', 'Help us understand why you&apos;re passing on this match.');
      return;
    }

    console.log('Rejection reason:', {
      reason: selectedReason,
      otherDetails: selectedReason === 'other' ? otherReason : null,
      timestamp: new Date().toISOString(),
    });

    Alert.alert(
      'Thank you for your feedback',
      'Your response helps us improve the Intentional experience. The match has been removed.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
          <IconSymbol
            ios_icon_name="xmark"
            android_material_icon_name="close"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          <IconSymbol
            ios_icon_name="hand.raised.fill"
            android_material_icon_name="back_hand"
            size={48}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>Help Us Understand</Text>
        <Text style={styles.subtitle}>
          Why are you passing on this match? Your feedback helps us improve your experience.
        </Text>

        <View style={styles.reasonsList}>
          {REJECTION_REASONS.map((reason) => (
            <TouchableOpacity
              key={reason.id}
              style={[
                styles.reasonButton,
                selectedReason === reason.id && styles.reasonButtonSelected,
              ]}
              onPress={() => setSelectedReason(reason.id)}
            >
              <View style={styles.radioOuter}>
                {selectedReason === reason.id && <View style={styles.radioInner} />}
              </View>
              <Text
                style={[
                  styles.reasonText,
                  selectedReason === reason.id && styles.reasonTextSelected,
                ]}
              >
                {reason.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedReason === 'other' && (
          <TextInput
            style={styles.textInput}
            placeholder="Please specify..."
            placeholderTextColor={colors.textSecondary}
            value={otherReason}
            onChangeText={setOtherReason}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        )}

        <TouchableOpacity
          style={[styles.submitButton, !selectedReason && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!selectedReason}
        >
          <Text style={styles.submitButtonText}>Submit Feedback</Text>
        </TouchableOpacity>

        <Text style={styles.privacyNote}>
          This information is confidential and used only to improve our service and matching algorithm.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  reasonsList: {
    gap: 12,
    marginBottom: 24,
  },
  reasonButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  reasonButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight || colors.card,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  reasonText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  reasonTextSelected: {
    fontWeight: '600',
    color: colors.primary,
  },
  textInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 100,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  privacyNote: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
