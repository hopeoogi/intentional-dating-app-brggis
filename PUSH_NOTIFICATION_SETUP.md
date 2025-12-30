
# Push Notification Setup Guide

This guide will help you set up push notifications for the Intentional dating app on both iOS (APNs) and Android (FCM).

## Prerequisites

- Expo account
- Apple Developer account (for iOS)
- Google Cloud Platform account (for Android)
- Supabase project

## iOS Setup (Apple Push Notification service - APNs)

### Step 1: Create APNs Key

1. Go to [Apple Developer Portal](https://developer.apple.com/account/)
2. Navigate to **Certificates, Identifiers & Profiles**
3. Click on **Keys** in the sidebar
4. Click the **+** button to create a new key
5. Give it a name (e.g., "Intentional Push Notifications")
6. Check **Apple Push Notifications service (APNs)**
7. Click **Continue** and then **Register**
8. Download the `.p8` key file (you can only download this once!)
9. Note your **Key ID** and **Team ID**

### Step 2: Configure in Expo

```bash
# Install EAS CLI if you haven't already
npm install -g eas-cli

# Login to Expo
eas login

# Configure push notifications
eas credentials
```

Select your project, then:
1. Choose **iOS**
2. Select **Push Notifications**
3. Upload your `.p8` key file
4. Enter your Key ID
5. Enter your Team ID

### Step 3: Update app.json

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.intentional.dating",
      "supportsTablet": true,
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "notification": {
      "icon": "./assets/images/notification-icon.png",
      "color": "#007AFF",
      "iosDisplayInForeground": true
    }
  }
}
```

## Android Setup (Firebase Cloud Messaging - FCM)

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **Add project**
3. Enter project name: "Intentional Dating"
4. Follow the setup wizard
5. Once created, click on the Android icon to add an Android app

### Step 2: Register Android App

1. Enter your package name: `com.intentional.dating`
2. Enter app nickname: "Intentional"
3. Download `google-services.json`
4. Place it in your project root

### Step 3: Enable Cloud Messaging API

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Go to **Cloud Messaging** tab
3. Note your **Server Key** and **Sender ID**
4. Go to [Google Cloud Console](https://console.cloud.google.com/)
5. Select your Firebase project
6. Navigate to **APIs & Services** > **Library**
7. Search for "Firebase Cloud Messaging API"
8. Click **Enable**

### Step 4: Configure in Expo

```bash
# Configure push notifications for Android
eas credentials
```

Select your project, then:
1. Choose **Android**
2. Select **Push Notifications**
3. Enter your FCM Server Key

### Step 5: Update app.json

```json
{
  "expo": {
    "android": {
      "package": "com.intentional.dating",
      "googleServicesFile": "./google-services.json",
      "permissions": [
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ]
    },
    "notification": {
      "icon": "./assets/images/notification-icon.png",
      "color": "#007AFF",
      "androidMode": "default",
      "androidCollapsedTitle": "#{unread_notifications} new notifications"
    }
  }
}
```

## Expo Push Notification Setup

### Step 1: Request Permissions

The app already includes permission handling in `hooks/useNotifications.ts`:

```typescript
import * as Notifications from 'expo-notifications';
import { useEffect, useState } from 'react';

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState('');

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        setExpoPushToken(token);
        // Save token to Supabase
        saveTokenToDatabase(token);
      }
    });
  }, []);

  return { expoPushToken };
}

async function registerForPushNotificationsAsync() {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}
```

### Step 2: Store Push Tokens

Add a `push_tokens` table to Supabase:

```sql
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('ios', 'android', 'web')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Enable RLS
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;

-- Users can manage their own tokens
CREATE POLICY "Users can manage their own push tokens"
  ON push_tokens FOR ALL
  USING (user_id = auth.uid());

-- Admins can view all tokens
CREATE POLICY "Admins can view all push tokens"
  ON push_tokens FOR SELECT
  USING (is_admin());
```

### Step 3: Create Notification Sending Edge Function

Create a Supabase Edge Function to send notifications:

```typescript
// supabase/functions/send-push-notification/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send'

