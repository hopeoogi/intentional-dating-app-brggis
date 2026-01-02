
import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Get backend URL from app.json extra config
const API_URL = Constants.expoConfig?.extra?.backendUrl || '';
const BEARER_TOKEN_KEY = 'intentional_bearer_token';

console.log('[Auth Client] Initializing BetterAuth with backend:', API_URL);

// Platform-specific storage implementation
const createStorage = () => {
  if (Platform.OS === 'web') {
    return {
      get: async (key: string) => {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error('[Auth Client] Storage get error:', error);
          return null;
        }
      },
      set: async (key: string, value: string) => {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error('[Auth Client] Storage set error:', error);
        }
      },
      remove: async (key: string) => {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error('[Auth Client] Storage remove error:', error);
        }
      },
    };
  } else {
    return {
      get: async (key: string) => {
        try {
          return await SecureStore.getItemAsync(key);
        } catch (error) {
          console.error('[Auth Client] SecureStore get error:', error);
          return null;
        }
      },
      set: async (key: string, value: string) => {
        try {
          await SecureStore.setItemAsync(key, value);
        } catch (error) {
          console.error('[Auth Client] SecureStore set error:', error);
        }
      },
      remove: async (key: string) => {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch (error) {
          console.error('[Auth Client] SecureStore remove error:', error);
        }
      },
    };
  }
};

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    expoClient({
      scheme: 'intentional',
      storagePrefix: 'intentional',
      storage: createStorage(),
    }),
  ],
});

export function storeWebBearerToken(token: string) {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(BEARER_TOKEN_KEY, token);
    } catch (error) {
      console.error('[Auth Client] Failed to store bearer token:', error);
    }
  }
}

export function clearAuthTokens() {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(BEARER_TOKEN_KEY);
    } catch (error) {
      console.error('[Auth Client] Failed to clear bearer token:', error);
    }
  }
}

console.log('[Auth Client] ✅ BetterAuth client initialized');
