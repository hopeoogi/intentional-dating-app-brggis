
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// ============================================================================
// BUILD 172 - WORKING EDGE FUNCTION PATTERN
// ============================================================================
// Simplified Edge Functions based on proven working examples from knowledge base
// 
// KEY FIXES:
// 1. Simplified Edge Functions - removed verbose logging
// 2. Used proven working pattern from knowledge base
// 3. Proper CORS headers on all responses
// 4. Consistent error handling
// 5. No unnecessary complexity
// ============================================================================

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client - BUILD 172');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] Using native fetch API');

// Verify fetch is available
if (typeof fetch === 'undefined') {
  console.error('[Supabase] ❌ CRITICAL: fetch is not available!');
  throw new Error('fetch is not available');
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
        'X-Build-Version': '172',
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
    .then(({ error }) => {
      if (error) {
        console.error('[Supabase] ❌ Connection test failed:', error.message);
      } else {
        console.log('[Supabase] ✅ Connection test successful');
      }
    })
    .catch((error) => {
      console.error('[Supabase] ❌ Connection test error:', error);
    });
}, 2000);
