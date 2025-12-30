
import { useEffect } from 'react';
import * as ScreenCapture from 'expo-screen-capture';
import { Platform } from 'react-native';

export function useScreenCapture(enabled: boolean = true) {
  useEffect(() => {
    let isActive = true;

    const activateScreenProtection = async () => {
      if (!enabled || !isActive) {
        console.log('Screen capture protection not enabled');
        return;
      }

      try {
        const isAvailable = await ScreenCapture.isAvailableAsync();
        
        if (isAvailable) {
          await ScreenCapture.preventScreenCaptureAsync();
          console.log('Screen capture protection activated');
          
          if (Platform.OS === 'ios') {
            await ScreenCapture.enableAppSwitcherProtectionAsync(10);
            console.log('App switcher protection enabled');
          }
        }
      } catch (error) {
        console.error('Error activating screen protection:', error);
      }
    };

    activateScreenProtection();

    return () => {
      isActive = false;
      
      if (enabled) {
        ScreenCapture.allowScreenCaptureAsync().catch((error) => {
          console.error('Error deactivating screen protection:', error);
        });
        
        if (Platform.OS === 'ios') {
          ScreenCapture.disableAppSwitcherProtectionAsync().catch((error) => {
            console.error('Error disabling app switcher protection:', error);
          });
        }
      }
    };
  }, [enabled]);
}
