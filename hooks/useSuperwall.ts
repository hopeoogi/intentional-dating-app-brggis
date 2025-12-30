
import { useUser, usePlacement } from 'expo-superwall';
import { useEffect } from 'react';

/**
 * Custom hook to manage Superwall integration for the Intentional dating app
 * Handles user identification, subscription management, and paywall presentation
 */
export function useSuperwallIntegration(userId?: string) {
  const { identify, user, signOut, update, subscriptionStatus } = useUser();

  // Identify user when they log in
  useEffect(() => {
    if (userId) {
      identify(userId).catch((error) => {
        console.error('Failed to identify user with Superwall:', error);
      });
    }
  }, [userId, identify]);

  return {
    identify,
    user,
    signOut,
    update,
    subscriptionStatus,
    isSubscribed: subscriptionStatus?.status === 'ACTIVE',
  };
}

/**
 * Hook to trigger subscription paywall
 * @param placementId - The placement ID configured in Superwall dashboard
 * @param onSuccess - Callback when user successfully subscribes
 */
export function useSubscriptionPaywall(
  placementId: string = 'subscription_gate',
  onSuccess?: () => void
) {
  const { registerPlacement, state } = usePlacement({
    onPresent: (info) => {
      console.log('Paywall presented:', info);
    },
    onDismiss: (info, result) => {
      console.log('Paywall dismissed:', info, 'Result:', result);
      if (result === 'purchased' && onSuccess) {
        onSuccess();
      }
    },
    onError: (error) => {
      console.error('Paywall error:', error);
    },
  });

  const showPaywall = async () => {
    await registerPlacement({
      placement: placementId,
      feature: () => {
        // User already has access or successfully subscribed
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  };

  return {
    showPaywall,
    paywallState: state,
  };
}
