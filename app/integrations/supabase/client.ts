
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client...');
console.log('[Supabase] Platform:', Platform.OS);

// Create a safe storage adapter that works on all platforms
const createStorageAdapter = () => {
  // On web, use localStorage if available
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    console.log('[Supabase] Using localStorage for web');
    return {
      getItem: async (key: string) => {
        try {
          return window.localStorage.getItem(key);
        } catch (error) {
          console.error('[Supabase] localStorage getItem error:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
        } catch (error) {
          console.error('[Supabase] localStorage setItem error:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.error('[Supabase] localStorage removeItem error:', error);
        }
      },
    };
  }
  
  // On native platforms, use AsyncStorage
  console.log('[Supabase] Using AsyncStorage for native');
  return {
    getItem: async (key: string) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (error) {
        console.error('[Supabase] AsyncStorage getItem error:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (error) {
        console.error('[Supabase] AsyncStorage setItem error:', error);
      }
    },
    removeItem: async (key: string) => {
      try {
        await AsyncStorage.removeItem(key);
      } catch (error) {
        console.error('[Supabase] AsyncStorage removeItem error:', error);
      }
    },
  };
};

// Initialize Supabase client
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
        'X-Client-Info': `intentional-dating/${Platform.OS}`,
      },
    },
  });
  console.log('[Supabase] Client initialized successfully');
} catch (error) {
  console.error('[Supabase] Failed to initialize client:', error);
  // Create a fallback client
  supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

export const supabase = supabaseClient!;

// Test connection after app loads
if (Platform.OS !== 'web') {
  setTimeout(() => {
    supabase
      .from('users')
      .select('count')
      .limit(1)
      .then(({ error }) => {
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
