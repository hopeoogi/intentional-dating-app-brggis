
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppUsageData, APP_REVIEW_THRESHOLD_DAYS } from '@/types/AppReview';

const APP_USAGE_KEY = 'app_usage_data';

// Note: expo-store-review has been temporarily disabled due to build issues
// This hook will track usage but not request reviews until the package is fixed
export function useAppReview() {
  const [usageData, setUsageData] = useState<AppUsageData | null>(null);

  const shouldRequestReview = useCallback((data: AppUsageData): boolean => {
    if (data.hasRequestedReview) {
      return false;
    }
    
    return data.daysUsed >= APP_REVIEW_THRESHOLD_DAYS;
  }, []);

  const requestReview = useCallback(async () => {
    try {
      // expo-store-review functionality disabled due to build issues
      console.log('App review would be requested here (expo-store-review disabled)');
      
      setUsageData((prevData) => {
        if (prevData) {
          const updatedData: AppUsageData = {
            ...prevData,
            hasRequestedReview: true,
            lastReviewRequestDate: new Date(),
          };
          AsyncStorage.setItem(APP_USAGE_KEY, JSON.stringify(updatedData)).catch((error) => {
            console.error('Error saving usage data:', error);
          });
          return updatedData;
        }
        return prevData;
      });
    } catch (error) {
      console.error('Error requesting review:', error);
    }
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
      console.error('Error initializing usage tracking:', error);
    }
  }, []);

  useEffect(() => {
    initializeUsageTracking();
  }, [initializeUsageTracking]);

  useEffect(() => {
    if (usageData && shouldRequestReview(usageData)) {
      // Disabled until expo-store-review build issues are resolved
      console.log('Review request criteria met but expo-store-review is disabled');
      // requestReview();
    }
  }, [usageData, shouldRequestReview]);

  return { usageData };
}
