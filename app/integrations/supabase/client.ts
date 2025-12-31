
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client...');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] URL:', SUPABASE_URL);

// CRITICAL FIX: Simplified Supabase client initialization
// This configuration prevents the "(h.adapter || o.adapter) is not a function" error
// by using native fetch and minimal configuration
// NOTE: react-native-url-polyfill is imported in index.ts and app/_layout.tsx
export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      // Use AsyncStorage for session persistence
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      // Use PKCE flow for better security
      flowType: 'pkce',
    },
    global: {
      // CRITICAL: Use native fetch with bind to globalThis
      // This ensures the correct fetch implementation is used
      // and prevents adapter-related errors
      fetch: fetch.bind(globalThis),
      headers: {
        'X-Client-Info': `supabase-js-react-native/${Platform.OS}`,
      },
    },
    // Disable realtime by default to reduce bundle size
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

console.log('[Supabase] Client initialized successfully');

// Test the connection on initialization (dev only)
// Wrapped in try-catch to prevent crashes if Supabase is unreachable
if (__DEV__) {
  // Use setTimeout to avoid blocking app startup
  setTimeout(() => {
    supabase.auth.getSession()
      .then(({ data, error }) => {
        if (error) {
          console.log('[Supabase] Session check error:', error.message);
        } else {
          console.log('[Supabase] Session check successful:', data.session ? 'Logged in' : 'Not logged in');
        }
      })
      .catch((err) => {
        console.error('[Supabase] Session check failed:', err);
      });
  }, 1000);
}
