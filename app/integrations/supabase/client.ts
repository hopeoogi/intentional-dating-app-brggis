
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// ============================================================================
// BUILD 170 - COMPREHENSIVE API SYNC FIX
// ============================================================================
// Hardcoded credentials for production builds (no env vars needed)
// This ensures the app works in TestFlight without environment variable issues
// Edge Functions now have comprehensive CORS headers and error handling
// ============================================================================

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client - BUILD 170');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] URL:', SUPABASE_URL);
console.log('[Supabase] Using native fetch API');

// Verify fetch is available
if (typeof fetch === 'undefined') {
  console.error('[Supabase] ❌ CRITICAL: fetch is not available!');
  throw new Error('fetch is not available - this should never happen in React Native');
}

console.log('[Supabase] ✅ Native fetch is available');

// Create Supabase client with optimized configuration
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
      fetch: fetch.bind(globalThis),
      headers: {
        'X-Client-Info': `supabase-js-react-native/${Platform.OS}`,
        'X-Build-Version': '170',
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

// Test connection asynchronously (non-blocking)
setTimeout(() => {
  console.log('[Supabase] Testing connection...');
  
  supabase.from('users').select('count', { count: 'exact', head: true })
    .then(({ error, count }) => {
      if (error) {
        console.error('[Supabase] ❌ Connection test failed:', error.message);
      } else {
        console.log('[Supabase] ✅ Connection test successful');
        console.log('[Supabase] Database is reachable');
      }
    })
    .catch((error) => {
      console.error('[Supabase] ❌ Connection test error:', error);
    });
}, 2000);
