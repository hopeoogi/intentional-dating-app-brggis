
import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      if (token) {
        setExpoPushToken(token);
      }
    });

    const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  const scheduleEngagementNotification = async (hours: number = 24) => {
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
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };

  const scheduleMessageNotification = async (matchName: string) => {
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
    } catch (error) {
      console.error('Error scheduling message notification:', error);
    }
  };

  return {
    expoPushToken,
    notification,
    scheduleEngagementNotification,
    scheduleMessageNotification,
  };
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6A5ACD',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  try {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    
    if (!projectId) {
      console.log('Project ID not found');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log('Push token:', token);
  } catch (e) {
    console.log('Error getting push token:', e);
  }

  return token;
}
