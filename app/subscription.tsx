
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';

const subscriptionTiers = [
  {
    id: 'basic',
    name: 'Basic',
    price: 15,
    color: '#00BFFF',
    features: [
      '1 verification badge (blue)',
      '50 mile match range',
      'Change location once every 6 months',
      '3 matches per day',
      'Basic status matches only',
      '3 new conversations per day',
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    price: 50,
    color: '#9370DB',
    features: [
      'Up to 3 verification badges (purple)',
      '100 mile match range',
      'Change location once every 3 months',
      '15 matches per day',
      'Access to Elite status matches',
      '15 new conversations per day',
      'Advanced match filters',
    ],
  },
  {
    id: 'star',
    name: 'Star',
    price: 125,
    color: '#FFD700',
    features: [
      'Up to 6 verification badges (gold)',
      '200 mile match range',
      'Change location anytime',
      '23 matches per day',
      'Access to Elite & Star matches',
      '23 new conversations per day',
      'Premium match filters',
      'Priority support',
    ],
  },
];

export default function SubscriptionScreen() {
  const currentTier = 'elite';
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState<any>(null);
  const [promoLoading, setPromoLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      Alert.alert('Error', 'Please enter a promo code');
      return;
    }

    setPromoLoading(true);
    try {
      // Check if promo code exists and is valid
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoCode.toUpperCase())
        .eq('active', true)
        .single();

      if (error || !data) {
        Alert.alert('Invalid Code', 'This promo code is not valid or has expired.');
        setPromoLoading(false);
        return;
      }

      // Check if code is still valid
      if (data.valid_until && new Date(data.valid_until) < new Date()) {
        Alert.alert('Expired Code', 'This promo code has expired.');
        setPromoLoading(false);
        return;
      }

      // Check if max uses reached
      if (data.max_uses && data.current_uses >= data.max_uses) {
        Alert.alert('Code Limit Reached', 'This promo code has reached its usage limit.');
        setPromoLoading(false);
        return;
      }

      setPromoApplied(data);
      Alert.alert('Success!', `Promo code applied: ${data.description || 'Discount applied'}`);
    } catch (err) {
      console.error('Error applying promo code:', err);
      Alert.alert('Error', 'Failed to apply promo code. Please try again.');
    } finally {
      setPromoLoading(false);
    }
  };

  const calculateDiscountedPrice = (originalPrice: number, tier: string) => {
    if (!promoApplied) return originalPrice;
    
    // Check if promo applies to this tier
    if (!promoApplied.applicable_tiers.includes(tier)) {
      return originalPrice;
    }

    if (promoApplied.discount_type === 'percentage') {
      return originalPrice * (1 - promoApplied.discount_value / 100);
    } else if (promoApplied.discount_type === 'fixed_amount') {
      return Math.max(0, originalPrice - promoApplied.discount_value);
    } else if (promoApplied.discount_type === 'free_months') {
      return 0; // First X months free
    }
    
    return originalPrice;
  };

  const handleSelectTier = async (tierId: string) => {
    if (tierId === currentTier) {
      Alert.alert('Current Plan', 'You are already subscribed to this plan.');
      return;
    }

    setSelectedTier(tierId);
    const tier = subscriptionTiers.find(t => t.id === tierId);
    if (!tier) return;

    const finalPrice = calculateDiscountedPrice(tier.price, tierId);
    const discountText = promoApplied 
      ? `\n\nOriginal: $${tier.price}/month\nWith promo: $${finalPrice.toFixed(2)}/month`
      : '';

    Alert.alert(
      'Subscription Required',
      `To access ${tier.name} features, you need to subscribe via In-App Purchase.${discountText}\n\nNote: This is a placeholder. In production, this will trigger the native IAP flow (Apple/Google Play Billing).`,
      [
        { text: 'Cancel', style: 'cancel', onPress: () => setSelectedTier(null) },
        {
          text: 'Continue',
          onPress: async () => {
            // In production, this would trigger Superwall or native IAP
            // For now, we'll simulate the subscription
            Alert.alert(
              'Success',
              'Subscription activated! (This is a demo - integrate Superwall for production)',
              [{ text: 'OK', onPress: () => setSelectedTier(null) }]
            );
          },
        },
      ]
    );
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode('');
  };

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
          <Text style={styles.title}>Subscription</Text>
        </View>

        <Text style={styles.subtitle}>
          Choose the plan that&apos;s right for you
        </Text>

        {/* Promo Code Section */}
        <View style={styles.promoSection}>
          <Text style={styles.promoLabel}>Have a promo code?</Text>
          <View style={styles.promoInputContainer}>
            <TextInput
              style={styles.promoInput}
              placeholder="Enter promo code"
              placeholderTextColor={colors.textSecondary}
              value={promoCode}
              onChangeText={setPromoCode}
              autoCapitalize="characters"
              editable={!promoApplied}
            />
            {promoApplied ? (
              <TouchableOpacity
                style={styles.promoRemoveButton}
                onPress={handleRemovePromo}
              >
                <IconSymbol
                  ios_icon_name="xmark.circle.fill"
                  android_material_icon_name="cancel"
                  size={24}
                  color={colors.error}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.promoApplyButton}
                onPress={handleApplyPromo}
                disabled={promoLoading || !promoCode.trim()}
              >
                {promoLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.promoApplyText}>Apply</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
          {promoApplied && (
            <View style={styles.promoAppliedBanner}>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={20}
                color="#4CAF50"
              />
              <Text style={styles.promoAppliedText}>
                {promoApplied.description || 'Promo code applied!'}
              </Text>
            </View>
          )}
        </View>

        {subscriptionTiers.map((tier) => {
          const originalPrice = tier.price;
          const discountedPrice = calculateDiscountedPrice(originalPrice, tier.id);
          const hasDiscount = promoApplied && promoApplied.applicable_tiers.includes(tier.id);

          return (
            <View
              key={tier.id}
              style={[
                styles.tierCard,
                currentTier === tier.id && styles.currentTierCard,
              ]}
            >
              <View style={styles.tierHeader}>
                <View>
                  <Text style={[styles.tierName, { color: tier.color }]}>
                    {tier.name}
                  </Text>
                  <View style={styles.priceContainer}>
                    {hasDiscount && (
                      <Text style={styles.originalPrice}>
                        ${originalPrice}
                      </Text>
                    )}
                    <Text style={styles.tierPrice}>
                      ${hasDiscount ? discountedPrice.toFixed(2) : originalPrice}
                      <Text style={styles.tierPriceUnit}>/month</Text>
                    </Text>
                  </View>
                  {hasDiscount && promoApplied.discount_type === 'free_months' && (
                    <Text style={styles.freeMonthsText}>
                      First {promoApplied.discount_value} month{promoApplied.discount_value > 1 ? 's' : ''} free!
                    </Text>
                  )}
                </View>
                {currentTier === tier.id && (
                  <View style={styles.currentBadge}>
                    <Text style={styles.currentBadgeText}>Current</Text>
                  </View>
                )}
              </View>

              <View style={styles.featuresContainer}>
                {tier.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check_circle"
                      size={20}
                      color={tier.color}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.selectButton,
                  currentTier === tier.id && styles.currentButton,
                  { backgroundColor: currentTier === tier.id ? colors.border : tier.color },
                ]}
                onPress={() => handleSelectTier(tier.id)}
                disabled={currentTier === tier.id || selectedTier === tier.id}
              >
                {selectedTier === tier.id ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text
                    style={[
                      styles.selectButtonText,
                      currentTier === tier.id && styles.currentButtonText,
                    ]}
                  >
                    {currentTier === tier.id ? 'Current Plan' : 'Select Plan'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          );
        })}

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Important:{'\n'}</Text>
            - All subscriptions are billed monthly via Apple/Google Play{'\n'}
            - You can cancel or change your plan at any time{'\n'}
            - Changes take effect at the start of your next billing cycle{'\n'}
            - Promo codes are applied at checkout
          </Text>
        </View>
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
    marginBottom: 12,
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
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  promoSection: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  promoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  promoInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  promoApplyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  promoApplyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  promoRemoveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  promoAppliedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  promoAppliedText: {
    fontSize: 14,
    color: '#2E7D32',
    marginLeft: 8,
    flex: 1,
  },
  tierCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  currentTierCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  tierName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  originalPrice: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  tierPrice: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
  },
  tierPriceUnit: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
  },
  freeMonthsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 4,
  },
  currentBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  currentBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  selectButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  currentButton: {
    backgroundColor: colors.border,
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  currentButtonText: {
    color: colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginLeft: 12,
  },
  boldText: {
    fontWeight: '600',
    color: colors.text,
  },
});
