
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('='.repeat(80));
console.log('[Supabase] Initializing client - BUILD 143');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] URL:', SUPABASE_URL);
console.log('[Supabase] Has API Key:', !!SUPABASE_PUBLISHABLE_KEY);
console.log('[Supabase] Global fetch available:', typeof fetch !== 'undefined');
console.log('[Supabase] Global URL available:', typeof URL !== 'undefined');
console.log('='.repeat(80));

// ============================================================================
// STABLE SUPABASE CLIENT CONFIGURATION - UPDATE 136 APPROACH
// ============================================================================
// This configuration uses the proven stable approach from Update 136:
// 1. Import URL polyfill FIRST (critical for React Native)
// 2. Use fetch.bind(globalThis) - direct binding to native fetch
// 3. NO custom fetch wrappers or interceptors
// 4. NO axios or adapter-based HTTP clients
// 5. Minimal configuration = fewer failure points
//
// The fetch.bind(globalThis) approach ensures that:
// - We're using the native fetch implementation
// - The 'this' context is properly bound
// - No adapter detection logic is triggered
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
      // CRITICAL: Use native fetch directly with proper binding
      // This is the key to eliminating adapter errors
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

console.log('='.repeat(80));
console.log('[Supabase] Client initialized successfully');
console.log('[Supabase] Client object:', !!supabase);
console.log('[Supabase] Auth available:', !!supabase.auth);
console.log('[Supabase] From available:', !!supabase.from);
console.log('='.repeat(80));

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
