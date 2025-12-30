
# Superwall Setup Guide for Intentional Dating App

## Overview

This guide will walk you through setting up Superwall for in-app purchases and subscriptions in the Intentional dating app.

## Step 1: Create a Superwall Account

1. Go to [https://superwall.com/](https://superwall.com/)
2. Click "Sign Up" or "Get Started"
3. Create your account with your email and password
4. Verify your email address

## Step 2: Create Your App in Superwall Dashboard

1. Log in to your Superwall dashboard
2. Click "Create New App" or "Add App"
3. Enter your app details:
   - **App Name**: Intentional Dating App
   - **Platform**: Select both iOS and Android
   - **Bundle ID (iOS)**: Your iOS bundle identifier (e.g., `com.intentional.dating`)
   - **Package Name (Android)**: Your Android package name (e.g., `com.intentional.dating`)

## Step 3: Get Your API Keys

1. In the Superwall dashboard, navigate to **Settings** > **API Keys**
2. You'll see two API keys:
   - **iOS API Key**: Starts with `pk_` (e.g., `pk_1234567890abcdef...`)
   - **Android API Key**: Starts with `pk_` (e.g., `pk_abcdef1234567890...`)
3. Copy both keys - you'll need them in the next step

## Step 4: Add API Keys to Your App

1. Open `app/_layout.tsx` in your code editor
2. Find the `SUPERWALL_API_KEYS` constant (around line 40)
3. Replace the placeholder keys with your actual keys:

```typescript
const SUPERWALL_API_KEYS = {
  ios: "pk_YOUR_ACTUAL_IOS_KEY_HERE",
  android: "pk_YOUR_ACTUAL_ANDROID_KEY_HERE",
};
```

**IMPORTANT**: Never commit these keys to a public repository. For production, use environment variables.

## Step 5: Configure Subscription Products in Superwall

1. In the Superwall dashboard, go to **Products**
2. Create three subscription products matching your tiers:

### Basic Tier ($15/month)
- **Product ID**: `intentional_basic_monthly`
- **Price**: $15.00
- **Billing Period**: Monthly
- **Features**:
  - 1 verification badge
  - 50-mile match range
  - 3 matches per day
  - 3 conversations per day

### Elite Tier ($50/month)
- **Product ID**: `intentional_elite_monthly`
- **Price**: $50.00
- **Billing Period**: Monthly
- **Features**:
  - 3 verification badges
  - 100-mile match range
  - 15 matches per day
  - 15 conversations per day
  - Advanced filters

### Star Tier ($125/month)
- **Product ID**: `intentional_star_monthly`
- **Price**: $125.00
- **Billing Period**: Monthly
- **Features**:
  - 5 verification badges
  - 200-mile match range
  - 23 matches per day
  - 23 conversations per day
  - All premium features

## Step 6: Create Paywalls in Superwall

1. Go to **Paywalls** in the Superwall dashboard
2. Click "Create Paywall"
3. Design your paywall using Superwall's visual editor
4. Create different paywalls for:
   - **Onboarding**: Show after profile approval
   - **Feature Gate**: Show when users hit limits
   - **Upgrade**: Show when users want to upgrade tiers

## Step 7: Configure Placements

Placements determine when and where paywalls appear. Create these placements:

1. **onboarding_paywall**
   - Trigger: After profile approval
   - Purpose: Convert new users to paid subscribers

2. **match_limit_reached**
   - Trigger: When daily match limit is reached
   - Purpose: Encourage upgrade for more matches

3. **conversation_limit_reached**
   - Trigger: When daily conversation limit is reached
   - Purpose: Encourage upgrade for more conversations

4. **upgrade_prompt**
   - Trigger: Manual trigger from settings
   - Purpose: Allow users to upgrade their tier

## Step 8: Set Up App Store Connect (iOS)

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/)
2. Go to your app > **Features** > **In-App Purchases**
3. Create three auto-renewable subscriptions:
   - `intentional_basic_monthly` - $15/month
   - `intentional_elite_monthly` - $50/month
   - `intentional_star_monthly` - $125/month
