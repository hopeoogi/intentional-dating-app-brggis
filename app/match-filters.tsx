
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

const statusOptions = [
  'Student', 'Professional', 'Entrepreneur', 'CEO', 'Doctor', 'Lawyer',
  'Engineer', 'Designer', 'Artist', 'Model', 'Influencer', 'Athlete',
  'Nurse', 'Teacher', 'Photographer', 'Traveller', 'Investor', 'Musician',
];

const heightOptions = [
  { label: 'Under 5\'0"', value: 60 },
  { label: '5\'0" - 5\'4"', value: 64 },
  { label: '5\'5" - 5\'9"', value: 69 },
  { label: '5\'10" - 6\'2"', value: 74 },
  { label: 'Over 6\'2"', value: 75 },
];

const bodyTypeOptions = ['Slim', 'Athletic', 'Average', 'Curvy', 'Muscular'];

const ethnicityOptions = [
  'Asian', 'Black', 'Hispanic', 'White', 'Middle Eastern', 'Mixed', 'Other',
];

export default function MatchFiltersScreen() {
  const subscriptionTier = 'elite';
  const maxStatusSelections = subscriptionTier === 'basic' ? 5 : subscriptionTier === 'elite' ? 8 : 10;
  const maxDistance = subscriptionTier === 'basic' ? 50 : subscriptionTier === 'elite' ? 100 : 200;

  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Student', 'Professional']);
  const [selectedHeights, setSelectedHeights] = useState<number[]>([]);
  const [selectedBodyTypes, setSelectedBodyTypes] = useState<string[]>([]);
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>([]);
  const [selectedTiers, setSelectedTiers] = useState<string[]>(['basic']);

  const handleStatusToggle = (status: string) => {
    if (selectedStatuses.includes(status)) {
      setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
    } else {
      if (selectedStatuses.length >= maxStatusSelections) {
        Alert.alert(
          'Limit Reached',
          `You can select up to ${maxStatusSelections} statuses with your ${subscriptionTier} subscription.`
        );
        return;
      }
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const handleTierToggle = (tier: string) => {
    if (tier === 'elite' && subscriptionTier === 'basic') {
      Alert.alert('Upgrade Required', 'Upgrade to Elite or Star to access Elite matches.');
      return;
    }
    if (tier === 'star' && subscriptionTier !== 'star') {
      Alert.alert('Upgrade Required', 'Upgrade to Star to access Star matches.');
      return;
    }

    if (selectedTiers.includes(tier)) {
      setSelectedTiers(selectedTiers.filter((t) => t !== tier));
    } else {
      setSelectedTiers([...selectedTiers, tier]);
    }
  };

  const handleSave = () => {
    Alert.alert('Success', 'Your match filters have been updated!');
    router.back();
  };

  const canAccessAdvancedFilters = subscriptionTier === 'elite' || subscriptionTier === 'star';

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Match Filters</Text>
        </View>

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            {subscriptionTier === 'basic'
              ? 'Basic: 50 miles, up to 5 statuses, Basic matches only'
              : subscriptionTier === 'elite'
              ? 'Elite: 100 miles, up to 8 statuses, Basic & Elite matches'
              : 'Star: 200 miles, up to 10 statuses, all match tiers'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Distance</Text>
          <View style={styles.distanceCard}>
            <Text style={styles.distanceValue}>{maxDistance} miles</Text>
            <Text style={styles.distanceLabel}>Maximum search radius</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Status Preferences ({selectedStatuses.length}/{maxStatusSelections})
          </Text>
          <View style={styles.optionsGrid}>
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status}
                style={[
                  styles.optionChip,
                  selectedStatuses.includes(status) && styles.optionChipSelected,
                ]}
                onPress={() => handleStatusToggle(status)}
              >
                <Text
                  style={[
                    styles.optionChipText,
                    selectedStatuses.includes(status) && styles.optionChipTextSelected,
                  ]}
                >
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Match Tiers</Text>
          <View style={styles.tierOptions}>
            <TouchableOpacity
              style={[
                styles.tierOption,
                selectedTiers.includes('basic') && styles.tierOptionSelected,
                { borderColor: '#00BFFF' },
              ]}
              onPress={() => handleTierToggle('basic')}
            >
              <Text
                style={[
                  styles.tierOptionText,
                  selectedTiers.includes('basic') && { color: '#00BFFF' },
                ]}
              >
                Basic
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tierOption,
                selectedTiers.includes('elite') && styles.tierOptionSelected,
                { borderColor: '#9370DB' },
                subscriptionTier === 'basic' && styles.tierOptionDisabled,
              ]}
              onPress={() => handleTierToggle('elite')}
              disabled={subscriptionTier === 'basic'}
            >
              <Text
                style={[
                  styles.tierOptionText,
                  selectedTiers.includes('elite') && { color: '#9370DB' },
                  subscriptionTier === 'basic' && styles.tierOptionTextDisabled,
                ]}
              >
                Elite
              </Text>
              {subscriptionTier === 'basic' && (
                <IconSymbol
                  ios_icon_name="lock.fill"
                  android_material_icon_name="lock"
                  size={16}
                  color={colors.textSecondary}
                />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tierOption,
                selectedTiers.includes('star') && styles.tierOptionSelected,
                { borderColor: '#FFD700' },
                subscriptionTier !== 'star' && styles.tierOptionDisabled,
              ]}
              onPress={() => handleTierToggle('star')}
              disabled={subscriptionTier !== 'star'}
            >
              <Text
                style={[
                  styles.tierOptionText,
                  selectedTiers.includes('star') && { color: '#FFD700' },
                  subscriptionTier !== 'star' && styles.tierOptionTextDisabled,
                ]}
              >
                Star
              </Text>
              {subscriptionTier !== 'star' && (
                <IconSymbol
                  ios_icon_name="lock.fill"
                  android_material_icon_name="lock"
                  size={16}
                  color={colors.textSecondary}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {canAccessAdvancedFilters && (
          <React.Fragment>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Height Preference</Text>
              <View style={styles.optionsGrid}>
                {heightOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionChip,
                      selectedHeights.includes(option.value) && styles.optionChipSelected,
                    ]}
                    onPress={() => {
                      if (selectedHeights.includes(option.value)) {
                        setSelectedHeights(selectedHeights.filter((h) => h !== option.value));
                      } else {
                        setSelectedHeights([...selectedHeights, option.value]);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedHeights.includes(option.value) && styles.optionChipTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Body Type</Text>
              <View style={styles.optionsGrid}>
                {bodyTypeOptions.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionChip,
                      selectedBodyTypes.includes(type) && styles.optionChipSelected,
                    ]}
                    onPress={() => {
                      if (selectedBodyTypes.includes(type)) {
                        setSelectedBodyTypes(selectedBodyTypes.filter((t) => t !== type));
                      } else {
                        setSelectedBodyTypes([...selectedBodyTypes, type]);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedBodyTypes.includes(type) && styles.optionChipTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ethnicity</Text>
              <View style={styles.optionsGrid}>
                {ethnicityOptions.map((ethnicity) => (
                  <TouchableOpacity
                    key={ethnicity}
                    style={[
                      styles.optionChip,
                      selectedEthnicities.includes(ethnicity) && styles.optionChipSelected,
                    ]}
                    onPress={() => {
                      if (selectedEthnicities.includes(ethnicity)) {
                        setSelectedEthnicities(selectedEthnicities.filter((e) => e !== ethnicity));
                      } else {
                        setSelectedEthnicities([...selectedEthnicities, ethnicity]);
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.optionChipText,
                        selectedEthnicities.includes(ethnicity) && styles.optionChipTextSelected,
                      ]}
                    >
                      {ethnicity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </React.Fragment>
        )}

        {!canAccessAdvancedFilters && (
          <View style={styles.upgradeCard}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.upgradeTitle}>Unlock Advanced Filters</Text>
            <Text style={styles.upgradeText}>
              Upgrade to Elite or Star to access height, body type, and ethnicity preferences.
            </Text>
            <TouchableOpacity
              style={styles.upgradeButton}
              onPress={() => router.push('/subscription')}
            >
              <Text style={styles.upgradeButtonText}>View Plans</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Filters</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    marginBottom: 24,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  distanceCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  distanceValue: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  distanceLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  optionChipTextSelected: {
    color: '#FFFFFF',
  },
  tierOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  tierOption: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderWidth: 2,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  tierOptionSelected: {
    backgroundColor: 'rgba(106, 90, 205, 0.1)',
  },
  tierOptionDisabled: {
    opacity: 0.5,
  },
  tierOptionText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  tierOptionTextDisabled: {
    color: colors.textSecondary,
  },
  upgradeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(106, 90, 205, 0.3)',
    elevation: 3,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
