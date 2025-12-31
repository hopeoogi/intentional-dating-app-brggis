
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Set notification handler with error handling
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  console.log('[Notifications] Handler set successfully');
} catch (error) {
  console.error('[Notifications] Error setting handler:', error);
}

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Skip push notification setup on web
    if (Platform.OS === 'web') {
      console.log('[Notifications] Push notifications are not supported on web');
      setIsInitialized(true);
      return;
    }

    // Wrap in try-catch to prevent crashes
    const setupNotifications = async () => {
      try {
        console.log('[Notifications] Setting up notifications...');
        const token = await registerForPushNotificationsAsync();
        if (token) {
          setExpoPushToken(token);
          console.log('[Notifications] Push token obtained:', token.substring(0, 20) + '...');
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('[Notifications] Error setting up notifications:', error);
        setIsInitialized(true);
        // Don't crash the app, just continue without notifications
      }
    };

    setupNotifications();

    let notificationListener: Notifications.Subscription | undefined;
    let responseListener: Notifications.Subscription | undefined;

    try {
      notificationListener = Notifications.addNotificationReceivedListener((notification) => {
        console.log('[Notifications] Notification received:', notification.request.identifier);
        setNotification(notification);
      });

      responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('[Notifications] Notification response:', response.notification.request.identifier);
      });
    } catch (error) {
      console.error('[Notifications] Error adding listeners:', error);
    }

    return () => {
      try {
        notificationListener?.remove();
        responseListener?.remove();
      } catch (error) {
        console.error('[Notifications] Error removing listeners:', error);
      }
    };
  }, []);

  const scheduleEngagementNotification = async (hours: number = 24) => {
    // Skip on web
    if (Platform.OS === 'web') {
      console.log('[Notifications] Notifications not supported on web');
      return;
    }

    if (!isInitialized) {
      console.log('[Notifications] Not initialized yet, skipping schedule');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'New matches waiting! 💜',
          body: 'Check out your daily intentional connections',
          data: { type: 'engagement' },
        },
        trigger: {
          seconds: hours * 3600,
          repeats: true,
        },
      });
      console.log('[Notifications] Engagement notification scheduled');
    } catch (error) {
      console.error('[Notifications] Error scheduling notification:', error);
    }
  };

  const scheduleMessageNotification = async (matchName: string) => {
    // Skip on web
    if (Platform.OS === 'web') {
      console.log('[Notifications] Notifications not supported on web');
      return;
    }

    if (!isInitialized) {
      console.log('[Notifications] Not initialized yet, skipping schedule');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `${matchName} is waiting for your response`,
          body: 'Reply to keep the conversation going',
          data: { type: 'message' },
        },
        trigger: {
          seconds: 3600,
        },
      });
      console.log('[Notifications] Message notification scheduled for', matchName);
    } catch (error) {
      console.error('[Notifications] Error scheduling message notification:', error);
    }
  };

  return {
    expoPushToken,
    notification,
    scheduleEngagementNotification,
    scheduleMessageNotification,
    isInitialized,
  };
}

async function registerForPushNotificationsAsync() {
  // Skip on web
  if (Platform.OS === 'web') {
    return undefined;
  }

  try {
    console.log('[Notifications] Registering for push notifications...');
    
    let token;

    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6A5ACD',
        });
        console.log('[Notifications] Android notification channel created');
      } catch (error) {
        console.error('[Notifications] Error creating Android channel:', error);
      }
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    console.log('[Notifications] Existing permission status:', existingStatus);
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
      console.log('[Notifications] New permission status:', finalStatus);
    }
    
    if (finalStatus !== 'granted') {
      console.log('[Notifications] Permission not granted');
      return undefined;
    }

    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    
    if (!projectId) {
      console.log('[Notifications] Project ID not found');
      return undefined;
    }
    
    console.log('[Notifications] Getting push token with project ID:', projectId);
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('[Notifications] Push token obtained successfully');

    return token;
  } catch (e) {
    console.error('[Notifications] Error getting push token:', e);
    return undefined;
  }
}