4. Configure subscription groups and pricing
5. Submit for review

## Step 9: Set Up Google Play Console (Android)

1. Log in to [Google Play Console](https://play.google.com/console/)
2. Go to your app > **Monetize** > **Subscriptions**
3. Create three subscriptions matching iOS:
   - `intentional_basic_monthly` - $15/month
   - `intentional_elite_monthly` - $50/month
   - `intentional_star_monthly` - $125/month
4. Configure billing periods and pricing
5. Activate subscriptions

## Step 10: Connect Superwall to App Stores

### For iOS (App Store Connect)
1. In Superwall dashboard, go to **Settings** > **App Store Connect**
2. Upload your App Store Connect API key
3. Select your app and products
4. Superwall will automatically sync your products

### For Android (Google Play)
1. In Superwall dashboard, go to **Settings** > **Google Play**
2. Upload your Google Play service account JSON
3. Select your app and products
4. Superwall will automatically sync your products

## Step 11: Test Your Integration

1. Build your app in development mode
2. Use Superwall's test mode to verify:
   - Paywalls display correctly
   - Purchase flow works
   - Subscription status updates
   - Promo codes apply correctly

## Step 12: Configure Promo Codes

Your app already has 5 launch promo codes configured:

1. **LAUNCH15** - 15% off first month (all tiers)
2. **BASICFREE** - Free Basic subscription for 1 month
3. **ELITEHALF** - 50% off first month of Elite
4. **STAR20** - 20% off first 2 months of Star
5. **FRIENDREF** - Free Basic for referrals

To add more promo codes:
1. Log in to the admin panel
2. Navigate to **Promo Codes**
3. Click the "+" button
4. Fill in the details and save

## Admin User Credentials

Your first admin user has been created:

- **Username**: OogiAdmin
- **Email**: oogiadmin@intentional.app
- **Password**: Super168Hope$%
- **Role**: Super Admin

**IMPORTANT**: Change this password immediately after first login!

## Notification Templates

Seven notification templates have been configured:

1. **New Match** - Sent when users get a new match
2. **Profile Approved** - Sent when profile is approved
3. **Profile Rejected** - Sent when profile needs improvement
4. **Badge Approved** - Sent when verification badge is approved
5. **Badge Rejected** - Sent when verification badge is rejected
6. **Pending Response** - Sent when conversation needs attention
7. **Conversation Ended** - Sent when conversation is ended

You can customize these in the admin panel under **Push Notifications**.

## Next Steps

1. **Get your Superwall API keys** and add them to `app/_layout.tsx`
2. **Configure your subscription products** in Superwall dashboard
3. **Design your paywalls** using Superwall's visual editor
4. **Set up App Store Connect** and Google Play Console
5. **Test the integration** thoroughly before launch
6. **Monitor analytics** in Superwall dashboard

## Support

- **Superwall Documentation**: [https://docs.superwall.com/](https://docs.superwall.com/)
- **Superwall Support**: support@superwall.com
- **App Store Connect Help**: [https://developer.apple.com/support/app-store-connect/](https://developer.apple.com/support/app-store-connect/)
- **Google Play Console Help**: [https://support.google.com/googleplay/android-developer](https://support.google.com/googleplay/android-developer)

## Security Best Practices

1. **Never commit API keys** to version control
2. **Use environment variables** for production keys
3. **Rotate keys regularly** if compromised
4. **Enable two-factor authentication** on all accounts
5. **Monitor for suspicious activity** in dashboards
6. **Keep backup copies** of important credentials (securely)

## Troubleshooting

### Superwall not initializing
- Check that API keys are correct
- Verify internet connection
- Check console logs for errors

### Purchases not working
- Verify products are created in App Store Connect / Google Play
- Check that product IDs match exactly
- Ensure app is signed with correct provisioning profile

### Promo codes not applying
- Verify code is active in admin panel
- Check that code hasn't reached max uses
- Ensure code is valid for selected tier

---

**Last Updated**: December 2024
**Version**: 1.0.0
