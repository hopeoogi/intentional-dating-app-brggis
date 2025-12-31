
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const SUPABASE_URL = "https://plnfluykallohjimxnja.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbmZsdXlrYWxsb2hqaW14bmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDkzNjcsImV4cCI6MjA4MjY4NTM2N30.Hsj2brvHemnDV9w-b0wbdLyaBclteRj3gNW8jDhzCk0";

console.log('Initializing Supabase client...');
console.log('Supabase URL:', SUPABASE_URL);
console.log('Platform:', Platform.OS);

// Create a safe storage adapter that works on all platforms
const createStorageAdapter = () => {
  // On web, use localStorage if available
  if (Platform.OS === 'web' && typeof window !== 'undefined' && window.localStorage) {
    console.log('Using localStorage for web');
    return {
      getItem: async (key: string) => {
        try {
          return window.localStorage.getItem(key);
        } catch (error) {
          console.error('Error getting item from localStorage:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
        } catch (error) {
          console.error('Error setting item in localStorage:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          window.localStorage.removeItem(key);
        } catch (error) {
          console.error('Error removing item from localStorage:', error);
        }
      },
    };
  }
  
  // On native platforms, use AsyncStorage
  console.log('Using AsyncStorage for native');
  return AsyncStorage;
};

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export const getSupabaseClient = () => {
  if (!supabaseClient) {
    try {
      supabaseClient = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
        auth: {
          storage: createStorageAdapter(),
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: Platform.OS === 'web',
        },
      });
      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      throw error;
    }
  }
  return supabaseClient;
};

export const supabase = getSupabaseClient();

// Test the connection asynchronously (don't block initialization)
setTimeout(() => {
  supabase
    .from('users')
    .select('count')
    .then(({ data, error }) => {
      if (error) {
        console.error('Supabase connection test failed:', error);
      } else {
        console.log('Supabase connection test successful');
      }
    })
    .catch((err) => {
      console.error('Supabase connection test error:', err);
    });
}, 1000);
