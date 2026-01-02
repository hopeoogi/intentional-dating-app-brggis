
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { PRICING_TIERS } from '@/constants/Pricing';
import { IconSymbol } from '@/components/IconSymbol';

export default function SubscriptionScreen() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'semiAnnual' | 'annual'>('monthly');

  // TODO: Backend Integration - Handle subscription purchase
  const handleSubscribe = () => {
    if (!selectedTier) {
      Alert.alert('Error', 'Please select a subscription tier');
      return;
    }

    Alert.alert(
      'Coming Soon',
      'Subscription payments will be available soon via in-app purchases'
    );
  };

  return (
    <ScrollView style={commonStyles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.backgroundLight },
          headerTintColor: colors.text,
          headerTitle: 'Subscription',
        }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Upgrade Your Experience</Text>
          <Text style={styles.subtitle}>
            Get more matches and exclusive features
          </Text>
        </View>

        {/* Plan Type Selector */}
        <View style={styles.planSelector}>
          <PlanButton
            title="Monthly"
            selected={selectedPlan === 'monthly'}
            onPress={() => setSelectedPlan('monthly')}
          />
          <PlanButton
            title="6 Months"
            selected={selectedPlan === 'semiAnnual'}
            onPress={() => setSelectedPlan('semiAnnual')}
            badge="Save 17%"
          />
          <PlanButton
            title="Annual"
            selected={selectedPlan === 'annual'}
            onPress={() => setSelectedPlan('annual')}
            badge="Save 33%"
          />
        </View>

        {/* Tier Cards */}
        <View style={styles.tiers}>
          {Object.values(PRICING_TIERS).map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              planType={selectedPlan}
              selected={selectedTier === tier.id}
              onSelect={() => setSelectedTier(tier.id)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, !selectedTier && styles.subscribeButtonDisabled]}
          onPress={handleSubscribe}
          disabled={!selectedTier}
        >
          <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function PlanButton({
  title,
  selected,
  onPress,
  badge,
}: {
  title: string;
  selected: boolean;
  onPress: () => void;
  badge?: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.planButton, selected && styles.planButtonSelected]}
      onPress={onPress}
    >
      <Text style={[styles.planButtonText, selected && styles.planButtonTextSelected]}>
        {title}
      </Text>
      {badge && <Text style={styles.planBadge}>{badge}</Text>}
    </TouchableOpacity>
  );
}

function TierCard({
  tier,
  planType,
  selected,
  onSelect,
}: {
  tier: any;
  planType: 'monthly' | 'semiAnnual' | 'annual';
  selected: boolean;
  onSelect: () => void;
}) {
  const price = tier[planType];
  const isFree = tier.id === 'free';

  return (
    <TouchableOpacity
      style={[styles.tierCard, selected && styles.tierCardSelected]}
      onPress={onSelect}
      disabled={isFree}
    >
      <View style={styles.tierHeader}>
        <Text style={styles.tierName}>{tier.name}</Text>
        {!isFree && (
          <Text style={styles.tierPrice}>
            ${price}
            <Text style={styles.tierPriceUnit}>/{planType === 'monthly' ? 'mo' : planType === 'semiAnnual' ? '6mo' : 'yr'}</Text>
          </Text>
        )}
      </View>

      <View style={styles.tierFeatures}>
        {tier.features.map((feature: string, index: number) => (
          <View key={index} style={styles.tierFeature}>
            <IconSymbol
              ios_icon_name="checkmark"
              android_material_icon_name="check"
              size={16}
              color={colors.success}
            />
            <Text style={styles.tierFeatureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {isFree && (
        <Text style={styles.currentPlan}>Current Plan</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  planSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  planButton: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planButtonSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentTransparent,
  },
  planButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  planButtonTextSelected: {
    color: colors.text,
  },
  planBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.success,
    marginTop: 4,
  },
  tiers: {
    gap: 16,
    marginBottom: 24,
  },
  tierCard: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  tierCardSelected: {
    borderColor: colors.accent,
  },
  tierHeader: {
    marginBottom: 16,
  },
  tierName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  tierPrice: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  tierPriceUnit: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  tierFeatures: {
    gap: 12,
  },
  tierFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tierFeatureText: {
    fontSize: 14,
    color: colors.text,
  },
  currentPlan: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginTop: 16,
  },
  subscribeButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  subscribeButtonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
  subscribeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
