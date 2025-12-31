
import { useEffect } from 'react';

export function useScreenCapture(enabled: boolean = true) {
  useEffect(() => {
    // Screen capture protection has been removed
    // This functionality requires expo-screen-capture which was causing build issues
    console.log('Screen capture protection is currently disabled');
  }, [enabled]);
}
