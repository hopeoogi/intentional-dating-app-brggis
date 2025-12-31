
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client...');
console.log('[Supabase] URL:', SUPABASE_URL);
console.log('[Supabase] Platform:', Platform.OS);

// Create a safe storage adapter that works on all platforms with proper error handling
const createStorageAdapter = () => {
  // On web, use localStorage if available
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    console.log('[Supabase] Using localStorage for web');
    return {
      getItem: async (key: string) => {
        try {
          return window.localStorage.getItem(key);
        } catch (error) {
          console.error('[Supabase] Error getting item from localStorage:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
        } catch (error) {
          console.error('[Supabase] Error setting item in localStorage:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.error('[Supabase] Error removing item from localStorage:', error);
        }
      },
    };
  }
  
  // On native platforms, use AsyncStorage with error handling
  console.log('[Supabase] Using AsyncStorage for native');
  return {
    getItem: async (key: string) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.error('[Supabase] Error getting item from AsyncStorage:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.error('[Supabase] Error setting item in AsyncStorage:', error);
      }
    },
    removeItem: async (key: string) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error('[Supabase] Error removing item from AsyncStorage:', error);
      }
    },
  };
};

// Initialize Supabase client with safe defaults
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

try {
  supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      storage: createStorageAdapter(),
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: Platform.OS === 'web',
      flowType: 'pkce',
    },
    global: {
      headers: {
        'X-Client-Info': `intentional-dating-app/${Platform.OS}`,
      },
    },
  });
  console.log('[Supabase] Client initialized successfully');
} catch (error) {
  console.error('[Supabase] Failed to initialize client:', error);
  // Create a fallback client that won't crash the app
  supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export const supabase = supabaseClient!;

// Test the connection asynchronously without blocking app startup
// Only run this after a delay to ensure app has fully loaded
if (Platform.OS !== 'web') {
  setTimeout(() => {
    supabase
      .from('users')
      .select('count')
      .limit(1)
      .then(({ data, error }) => {
        if (error) {
          console.error('[Supabase] Connection test failed:', error.message);
        } else {
          console.log('[Supabase] Connection test successful');
        }
      })
      .catch((err) => {
        console.error('[Supabase] Connection test error:', err);
      });
  }, 3000);
}
