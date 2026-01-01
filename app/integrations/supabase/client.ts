
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('[Supabase] Initializing client - BUILD 144 REBUILD');
console.log('[Supabase] Platform:', Platform.OS);
console.log('[Supabase] Using native fetch API');

// ============================================================================
// REBUILD 144 - SIMPLIFIED SUPABASE CLIENT
// ============================================================================
// This is the absolute simplest, most stable Supabase configuration:
// 1. Import URL polyfill FIRST (already done at top of file)
// 2. Use native fetch directly - no custom wrappers
// 3. Minimal configuration - only what's necessary
// 4. Let Supabase handle everything else
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
      // Use native fetch - this is the key to avoiding adapter errors
      fetch: fetch,
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
