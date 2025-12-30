
# Native In-App Purchase Implementation Guide

## Overview
This guide provides step-by-step instructions for implementing native in-app purchases (IAP) for the Intentional dating app using direct App Store and Play Store integration.

## Why Native IAP Instead of Superwall?

**Benefits:**
- Simplified architecture for early deployment
- No third-party payment dependencies
- Direct control over pricing and products
- Lower operational costs (no Superwall subscription)
- Easier to debug and maintain
- Full compliance with App Store and Play Store policies

**When to Consider Superwall:**
If you later need advanced features like A/B testing, paywall templates, or sophisticated analytics, you can always add Superwall. For now, native IAP keeps things simple.

## Prerequisites

### 1. App Store Connect Setup (iOS)
1. Log in to [App Store Connect](https://appstoreconnect.apple.com/)
2. Navigate to your app
3. Go to "Features" → "In-App Purchases"
4. Create products for each subscription tier:

**Product IDs (from constants/Pricing.ts):**
- `intentional_basic_monthly` - Basic Monthly ($15.00)
- `intentional_basic_semiannual` - Basic 6 Months ($70.20)
- `intentional_basic_annual` - Basic Annual ($100.80)
- `intentional_elite_monthly` - Elite Monthly ($80.00)
- `intentional_elite_semiannual` - Elite 6 Months ($374.40)
- `intentional_elite_annual` - Elite Annual ($537.60)
- `intentional_star_monthly` - Star Monthly ($250.00)
- `intentional_star_semiannual` - Star 6 Months ($1170.00)
- `intentional_star_annual` - Star Annual ($1680.00)

**Product Type:** Auto-Renewable Subscription

**Subscription Group:** Create a group called "Intentional Subscriptions"

### 2. Google Play Console Setup (Android)
1. Log in to [Google Play Console](https://play.google.com/console/)
2. Navigate to your app
3. Go to "Monetize" → "Subscriptions"
4. Create the same products with matching product IDs
5. Set up subscription groups and base plans

### 3. Tax and Banking
- Complete tax forms in both App Store Connect and Play Console
- Set up banking information for payouts
- Configure pricing for all regions

## Implementation Steps

### Step 1: Choose an IAP Library

We recommend one of these libraries:

#### Option A: expo-in-app-purchases (Recommended for Expo)
```bash
npx expo install expo-in-app-purchases
```

**Pros:**
- Official Expo package
- Good documentation
- Easier setup with Expo

**Cons:**
- Less feature-rich than react-native-iap
- Smaller community

#### Option B: react-native-iap (More Features)
```bash
npm install react-native-iap
```

**Pros:**
- More mature and feature-rich
- Larger community
- Better error handling

**Cons:**
- Requires more configuration
- May need custom native code

### Step 2: Update hooks/useSubscription.ts

Replace the placeholder implementation with actual IAP calls:

```typescript
import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert } from 'react-native';
import { supabase } from '@/app/integrations/supabase/client';
// Import your chosen IAP library
// import * as InAppPurchases from 'expo-in-app-purchases';
// OR
// import * as RNIap from 'react-native-iap';

export type SubscriptionTier = 'basic' | 'elite' | 'star' | null;

export interface SubscriptionStatus {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: string | null;
  productId: string | null;
}

export function useSubscription(userId?: string) {
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    tier: null,
    isActive: false,
    expiresAt: null,
    productId: null,
  });
  const [loading, setLoading] = useState(true);

  // Initialize IAP connection
  useEffect(() => {
    const initIAP = async () => {
      try {
        // For expo-in-app-purchases:
        // await InAppPurchases.connectAsync();
        
        // For react-native-iap:
        // await RNIap.initConnection();
        
        console.log('IAP connection initialized');
      } catch (error) {
        console.error('Failed to initialize IAP:', error);
      }
    };

    initIAP();

    return () => {
      // Cleanup
      // For expo-in-app-purchases:
      // InAppPurchases.disconnectAsync();
      
      // For react-native-iap:
      // RNIap.endConnection();
    };
  }, []);

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

  // Purchase subscription
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
      // For expo-in-app-purchases:
      // const { responseCode, results } = await InAppPurchases.purchaseItemAsync(productId);
      
      // For react-native-iap:
      // const purchase = await RNIap.requestSubscription({
      //   sku: productId,
      //   ...(promoCode && Platform.OS === 'ios' && { 
      //     offerToken: promoCode 
      //   })
      // });

      // After successful purchase, verify receipt server-side
      // Send receipt to your Supabase Edge Function for verification
      // const { data, error } = await supabase.functions.invoke('verify-receipt', {
      //   body: {
      //     receipt: purchase.transactionReceipt,
      //     platform: Platform.OS,
      //     productId,
      //     tier,
      //   }
      // });

      // If verification successful, refresh subscription status
      // await fetchSubscriptionStatus();

      Alert.alert('Success!', 'Your subscription has been activated.');
      return true;
    } catch (error: any) {
      console.error('Error purchasing subscription:', error);
      
      if (error.code === 'E_USER_CANCELLED') {
        // User cancelled, no need to show error
        return false;
      }
      
      Alert.alert('Error', 'Failed to complete purchase. Please try again.');
      return false;
    }
  }, [userId, fetchSubscriptionStatus]);

  // Restore purchases
  const restorePurchases = useCallback(async () => {
    try {
      // For expo-in-app-purchases:
      // const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
      
      // For react-native-iap:
      // const purchases = await RNIap.getAvailablePurchases();

      // Verify each purchase server-side and update subscription status
      // for (const purchase of purchases) {
      //   await supabase.functions.invoke('verify-receipt', {
      //     body: {
      //       receipt: purchase.transactionReceipt,
      //       platform: Platform.OS,
      //       productId: purchase.productId,
      //     }
      //   });
      // }

      await fetchSubscriptionStatus();
      Alert.alert('Success', 'Your purchases have been restored.');
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    }
  }, [fetchSubscriptionStatus]);

  return {
    subscriptionStatus,
    loading,
    purchaseSubscription,
    restorePurchases,
    refreshSubscription: fetchSubscriptionStatus,
  };
}
```

### Step 3: Create Receipt Verification Edge Function

Create a Supabase Edge Function to verify receipts server-side:

**File: supabase/functions/verify-receipt/index.ts**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { receipt, platform, productId, tier } = await req.json();
    
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    let isValid = false;
    let expiresAt = null;
    let transactionId = null;
    let originalTransactionId = null;

    if (platform === 'ios') {
      // Verify with Apple
      // https://developer.apple.com/documentation/appstorereceipts/verifyreceipt
      const appleResponse = await fetch(
        'https://buy.itunes.apple.com/verifyReceipt', // Use sandbox URL for testing
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            'receipt-data': receipt,
            'password': Deno.env.get('APPLE_SHARED_SECRET'),
          }),
        }
      );

      const appleData = await appleResponse.json();
      
      if (appleData.status === 0) {
        isValid = true;
        const latestReceipt = appleData.latest_receipt_info?.[0];
        if (latestReceipt) {
          expiresAt = new Date(parseInt(latestReceipt.expires_date_ms));
          transactionId = latestReceipt.transaction_id;
          originalTransactionId = latestReceipt.original_transaction_id;
        }
      }
    } else if (platform === 'android') {
      // Verify with Google Play
      // https://developers.google.com/android-publisher/api-ref/rest/v3/purchases.subscriptions/get
      const packageName = Deno.env.get('ANDROID_PACKAGE_NAME');
      const googleResponse = await fetch(
        `https://androidpublisher.googleapis.com/androidpublisher/v3/applications/${packageName}/purchases/subscriptions/${productId}/tokens/${receipt}`,
        {
          headers: {
            'Authorization': `Bearer ${Deno.env.get('GOOGLE_PLAY_ACCESS_TOKEN')}`,
          },
        }
      );

      const googleData = await googleResponse.json();
      
      if (googleData.expiryTimeMillis) {
        isValid = true;
        expiresAt = new Date(parseInt(googleData.expiryTimeMillis));
        transactionId = receipt;
        originalTransactionId = googleData.orderId;
      }
    }

    if (isValid) {
      // Update or insert subscription
      const { error: upsertError } = await supabaseClient
        .from('user_subscriptions')
        .upsert({
          user_id: user.id,
          tier,
          product_id: productId,
          status: 'active',
          platform,
          transaction_id: transactionId,
          original_transaction_id: originalTransactionId,
          receipt_data: receipt,
          expires_at: expiresAt,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,status'
        });

      if (upsertError) throw upsertError;

      return new Response(
        JSON.stringify({ success: true, expiresAt }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      throw new Error('Invalid receipt');
    }
  } catch (error) {
    console.error('Error verifying receipt:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Step 4: Set Up Environment Variables

In your Supabase project, add these environment variables for the Edge Function:

1. Go to Supabase Dashboard → Project Settings → Edge Functions
2. Add the following secrets:

```bash
# Apple
APPLE_SHARED_SECRET=your_apple_shared_secret

# Google Play
ANDROID_PACKAGE_NAME=com.yourapp.intentional
GOOGLE_PLAY_ACCESS_TOKEN=your_google_play_access_token
```

**Getting Apple Shared Secret:**
1. Go to App Store Connect
2. Navigate to "Users and Access" → "Shared Secret"
3. Generate or view your shared secret

**Getting Google Play Access Token:**
1. Set up a service account in Google Cloud Console
2. Grant it access to your Play Console
3. Use the service account to generate access tokens

### Step 5: Test Your Implementation

#### iOS Testing:
1. Use TestFlight for testing subscriptions
2. Create sandbox test accounts in App Store Connect
3. Test purchase flow, restoration, and expiration

#### Android Testing:
1. Use internal testing track in Play Console
2. Add test accounts
3. Test purchase flow, restoration, and expiration

### Step 6: Handle Subscription Status Updates

Create a webhook or scheduled function to check for subscription renewals/cancellations:

**File: supabase/functions/check-subscriptions/index.ts**

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  // Get all active subscriptions
  const { data: subscriptions } = await supabaseClient
    .from('user_subscriptions')
    .select('*')
    .eq('status', 'active');

  for (const subscription of subscriptions || []) {
    // Check if subscription has expired
    if (new Date(subscription.expires_at) < new Date()) {
      // Mark as expired
      await supabaseClient
        .from('user_subscriptions')
        .update({ status: 'expired' })
        .eq('id', subscription.id);
      
      // Optionally send notification to user
    }
  }

  return new Response(JSON.stringify({ checked: subscriptions?.length || 0 }));
});
```

Schedule this function to run daily using Supabase Cron Jobs.

## Promo Code Integration

### iOS Promotional Offers
1. Create promotional offers in App Store Connect
2. Generate offer codes
3. Users can redeem codes in the App Store app

### Android Promo Codes
1. Create promo codes in Play Console
2. Distribute codes to users
3. Users redeem in Play Store app

### In-App Promo Code Validation
The current implementation validates promo codes from your Supabase database. These codes apply discounts at the time of purchase display but don't affect the actual App Store/Play Store pricing. For true promotional pricing, use the platform's native promo code systems.

## Troubleshooting

### Common Issues:

**1. "Cannot connect to iTunes Store"**
- Check your App Store Connect configuration
- Ensure products are approved and available
- Verify you're using the correct product IDs

**2. "Receipt verification failed"**
- Check your shared secret (iOS) or service account (Android)
- Ensure you're using the correct verification endpoint (sandbox vs production)
- Verify the receipt format is correct

**3. "Subscription not showing up"**
- Check RLS policies on user_subscriptions table
- Verify the Edge Function is deployed and accessible
- Check Edge Function logs for errors

**4. "Purchase succeeds but subscription not activated"**
- Verify receipt verification is working
- Check Edge Function logs
- Ensure user_subscriptions table is being updated

## Security Best Practices

1. **Always verify receipts server-side** - Never trust client-side validation
2. **Use HTTPS** - All API calls should use HTTPS
3. **Protect your secrets** - Never commit API keys or shared secrets to version control
4. **Implement rate limiting** - Prevent abuse of verification endpoints
5. **Log all transactions** - Keep audit logs for debugging and compliance
6. **Handle edge cases** - Account for network failures, timeouts, etc.

## Monitoring and Analytics

Track these metrics:
- Purchase conversion rate
- Subscription renewal rate
- Churn rate
- Revenue by tier
- Failed purchase attempts
- Receipt verification failures

Use Supabase Analytics or integrate with tools like:
- RevenueCat (for subscription analytics)
- Mixpanel
- Amplitude
- Google Analytics

## Next Steps

1. Implement the IAP library of your choice
2. Update `hooks/useSubscription.ts` with actual IAP calls
3. Create and deploy the receipt verification Edge Function
4. Set up products in App Store Connect and Play Console
5. Test thoroughly with sandbox accounts
6. Submit for app review
7. Monitor and iterate based on user feedback

## Resources

- [Apple In-App Purchase Documentation](https://developer.apple.com/in-app-purchase/)
- [Google Play Billing Documentation](https://developer.android.com/google/play/billing)
- [expo-in-app-purchases Documentation](https://docs.expo.dev/versions/latest/sdk/in-app-purchases/)
- [react-native-iap Documentation](https://github.com/dooboolab/react-native-iap)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

---

**Last Updated:** December 2024
**Status:** Ready for Implementation