serve(async (req) => {
  try {
    const { tokens, title, body, data } = await req.json()

    const messages = tokens.map((token: string) => ({
      to: token,
      sound: 'default',
      title,
      body,
      data,
    }))

    const response = await fetch(EXPO_PUSH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messages),
    })

    const result = await response.json()

    return new Response(JSON.stringify(result), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

Deploy the function:

```bash
supabase functions deploy send-push-notification
```

## Testing Push Notifications

### Test on iOS Simulator

Note: Push notifications don't work on iOS Simulator. You must test on a physical device.

### Test on Android Emulator

Android emulators support push notifications if they have Google Play Services.

### Test with Expo Go

1. Install Expo Go on your device
2. Scan the QR code from `expo start`
3. Grant notification permissions when prompted
4. Use the admin panel to send a test notification

### Test with Development Build

For production-like testing:

```bash
# Build development client
eas build --profile development --platform ios
eas build --profile development --platform android

# Install on device and test
```

## Notification Categories

The app uses these notification categories:

- **new_match** - When users get a new match
- **new_message** - When users receive a message
- **conversation_expiring** - Reminder to respond
- **daily_reminder** - Daily engagement notification
- **promotional** - Marketing campaigns
- **system** - System announcements

## Notification Handling

### Foreground Notifications

```typescript
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

### Background Notifications

```typescript
Notifications.addNotificationResponseReceivedListener(response => {
  const data = response.notification.request.content.data;
  
  // Handle navigation based on notification type
  if (data.type === 'new_message') {
    router.push(`/chat?matchId=${data.matchId}`);
  } else if (data.type === 'new_match') {
    router.push('/matches');
  }
});
```

## Best Practices

### 1. Respect User Preferences

Always check if user has notifications enabled:

```typescript
const { data: user } = await supabase
  .from('users')
  .select('push_notifications_enabled')
  .eq('id', userId)
  .single();

if (user.push_notifications_enabled) {
  // Send notification
}
```

### 2. Rate Limiting

Don't spam users with notifications:

- Max 3 notifications per hour per user
- Batch similar notifications
- Use quiet hours (11 PM - 8 AM local time)

### 3. Personalization

Make notifications relevant:

```typescript
const title = `New message from ${senderName}`;
const body = messagePreview.substring(0, 100);
```

### 4. Deep Linking

Always include navigation data:

```typescript
const data = {
  type: 'new_message',
  matchId: match.id,
  senderId: sender.id,
};
```

### 5. Analytics

Track notification performance:

- Delivery rate
- Open rate
- Conversion rate
- Opt-out rate

## Troubleshooting

### iOS Issues

**Problem:** Notifications not received on iOS
**Solution:**
- Ensure you're testing on a physical device
- Check that APNs key is correctly configured
- Verify bundle identifier matches
- Check notification permissions in Settings

**Problem:** Notifications work in development but not production
**Solution:**
- Ensure you're using production APNs certificate
- Check that app is signed with correct provisioning profile

### Android Issues

**Problem:** Notifications not received on Android
**Solution:**
- Ensure FCM is enabled in Firebase Console
- Check that google-services.json is in project root
- Verify package name matches
- Check notification permissions

**Problem:** Notifications delayed
**Solution:**
- Check device battery optimization settings
- Ensure app is not in Doze mode
- Use high priority for time-sensitive notifications

### General Issues

**Problem:** Push tokens not saving
**Solution:**
- Check Supabase RLS policies
- Verify user is authenticated
- Check network connectivity

**Problem:** Notifications sent but not received
**Solution:**
- Check Expo push receipt for errors
- Verify token is valid
- Check device notification settings

## Production Checklist

Before launching:

- [ ] APNs key configured and tested
- [ ] FCM configured and tested
- [ ] Push tokens stored in database
- [ ] Edge function deployed
- [ ] Notification templates created
- [ ] Rate limiting implemented
- [ ] Analytics tracking set up
- [ ] User preferences respected
- [ ] Deep linking working
- [ ] Tested on physical devices (iOS & Android)
- [ ] Quiet hours implemented
- [ ] Unsubscribe mechanism working
- [ ] Notification icons created
- [ ] Sound files added (if custom)

## Resources

- [Expo Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

## Support

For issues or questions:
- Check Expo forums
- Review Supabase documentation
- Contact development team

---

**Last Updated:** December 2024
**Version:** 1.0
