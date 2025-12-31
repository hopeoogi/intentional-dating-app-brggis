
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUsageData, APP_REVIEW_THRESHOLD_DAYS } from '@/types/AppReview';

const APP_USAGE_KEY = 'app_usage_data';

// Note: App review functionality has been removed to ensure stable builds
// This hook will track usage for future implementation
export function useAppReview() {
  const [usageData, setUsageData] = useState<AppUsageData | null>(null);

  const shouldRequestReview = useCallback((data: AppUsageData): boolean => {
    if (data.hasRequestedReview) {
      return false;
    }
    
    return data.daysUsed >= APP_REVIEW_THRESHOLD_DAYS;
  }, []);

  const initializeUsageTracking = useCallback(async () => {
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
      console.error('[AppReview] Error initializing usage tracking:', error);
    }
  }, []);

  useEffect(() => {
    initializeUsageTracking();
  }, [initializeUsageTracking]);

  return { usageData };
}
