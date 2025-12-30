
import { useEffect, useState } from 'react';
import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUsageData, APP_REVIEW_THRESHOLD_DAYS } from '@/types/AppReview';

const APP_USAGE_KEY = 'app_usage_data';

export function useAppReview() {
  const [usageData, setUsageData] = useState<AppUsageData | null>(null);

  useEffect(() => {
    initializeUsageTracking();
  }, []);

  useEffect(() => {
    if (usageData && shouldRequestReview(usageData)) {
      requestReview();
    }
  }, [usageData]);

  const initializeUsageTracking = async () => {
    try {
      const storedData = await AsyncStorage.getItem(APP_USAGE_KEY);
      
      if (storedData) {
        const data: AppUsageData = JSON.parse(storedData);
        data.firstOpenDate = new Date(data.firstOpenDate);
        if (data.lastReviewRequestDate) {
          data.lastReviewRequestDate = new Date(data.lastReviewRequestDate);
        }
        
        const today = new Date().toDateString();
        const lastOpen = new Date(data.firstOpenDate).toDateString();
        
        if (today !== lastOpen) {
          data.daysUsed += 1;
          await AsyncStorage.setItem(APP_USAGE_KEY, JSON.stringify(data));
        }
        
        setUsageData(data);
      } else {
        const newData: AppUsageData = {
          firstOpenDate: new Date(),
          daysUsed: 1,
          hasRequestedReview: false,
        };
        await AsyncStorage.setItem(APP_USAGE_KEY, JSON.stringify(newData));
        setUsageData(newData);
      }
    } catch (error) {
      console.error('Error initializing usage tracking:', error);
    }
  };

  const shouldRequestReview = (data: AppUsageData): boolean => {
    if (data.hasRequestedReview) {
      return false;
    }
    
    return data.daysUsed >= APP_REVIEW_THRESHOLD_DAYS;
  };

  const requestReview = async () => {
    try {
      const hasAction = await StoreReview.hasAction();
      
      if (hasAction) {
        await StoreReview.requestReview();
        
        if (usageData) {
          const updatedData: AppUsageData = {
            ...usageData,
            hasRequestedReview: true,
            lastReviewRequestDate: new Date(),
          };
          await AsyncStorage.setItem(APP_USAGE_KEY, JSON.stringify(updatedData));
          setUsageData(updatedData);
        }
      }
    } catch (error) {
      console.error('Error requesting review:', error);
    }
  };

  return { usageData };
}
