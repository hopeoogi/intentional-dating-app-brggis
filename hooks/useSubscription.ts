
import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { supabase } from '@/app/integrations/supabase/client';

export type SubscriptionTier = 'basic' | 'elite' | 'star' | null;

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: string | null;
  productId: string | null;
}

/**
 * Custom hook to manage subscription status and purchases
 * Handles direct App Store and Play Store in-app purchases
 */
export function useSubscription(userId?: string) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    tier: null,
    isActive: false,
    expiresAt: null,
    productId: null,
  });
  const [loading, setLoading] = useState(true);

  // Fetch subscription status from Supabase
  const fetchSubscriptionStatus = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching subscription:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setSubscriptionStatus({
          tier: data.tier as SubscriptionTier,
          isActive: true,
          expiresAt: data.expires_at,
          productId: data.product_id,
        });
      } else {
        setSubscriptionStatus({
          tier: null,
          isActive: false,
          expiresAt: null,
          productId: null,
        });
      }
    } catch (err) {
      console.error('Error in fetchSubscriptionStatus:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSubscriptionStatus();
  }, [fetchSubscriptionStatus]);

  // Initiate purchase flow
  const purchaseSubscription = useCallback(async (
    tier: SubscriptionTier,
    productId: string,
    promoCode?: string
  ) => {
    if (!userId) {
      Alert.alert('Error', 'You must be logged in to purchase a subscription.');
      return false;
    }

    try {
      // In a real implementation, this would trigger the native IAP flow
      // For now, we'll show a message directing users to the app store
      const platform = Platform.OS === 'ios' ? 'App Store' : 'Google Play Store';
      
      Alert.alert(
        'Purchase Subscription',
        `To complete your purchase, you'll be redirected to the ${platform}.\n\nSelected Plan: ${tier?.toUpperCase()}\nProduct ID: ${productId}${promoCode ? `\nPromo Code: ${promoCode}` : ''}`,
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Continue',
            onPress: async () => {
              // Here you would normally trigger the native IAP SDK
              // For example, using expo-in-app-purchases or react-native-iap
              console.log('Initiating purchase for:', { tier, productId, promoCode });
              
              // Simulate successful purchase for development
              // In production, this would be handled by the IAP SDK and verified server-side
              Alert.alert(
                'Purchase Flow',
                'In production, this will open the native payment sheet from Apple/Google.\n\nFor now, this is a placeholder. You\'ll need to:\n\n1. Set up products in App Store Connect / Google Play Console\n2. Implement IAP SDK (e.g., expo-in-app-purchases)\n3. Verify receipts server-side\n4. Update subscription status in Supabase'
              );
            },
          },
        ]
      );

      return true;
    } catch (error) {
      console.error('Error initiating purchase:', error);
      Alert.alert('Error', 'Failed to initiate purchase. Please try again.');
      return false;
    }
  }, [userId]);

  // Restore purchases (for users who reinstalled the app)
  const restorePurchases = useCallback(async () => {
    try {
      Alert.alert(
        'Restore Purchases',
        'This will check your App Store / Play Store account for previous purchases and restore your subscription.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Restore',
            onPress: async () => {
              // In production, this would call the IAP SDK's restore method
              console.log('Restoring purchases...');
              Alert.alert(
                'Restore Purchases',
                'In production, this will restore your purchases from Apple/Google.\n\nImplement this using the IAP SDK\'s restore functionality.'
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  }, []);

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    if (!userId || !subscriptionStatus.isActive) {
      return false;
    }

    try {
      const platform = Platform.OS === 'ios' ? 'App Store' : 'Google Play Store';
      
      Alert.alert(
        'Cancel Subscription',
        `To cancel your subscription, you need to manage it through the ${platform}.\n\nYour subscription will remain active until the end of your current billing period.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Open subscription management in App Store / Play Store
              if (Platform.OS === 'ios') {
                // iOS: Open App Store subscriptions
                console.log('Opening iOS subscription management');
              } else {
                // Android: Open Play Store subscriptions
                console.log('Opening Android subscription management');
              }
            },
          },
        ]
      );

      return true;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      Alert.alert('Error', 'Failed to open subscription management. Please try again.');
      return false;
    }
  }, [userId, subscriptionStatus]);

  return {
    subscriptionStatus,
    loading,
    purchaseSubscription,
    restorePurchases,
    cancelSubscription,
    refreshSubscription: fetchSubscriptionStatus,
  };
}
