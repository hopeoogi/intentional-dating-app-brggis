
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { PRICING_TIERS, PricingTier } from '@/constants/Pricing';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

type PlanType = 'monthly' | 'semiAnnual' | 'annual';

export default function SubscriptionScreen() {
  const [selectedTier, setSelectedTier] = useState<'basic' | 'elite' | 'star'>('basic');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('monthly');
  const [loading, setLoading] = useState(false);

  const currentTier = PRICING_TIERS.find((t) => t.id === selectedTier);

  const handleSubscribe = async () => {
    if (!currentTier) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Integrate with Superwall
      // For now, show a placeholder alert
      const plan = currentTier.plans[selectedPlan];
      Alert.alert(
        'Subscription',
        `You selected ${currentTier.name} - ${plan.period} for $${plan.price}. Superwall integration will handle the actual purchase.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Subscription error:', error);
      Alert.alert('Error', 'Failed to process subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderPlanButton = (planType: PlanType, label: string) => {
    const isSelected = selectedPlan === planType;
    const plan = currentTier?.plans[planType];
    if (!plan) {
      return null;
    }

    const showDiscount = planType !== 'monthly';

    return (
      <TouchableOpacity
        style={[styles.planButton, isSelected && styles.planButtonSelected]}
        onPress={() => setSelectedPlan(planType)}
      >
        <View style={styles.planButtonContent}>
          <View style={styles.planButtonLeft}>
            <Text style={[styles.planButtonLabel, isSelected && styles.planButtonLabelSelected]}>
              {label}
            </Text>
            {showDiscount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{plan.discount}% OFF</Text>
              </View>
            )}
          </View>
          <View style={styles.planButtonRight}>
            <Text style={[styles.planButtonPrice, isSelected && styles.planButtonPriceSelected]}>
              ${plan.price}
            </Text>
            {showDiscount && (
              <Text style={styles.planButtonMonthly}>${plan.monthlyPrice}/month</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Choose Your Plan</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.tierSelector}>
          {PRICING_TIERS.map((tier) => (
            <TouchableOpacity
              key={tier.id}
              style={[
                styles.tierButton,
                selectedTier === tier.id && styles.tierButtonSelected,
                { borderColor: tier.color },
              ]}
              onPress={() => setSelectedTier(tier.id)}
            >
              <Text
                style={[
                  styles.tierButtonText,
                  selectedTier === tier.id && styles.tierButtonTextSelected,
                ]}
              >
                {tier.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {currentTier && (
          <React.Fragment>
            <View style={[styles.tierCard, { borderColor: currentTier.color }]}>
              <Text style={styles.tierName}>{currentTier.name}</Text>
              <View style={styles.featuresContainer}>
                {currentTier.features.map((feature, index) => (
                  <View key={index} style={styles.featureRow}>
                    <IconSymbol
                      ios_icon_name="checkmark.circle.fill"
                      android_material_icon_name="check_circle"
                      size={20}
                      color={currentTier.color}
                    />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.plansContainer}>
              <Text style={styles.sectionTitle}>Select Billing Period</Text>
              {renderPlanButton('monthly', 'Monthly')}
              {renderPlanButton('semiAnnual', 'Semi-Annual')}
              {renderPlanButton('annual', 'Annual')}
            </View>

            <TouchableOpacity
              style={[styles.subscribeButton, { backgroundColor: currentTier.color }]}
              onPress={handleSubscribe}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.subscribeButtonText}>Subscribe Now</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.disclaimer}>
              Subscriptions automatically renew unless cancelled at least 24 hours before the end
              of the current period. Manage your subscription in your App Store or Google Play
              account settings.
            </Text>
          </React.Fragment>
        )}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  tierSelector: {
    flexDirection: 'column',
    gap: 12,
    marginBottom: 24,
  },
  tierButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: colors.card,
    alignItems: 'center',
  },
  tierButtonSelected: {
    backgroundColor: colors.primary + '20',
  },
  tierButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tierButtonTextSelected: {
    color: colors.text,
    fontWeight: '700',
  },
  tierCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 2,
  },
  tierName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
  },
  featuresContainer: {
    gap: 12,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
    lineHeight: 20,
  },
  plansContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  planButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  planButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  planButtonContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  planButtonLabelSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  discountBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  planButtonRight: {
    alignItems: 'flex-end',
  },
  planButtonPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  planButtonPriceSelected: {
    color: colors.primary,
  },
  planButtonMonthly: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  subscribeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
