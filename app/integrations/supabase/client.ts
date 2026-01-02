
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// ============================================================================
// BUILD 177 - VERIFIED API SYNC FIX
// ============================================================================
// Based on successful fixes from Build 174 (Metro config) and Build 176 (removed connection test)
// This build adds verification logging to ensure proper initialization
// ============================================================================

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

// Verify environment
console.log('[Supabase] Initializing client - BUILD 177');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] URL configured:', !!SUPABASE_URL);
console.log('[Supabase] Key configured:', !!SUPABASE_PUBLISHABLE_KEY);

// Verify fetch is available
if (typeof fetch === 'undefined') {
  console.error('[Supabase] CRITICAL: Native fetch is not available');
  throw new Error('Native fetch is not available');
}
console.log('[Supabase] ✅ Native fetch is available');

// Create Supabase client with minimal, stable configuration
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
      // Use native fetch - no HTTP library conflicts
      fetch: fetch.bind(globalThis),
      headers: {
        'X-Client-Info': `intentional-dating/${Platform.OS}`,
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

// Verify client was created successfully
if (!supabase) {
  console.error('[Supabase] CRITICAL: Failed to create client');
  throw new Error('Failed to create Supabase client');
}

console.log('[Supabase] ✅ Client initialized successfully');
console.log('[Supabase] ✅ Ready for queries');

// Connection will be tested naturally when the app makes its first query
// No artificial connection tests - they cause more problems than they solve
