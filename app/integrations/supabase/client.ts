
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client - BUILD 162');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] URL:', SUPABASE_URL);
console.log('[Supabase] Using native fetch API (no axios)');

// ============================================================================
// BUILD 162 - OPTIMIZED SUPABASE CLIENT CONFIGURATION
// ============================================================================
// Key improvements:
// 1. Use fetch.bind(globalThis) for proper context binding
// 2. Remove wrapped fetch to reduce overhead
// 3. Async connection test that doesn't block startup
// 4. Enhanced error handling and logging
// ============================================================================

// Verify fetch is available
if (typeof fetch === 'undefined') {
  console.error('[Supabase] ❌ CRITICAL: fetch is not available!');
  throw new Error('fetch is not available - this should never happen in React Native');
}

console.log('[Supabase] ✅ Native fetch is available');
console.log('[Supabase] fetch type:', typeof fetch);

// Bind fetch to globalThis to ensure proper context
const boundFetch = fetch.bind(globalThis);
console.log('[Supabase] ✅ fetch bound to globalThis');

export const supabase = createClient<Database>(
  SUPABASE_URL, 
  SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
    global: {
      // Use bound fetch for proper context
      fetch: boundFetch,
      headers: {
        'X-Client-Info': `supabase-js-react-native/${Platform.OS}`,
        'X-Build-Version': '162',
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

console.log('[Supabase] ✅ Client initialized successfully');
console.log('[Supabase] Ready to handle requests with native fetch');

// ============================================================================
// BUILD 162: Async connection test (non-blocking)
// ============================================================================
// Test the connection asynchronously without blocking app startup
// This helps identify connection issues early without causing crashes
// ============================================================================

let connectionTestComplete = false;

setTimeout(() => {
  console.log('[Supabase] Running async connection test...');
  
  supabase.from('users').select('count', { count: 'exact', head: true })
    .then(({ error, count }) => {
      connectionTestComplete = true;
      if (error) {
        console.error('[Supabase] ❌ Connection test failed:', error.message);
        console.error('[Supabase] Error details:', error);
      } else {
        console.log('[Supabase] ✅ Connection test successful');
        console.log('[Supabase] Users count:', count);
      }
    })
    .catch((error) => {
      connectionTestComplete = true;
      console.error('[Supabase] ❌ Connection test error:', error);
    });
}, 1000); // Run after 1 second to avoid blocking startup

// Export connection test status for debugging
export const isConnectionTestComplete = () => connectionTestComplete;
