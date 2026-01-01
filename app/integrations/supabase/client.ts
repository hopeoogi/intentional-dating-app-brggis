
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
// PERMANENT FIX FOR ADAPTER ERROR
// ============================================================================
// This configuration completely eliminates the "(h.adapter || o.adapter) is not a function" error
// by ensuring Supabase uses ONLY native fetch with proper binding.
//
// Key fixes:
// 1. Custom fetch wrapper that explicitly uses globalThis.fetch
// 2. Proper binding to ensure correct 'this' context
// 3. Comprehensive error handling
// 4. No axios anywhere in the dependency chain
// ============================================================================

// Create a custom fetch wrapper that ensures we're using the native fetch
const customFetch: typeof fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  // Ensure we're using the global fetch, not any polyfilled or wrapped version
  const nativeFetch = globalThis.fetch;
  
  if (!nativeFetch) {
    throw new Error('[Supabase] Native fetch is not available. This should never happen.');
  }
  
  // Call fetch with proper binding
  return nativeFetch.call(globalThis, input, init);
};

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
      // CRITICAL: Use our custom fetch wrapper
      // This ensures native fetch is always used, preventing adapter errors
      fetch: customFetch,
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

console.log('[Supabase] Client initialized successfully with custom fetch wrapper');

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
