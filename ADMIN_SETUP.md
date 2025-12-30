
# Admin Panel & Subscription Setup Guide

## Overview

This document explains the new features added to the Intentional Dating App:

1. **Updated Pricing Scheme** with discounts
2. **Subscription Screen** for users to view and purchase plans
3. **Admin Dashboard** for managing users, analytics, and notifications
4. **Superwall Integration** for in-app purchases

---

## Features Implemented

### 1. Pricing & Subscriptions

**Location:** `app/subscription.tsx` and `constants/Pricing.ts`

The app now includes three subscription tiers with monthly, semi-annual, and annual billing options:

#### Basic Package
- **Monthly:** $15/30 days
- **Semi-Annual:** $70.20/6 months ($11.70/month) - 22% OFF
- **Annual:** $100.80/12 months ($8.40/month) - 44% OFF

#### Elite Package
- **Monthly:** $80/30 days
- **Semi-Annual:** $374.40/6 months ($62.40/month) - 22% OFF
- **Annual:** $537.60/12 months ($44.80/month) - 44% OFF

#### Star Package
- **Monthly:** $250/30 days
- **Semi-Annual:** $1170/6 months ($195/month) - 22% OFF
- **Annual:** $1680/12 months ($140/month) - 44% OFF

**Access:** Users can access the subscription screen from Profile → "Upgrade Subscription"

---

### 2. Admin Dashboard

**Location:** `app/admin/index.tsx`

The admin dashboard is **web-only** and provides:

- **User Statistics:** Total users, pending approvals, active subscriptions, revenue
- **Subscription Breakdown:** Count of Basic, Elite, and Star subscribers
- **Quick Actions:**
  - Review Pending Users
  - User Management
  - Analytics & Reports
  - Email Campaigns
  - Payment Tracking
  - Push Notification Management

**Access:** Profile → "Admin Panel" (visible to all users for demo purposes)

**Note:** The admin panel shows a message on mobile devices directing users to access it via web browser.

---

### 3. Push Notification Management

**Location:** `app/admin/notifications.tsx`

Features:
- **Notification Templates:** Manage automatic notification wording
- **Schedule Notifications:** Send custom notifications to all users
- **Toggle Templates:** Enable/disable specific notification types
- **Test Notifications:** Send test notifications to verify setup

**Current Implementation:**
- Uses `expo-notifications` for local/scheduled notifications
- Templates can be toggled on/off
- Scheduling interface for custom notifications
- Test notification functionality

**Production Requirements:**
To fully implement this feature, you'll need:
1. **Supabase Backend** for storing notification templates and schedules
2. **Supabase Edge Functions** to send notifications to all users
3. **User notification preferences** stored in database
4. **Notification history tracking**

---

### 4. Superwall Integration

**Package:** `expo-superwall` (installed)

**Setup Required:**

1. **Get Superwall API Keys:**
   - Sign up at [superwall.com](https://superwall.com)
   - Create a new project
   - Get your iOS and Android API keys

2. **Configure Products in Superwall Dashboard:**
   - Create products matching the product IDs in `constants/Pricing.ts`:
     - `intentional_basic_monthly`
     - `intentional_basic_semiannual`
     - `intentional_basic_annual`
     - `intentional_elite_monthly`
     - `intentional_elite_semiannual`
     - `intentional_elite_annual`
     - `intentional_star_monthly`
     - `intentional_star_semiannual`
     - `intentional_star_annual`

3. **Configure App Store Connect (iOS):**
   - Create in-app purchase products with the same IDs
   - Set up pricing for each product
   - Submit for review

4. **Configure Google Play Console (Android):**
   - Create subscription products with the same IDs
   - Set up pricing for each product
   - Publish products

5. **Integrate Superwall in App:**
   - Wrap your app with `SuperwallProvider` in `app/_layout.tsx`
   - Use `usePlacement` hook to trigger paywalls
   - Handle subscription status with `useUser` hook

**Example Integration:**

```tsx
import { SuperwallProvider } from 'expo-superwall';

export default function RootLayout() {
  return (
    <SuperwallProvider 
      apiKeys={{ 
        ios: 'YOUR_IOS_API_KEY',
        android: 'YOUR_ANDROID_API_KEY'
      }}
    >
      {/* Your app content */}
    </SuperwallProvider>
  );
}
```

---

## Backend Requirements (Supabase)

To fully implement the admin features, you need to enable Supabase and create the following:

### Database Tables

1. **users**
   - id, email, name, age, bio, location, subscription_tier, created_at, last_active, etc.

2. **user_applications**
   - id, user_id, status (pending/approved/rejected), submitted_at, reviewed_at, reviewer_id

3. **subscriptions**
   - id, user_id, tier, plan_type, start_date, end_date, amount, status

4. **notification_templates**
   - id, name, title, body, enabled, created_at, updated_at

5. **scheduled_notifications**
   - id, title, body, scheduled_for, sent_at, recipient_count

6. **analytics_events**
   - id, user_id, event_type, metadata, created_at

### Edge Functions

1. **send-notification**
   - Sends push notifications to all users or filtered groups
   - Handles notification scheduling

2. **process-subscription-webhook**
   - Receives webhooks from Superwall
   - Updates user subscription status in database

3. **generate-analytics**
   - Aggregates user data for analytics dashboard
   - Filters by location, age, gender, subscription tier

---

## Current Limitations

1. **Admin Features:** Most admin features show placeholder screens indicating Supabase is required
2. **Payment Processing:** Subscription screen shows alerts instead of actual purchases (Superwall integration needed)
3. **User Management:** No actual user approval/rejection workflow (requires backend)
4. **Analytics:** No real data aggregation (requires backend)
5. **Email Campaigns:** No email collection or sending (requires backend + email service)

---

## Next Steps

1. **Enable Supabase:**
   - Press the Supabase button in Natively
   - Connect to a Supabase project
   - Create the required database tables

2. **Set Up Superwall:**
   - Create Superwall account
   - Configure products
   - Add API keys to app

3. **Configure App Store & Play Store:**
   - Set up in-app purchase products
   - Configure pricing
   - Submit for review

4. **Implement Backend Logic:**
   - Create Supabase Edge Functions
   - Set up webhook endpoints
   - Implement user approval workflow

5. **Test Payment Flow:**
   - Test subscriptions on physical devices
   - Verify webhook delivery
   - Confirm subscription status updates

---

## Testing

### Subscription Screen
- Navigate to Profile → "Upgrade Subscription"
- Select different tiers and plans
- Verify pricing calculations and discounts

### Admin Dashboard
- Navigate to Profile → "Admin Panel"
- View on web browser for full experience
- Explore different admin sections

### Push Notifications
- Navigate to Admin → "Push Notifications"
- Toggle notification templates
- Send test notifications
- Schedule custom notifications

---

## Support

For questions or issues:
- Superwall Documentation: https://superwall.com/docs
- Expo Notifications: https://docs.expo.dev/versions/latest/sdk/notifications/
- Supabase Documentation: https://supabase.com/docs

---

**Note:** This is a comprehensive implementation that provides the UI and structure for all requested features. The backend integration with Supabase and payment processing with Superwall will complete the functionality.
