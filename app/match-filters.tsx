
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useUser } from '@/contexts/UserContext';
import {
  SUBSCRIPTION_LIMITS,
  AVAILABLE_STATUSES,
  BODY_PREFERENCES,
  ETHNICITIES,
} from '@/types/MatchFilters';

export default function MatchFiltersScreen() {
  const { subscriptionTier, matchFilters, updateMatchFilters } = useUser();
  const limits = SUBSCRIPTION_LIMITS[subscriptionTier];
  
  const [localFilters, setLocalFilters] = useState(matchFilters);

  const handleSave = () => {
    updateMatchFilters(localFilters);
    Alert.alert('Success', 'Your match filters have been updated!', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const toggleStatus = (status: string) => {
    const currentStatuses = localFilters.selectedStatuses;
    
    if (currentStatuses.includes(status)) {
      setLocalFilters({
        ...localFilters,
        selectedStatuses: currentStatuses.filter((s) => s !== status),
      });
    } else {
      if (currentStatuses.length >= limits.maxStatuses) {
        Alert.alert(
          'Limit Reached',
          `You can only select up to ${limits.maxStatuses} statuses with your ${subscriptionTier} subscription.`
        );
        return;
      }
      setLocalFilters({
        ...localFilters,
        selectedStatuses: [...currentStatuses, status],
      });
    }
  };

  const toggleBodyPreference = (pref: string) => {
    const current = localFilters.bodyPreference || [];
    
    if (current.includes(pref)) {
      setLocalFilters({
        ...localFilters,
        bodyPreference: current.filter((p) => p !== pref),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        bodyPreference: [...current, pref],
      });
    }
  };

  const toggleEthnicity = (eth: string) => {
    const current = localFilters.ethnicity || [];
    
    if (current.includes(eth)) {
      setLocalFilters({
        ...localFilters,
        ethnicity: current.filter((e) => e !== eth),
      });
    } else {
      setLocalFilters({
        ...localFilters,
        ethnicity: [...current, eth],
      });
    }
  };

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Match Filters</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>
            {subscriptionTier.toUpperCase()} TIER
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Search Distance</Text>
          <Text style={styles.sectionSubtitle}>
            Maximum: {limits.maxDistance} miles
          </Text>
          <View style={styles.distanceContainer}>
            <Text style={styles.distanceValue}>{localFilters.maxDistance} miles</Text>
            <View style={styles.distanceButtons}>
              <TouchableOpacity
                style={styles.distanceButton}
                onPress={() =>
                  setLocalFilters({
                    ...localFilters,
                    maxDistance: Math.max(10, localFilters.maxDistance - 10),
                  })
                }
              >
                <Text style={styles.distanceButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.distanceButton}
                onPress={() =>
                  setLocalFilters({
                    ...localFilters,
                    maxDistance: Math.min(
                      limits.maxDistance,
                      localFilters.maxDistance + 10
                    ),
                  })
                }
              >
                <Text style={styles.distanceButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verification Statuses</Text>
          <Text style={styles.sectionSubtitle}>
            Selected: {localFilters.selectedStatuses.length} / {limits.maxStatuses}
          </Text>
          <View style={styles.statusGrid}>
            {AVAILABLE_STATUSES.map((status) => {
              const isSelected = localFilters.selectedStatuses.includes(status);
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.statusChip, isSelected && styles.statusChipSelected]}
                  onPress={() => toggleStatus(status)}
                >
                  <Text
                    style={[
                      styles.statusChipText,
                      isSelected && styles.statusChipTextSelected,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Age Range</Text>
          <View style={styles.ageRangeContainer}>
            <View style={styles.ageInput}>
              <Text style={styles.ageLabel}>Min</Text>
              <View style={styles.ageButtons}>
                <TouchableOpacity
                  style={styles.ageButton}
                  onPress={() =>
                    setLocalFilters({
                      ...localFilters,
                      ageRange: {
                        ...localFilters.ageRange,
                        min: Math.max(18, localFilters.ageRange.min - 1),
                      },
                    })
                  }
                >
                  <Text style={styles.ageButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.ageValue}>{localFilters.ageRange.min}</Text>
                <TouchableOpacity
                  style={styles.ageButton}
                  onPress={() =>
                    setLocalFilters({
                      ...localFilters,
                      ageRange: {
                        ...localFilters.ageRange,
                        min: Math.min(
                          localFilters.ageRange.max - 1,
                          localFilters.ageRange.min + 1
                        ),
                      },
                    })
                  }
                >
                  <Text style={styles.ageButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.ageInput}>
              <Text style={styles.ageLabel}>Max</Text>
              <View style={styles.ageButtons}>
                <TouchableOpacity
                  style={styles.ageButton}
                  onPress={() =>
                    setLocalFilters({
                      ...localFilters,
                      ageRange: {
                        ...localFilters.ageRange,
                        max: Math.max(
                          localFilters.ageRange.min + 1,
                          localFilters.ageRange.max - 1
                        ),
                      },
                    })
                  }
                >
                  <Text style={styles.ageButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.ageValue}>{localFilters.ageRange.max}</Text>
                <TouchableOpacity
                  style={styles.ageButton}
                  onPress={() =>
                    setLocalFilters({
                      ...localFilters,
                      ageRange: {
                        ...localFilters.ageRange,
                        max: Math.min(99, localFilters.ageRange.max + 1),
                      },
                    })
                  }
                >
                  <Text style={styles.ageButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {limits.hasAdvancedFilters && (
          <React.Fragment>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Body Preference</Text>
              <Text style={styles.sectionSubtitle}>Optional - Select all that apply</Text>
              <View style={styles.statusGrid}>
                {BODY_PREFERENCES.map((pref) => {
                  const isSelected = (localFilters.bodyPreference || []).includes(pref);
                  return (
                    <TouchableOpacity
                      key={pref}
                      style={[styles.statusChip, isSelected && styles.statusChipSelected]}
                      onPress={() => toggleBodyPreference(pref)}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          isSelected && styles.statusChipTextSelected,
                        ]}
                      >
                        {pref}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ethnicity</Text>
              <Text style={styles.sectionSubtitle}>Optional - Select all that apply</Text>
              <View style={styles.statusGrid}>
                {ETHNICITIES.map((eth) => {
                  const isSelected = (localFilters.ethnicity || []).includes(eth);
                  return (
                    <TouchableOpacity
                      key={eth}
                      style={[styles.statusChip, isSelected && styles.statusChipSelected]}
                      onPress={() => toggleEthnicity(eth)}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          isSelected && styles.statusChipTextSelected,
                        ]}
                      >
                        {eth}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </React.Fragment>
        )}

        {!limits.hasAdvancedFilters && (
          <View style={styles.upgradeCard}>
            <IconSymbol
              ios_icon_name="star.fill"
              android_material_icon_name="star"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.upgradeTitle}>Unlock Advanced Filters</Text>
            <Text style={styles.upgradeText}>
              Upgrade to Elite or Star to access height, body preference, and ethnicity filters
            </Text>
            <TouchableOpacity style={styles.upgradeButton}>
              <Text style={styles.upgradeButtonText}>Upgrade Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  saveButton: {
    padding: 8,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  tierBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 24,
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  distanceContainer: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  distanceValue: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  distanceButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  distanceButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  distanceButtonText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  statusChipTextSelected: {
    color: '#FFFFFF',
  },
  ageRangeContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  ageInput: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  ageLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 12,
  },
  ageButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ageValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  upgradeCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginTop: 16,
  },
  upgradeTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  upgradeText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  upgradeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
