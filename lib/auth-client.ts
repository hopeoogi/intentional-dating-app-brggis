
import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';

// Get backend URL from app.json extra config or use Supabase URL as fallback
const backendUrl = Constants.expoConfig?.extra?.backendUrl || 'https://plnfluykallohjimxnja.supabase.co';

console.log('[Auth Client] Initializing BetterAuth with backend:', backendUrl);

export const authClient = createAuthClient({
  baseURL: backendUrl,
  plugins: [
    expoClient({
      scheme: 'natively',
      storagePrefix: 'intentional',
      storage: SecureStore,
    }),
  ],
});

console.log('[Auth Client] ✅ BetterAuth client initialized');
