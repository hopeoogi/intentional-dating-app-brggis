
import { useEffect } from 'react';

// Note: Screen capture protection has been removed to ensure stable builds
// This hook is kept for future implementation
export function useScreenCapture(enabled: boolean = true) {
  useEffect(() => {
    if (enabled) {
      console.log('[ScreenCapture] Screen capture protection disabled for stable builds');
    }
  }, [enabled]);
}
