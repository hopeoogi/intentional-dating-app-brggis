
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client...');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] URL:', SUPABASE_URL);

// ============================================================================
// STABLE CONFIGURATION - REVERTED TO UPDATE 117 APPROACH
// ============================================================================
// This uses the simpler, more stable fetch binding approach that worked in
// Update 117. The custom fetch wrapper from Update 125 was causing issues
// in certain scenarios.
//
// Key approach:
// 1. Simple fetch.bind(globalThis) - proven stable
// 2. No custom wrapper complexity
// 3. Direct binding to native fetch
// 4. Minimal abstraction = fewer failure points
// ============================================================================

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
      // STABLE: Use simple fetch binding (Update 117 approach)
      // This is more reliable than custom wrappers
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
if (__DEV__) {
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
