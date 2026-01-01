
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client - BUILD 161');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] URL:', SUPABASE_URL);
console.log('[Supabase] Using native fetch API (no axios)');

// ============================================================================
// BUILD 161 - FIXED SUPABASE CLIENT CONFIGURATION
// ============================================================================
// This configuration ensures we ONLY use native fetch and never axios
// We also add better error handling and remove the blocking connection test
// ============================================================================

// Verify fetch is available
if (typeof fetch === 'undefined') {
  console.error('[Supabase] ❌ CRITICAL: fetch is not available!');
  throw new Error('fetch is not available - this should never happen in React Native');
}

console.log('[Supabase] ✅ Native fetch is available');
console.log('[Supabase] fetch type:', typeof fetch);

// Create a wrapped fetch that logs all requests for debugging
const wrappedFetch = async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  const method = init?.method || 'GET';
  
  console.log(`[Supabase] 🌐 Fetch request: ${method} ${url}`);
  
  try {
    const response = await fetch(input, init);
    console.log(`[Supabase] ✅ Fetch response: ${response.status} ${url}`);
    return response;
  } catch (error) {
    console.error(`[Supabase] ❌ Fetch error: ${url}`, error);
    throw error;
  }
};

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
      // Use our wrapped fetch for better debugging
      fetch: wrappedFetch,
      headers: {
        'X-Client-Info': `supabase-js-react-native/${Platform.OS}`,
        'X-Build-Version': '161',
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
// BUILD 161 FIX: Remove blocking connection test
// ============================================================================
// The connection test was causing the intro screen to fail in TestFlight
// We now test the connection asynchronously without blocking app startup
// ============================================================================

// Test the connection asynchronously (non-blocking)
setTimeout(() => {
  console.log('[Supabase] Running async connection test...');
  supabase.from('users').select('count', { count: 'exact', head: true })
    .then(({ error, count }) => {
      if (error) {
        console.error('[Supabase] ❌ Connection test failed:', error.message);
      } else {
        console.log('[Supabase] ✅ Connection test successful, users count:', count);
      }
    })
    .catch((error) => {
      console.error('[Supabase] ❌ Connection test error:', error);
    });
}, 1000); // Run after 1 second to avoid blocking startup
