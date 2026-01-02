
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// ============================================================================
// BUILD 175 - FIXED SUPABASE QUERY ERROR
// ============================================================================
// Simplified Supabase client configuration
// Native fetch is enforced - no HTTP library conflicts
// Fixed silent connection test - Supabase queries return objects, not Promises
// ============================================================================

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

// Verify fetch is available
if (typeof fetch === 'undefined') {
  throw new Error('Native fetch is not available');
}

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

// Silent connection test (non-blocking, no console spam)
// Supabase queries return objects, not Promises - must await them
setTimeout(async () => {
  try {
    await supabase.from('users').select('count', { count: 'exact', head: true });
  } catch (error) {
    // Silent error handling - connection test only
  }
}, 2000);
