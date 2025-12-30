
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

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
      'Up to 3 verification badges (blue)',
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

  const handleSelectTier = (tierId: string) => {
    if (tierId === currentTier) {
      Alert.alert('Current Plan', 'You are already subscribed to this plan.');
      return;
    }

    Alert.alert(
      'Change Subscription',
      `Would you like to upgrade to ${tierId.charAt(0).toUpperCase() + tierId.slice(1)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            Alert.alert('Success', 'Your subscription has been updated!');
          },
        },
      ]
    );
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

        {subscriptionTiers.map((tier) => (
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
                <Text style={styles.tierPrice}>
                  ${tier.price}
                  <Text style={styles.tierPriceUnit}>/month</Text>
                </Text>
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
              disabled={currentTier === tier.id}
            >
              <Text
                style={[
                  styles.selectButtonText,
                  currentTier === tier.id && styles.currentButtonText,
                ]}
              >
                {currentTier === tier.id ? 'Current Plan' : 'Select Plan'}
              </Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            All subscriptions are billed monthly. You can cancel or change your plan at any time.
            Changes take effect at the start of your next billing cycle.
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
    marginBottom: 24,
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
});
