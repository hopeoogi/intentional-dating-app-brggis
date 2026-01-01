
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client - UPDATE 136 STABLE VERSION');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] Using native fetch with proper binding');

// ============================================================================
// STABLE SUPABASE CLIENT - UPDATE 136 CONFIGURATION
// ============================================================================
// This is the proven stable configuration that eliminates adapter errors:
// 1. Import URL polyfill FIRST
// 2. Use fetch.bind(globalThis) - direct binding to native fetch
// 3. NO custom fetch wrappers
// 4. NO axios or adapter-based HTTP clients
// 5. Minimal configuration
// ============================================================================

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
      // CRITICAL: Use native fetch directly with proper binding
      fetch: fetch.bind(globalThis),
      headers: {
        'X-Client-Info': `supabase-js-react-native/${Platform.OS}`,
      },
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

console.log('[Supabase] Client initialized successfully');
