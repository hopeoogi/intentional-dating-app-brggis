
import { PRICING_TIERS } from '@/constants/Pricing';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useSubscription } from '@/hooks/useSubscription';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import { api } from '@/lib/api-client';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  tierCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedTier: {
    borderColor: colors.primary,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tierName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
  },
  tierBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tierBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  tierDescription: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  featureList: {
    marginBottom: 16,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 8,
  },
  planSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  planButton: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  selectedPlan: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  planButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  selectedPlanText: {
    color: '#fff',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  promoSection: {
    marginTop: 24,
    padding: 20,
    backgroundColor: colors.card,
    borderRadius: 16,
  },
  promoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
    color: colors.text,
  },
  applyButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  appliedPromo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.success + '20',
    borderRadius: 12,
    marginTop: 12,
  },
  appliedPromoText: {
    fontSize: 15,
    color: colors.success,
    fontWeight: '600',
  },
  removePromoButton: {
    padding: 4,
  },
});

export default function SubscriptionScreen() {
  useEffect(() => {
    console.log('[Subscription] Screen mounted');
  }, []);

  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'semiAnnual' | 'annual'>('monthly');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { subscription, loading: subLoading } = useSubscription();

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    if (!selectedTier) {
      Alert.alert('Error', 'Please select a subscription tier first');
      return;
    }

    setLoading(true);
    // TODO: Backend Integration - Apply promo code via backend API
    const { data, error } = await api.subscriptions.applyPromoCode(promoCode.trim(), selectedTier);
    setLoading(false);

    if (error) {
      Alert.alert('Invalid Code', error);
    } else if (data) {
      setAppliedPromo(data);
      Alert.alert('Success', 'Promo code applied!');
    }
  };

  const calculateDiscountedPrice = (originalPrice: number, tier: string) => {
    if (!appliedPromo || appliedPromo.applicable_tiers?.includes(tier) === false) {
      return originalPrice;
    }

    if (appliedPromo.discount_type === 'percentage') {
      return originalPrice * (1 - appliedPromo.discount_value / 100);
    } else if (appliedPromo.discount_type === 'fixed_amount') {
      return Math.max(0, originalPrice - appliedPromo.discount_value);
    }

    return originalPrice;
  };

  const handleSelectTier = async (tierId: string, planType: 'monthly' | 'semiAnnual' | 'annual') => {
    setLoading(true);
    // TODO: Backend Integration - Subscribe via backend API
    const { error } = await api.subscriptions.subscribe(
      tierId,
      planType,
      appliedPromo?.code
    );
    setLoading(false);

    if (error) {
      Alert.alert('Error', error);
    } else {
      Alert.alert(
        'Success',
        'Subscription activated! You can now enjoy your new benefits.',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Choose Your Plan</Text>
        <Text style={styles.sectionDescription}>
          Upgrade to get more daily matches and conversations
        </Text>

        {PRICING_TIERS.map((tier) => {
          const isSelected = selectedTier === tier.id;
          const monthlyPrice = calculateDiscountedPrice(tier.pricing.monthly, tier.id);
          const semiAnnualPrice = calculateDiscountedPrice(tier.pricing.semiAnnual, tier.id);
          const annualPrice = calculateDiscountedPrice(tier.pricing.annual, tier.id);

          return (
            <TouchableOpacity
              key={tier.id}
              style={[styles.tierCard, isSelected && styles.selectedTier]}
              onPress={() => setSelectedTier(tier.id)}
            >
              <View style={styles.tierHeader}>
                <Text style={styles.tierName}>{tier.name}</Text>
                <View
                  style={[
                    styles.tierBadge,
                    { backgroundColor: tier.color },
                  ]}
                >
                  <Text style={styles.tierBadgeText}>{tier.badge}</Text>
                </View>
              </View>

              <Text style={styles.tierDescription}>{tier.description}</Text>

              <View style={styles.featureList}>
                {tier.features.map((feature, index) => (
                  <View key={index} style={styles.feature}>
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check-circle"
                      size={20}
                      color={tier.color}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              {isSelected && (
                <>
                  <View style={styles.planSelector}>
                    <TouchableOpacity
                      style={[
                        styles.planButton,
                        selectedPlan === 'monthly' && styles.selectedPlan,
                      ]}
                      onPress={() => setSelectedPlan('monthly')}
                    >
                      <Text
                        style={[
                          styles.planButtonText,
                          selectedPlan === 'monthly' && styles.selectedPlanText,
                        ]}
                      >
                        Monthly
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.planButton,
                        selectedPlan === 'semiAnnual' && styles.selectedPlan,
                      ]}
                      onPress={() => setSelectedPlan('semiAnnual')}
                    >
                      <Text
                        style={[
                          styles.planButtonText,
                          selectedPlan === 'semiAnnual' && styles.selectedPlanText,
                        ]}
                      >
                        6 Months
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.planButton,
                        selectedPlan === 'annual' && styles.selectedPlan,
                      ]}
                      onPress={() => setSelectedPlan('annual')}
                    >
                      <Text
                        style={[
                          styles.planButtonText,
                          selectedPlan === 'annual' && styles.selectedPlanText,
                        ]}
                      >
                        Annual
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text style={styles.priceText}>
                    ${selectedPlan === 'monthly' ? monthlyPrice.toFixed(2) : 
                      selectedPlan === 'semiAnnual' ? semiAnnualPrice.toFixed(2) : 
                      annualPrice.toFixed(2)}/
                    {selectedPlan === 'monthly' ? 'month' : 
                     selectedPlan === 'semiAnnual' ? '6 months' : 
                     'year'}
                  </Text>

                  <TouchableOpacity
                    style={styles.subscribeButton}
                    onPress={() => handleSelectTier(tier.id, selectedPlan)}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </TouchableOpacity>
          );
        })}

        <View style={styles.promoSection}>
          <Text style={styles.promoTitle}>Have a Promo Code?</Text>
          {appliedPromo ? (
            <View style={styles.appliedPromo}>
              <Text style={styles.appliedPromoText}>
                {appliedPromo.code} - {appliedPromo.discount_value}
                {appliedPromo.discount_type === 'percentage' ? '%' : '$'} off
              </Text>
              <TouchableOpacity
                style={styles.removePromoButton}
                onPress={handleRemovePromo}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={24}
                  color={colors.error}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.promoInputContainer}>
              <TextInput
                style={styles.promoInput}
                value={promoCode}
                onChangeText={setPromoCode}
                placeholder="Enter code"
                placeholderTextColor={colors.textSecondary}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApplyPromo}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.applyButtonText}>Apply</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
