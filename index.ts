
// CRITICAL: Import URL polyfill FIRST before anything else
// This must be the very first import to ensure URL parsing works correctly
// in React Native environment for Supabase and other libraries
import 'react-native-url-polyfill/auto';

// Now import expo-router entry point
import 'expo-router/entry';
