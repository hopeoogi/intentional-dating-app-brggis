
/**
 * Sentry Crash Reporting Integration
 * 
 * This module provides crash reporting and error tracking for the Intentional Dating App.
 * It's designed to be independent from the rest of the codebase and can be easily
 * enabled/disabled without affecting other functionality.
 * 
 * Features:
 * - Automatic crash reporting
 * - Error boundary integration
 * - Performance monitoring
 * - User context tracking
 * - Breadcrumb tracking
 * 
 * To enable Sentry:
 * 1. Sign up at https://sentry.io
 * 2. Create a new React Native project
 * 3. Get your DSN from the project settings
 * 4. Set SENTRY_DSN in your environment or replace the placeholder below
 * 5. Install dependencies: npm install @sentry/react-native
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Configuration
const SENTRY_ENABLED = false; // Set to true when you have a Sentry DSN
const SENTRY_DSN = ''; // Replace with your Sentry DSN from https://sentry.io

// Sentry client instance (will be initialized if enabled)
let Sentry: any = null;

/**
 * Initialize Sentry crash reporting
 * This should be called as early as possible in the app lifecycle
 */
export const initializeSentry = async () => {
  if (!SENTRY_ENABLED || !SENTRY_DSN) {
    console.log('[Sentry] Crash reporting is disabled. Set SENTRY_ENABLED=true and provide SENTRY_DSN to enable.');
    return;
  }

  try {
    // Dynamically import Sentry to avoid bundling if not needed
    // Note: You'll need to install @sentry/react-native first
    // npm install @sentry/react-native
    
    // Uncomment when Sentry is installed:
    // const SentryModule = await import('@sentry/react-native');
    // Sentry = SentryModule.default;

    // Sentry.init({
    //   dsn: SENTRY_DSN,
    //   environment: __DEV__ ? 'development' : 'production',
    //   enableAutoSessionTracking: true,
    //   sessionTrackingIntervalMillis: 30000,
    //   tracesSampleRate: 1.0,
    //   enableNative: true,
    //   enableNativeCrashHandling: true,
    //   attachStacktrace: true,
    //   debug: __DEV__,
    //   beforeSend(event, hint) {
    //     // Filter out errors in development if desired
    //     if (__DEV__) {
    //       console.log('[Sentry] Captured error:', event);
    //     }
    //     return event;
    //   },
    //   integrations: [
    //     // Add any custom integrations here
    //   ],
    // });

    // Set app context
    // Sentry.setContext('app', {
    //   name: Constants.expoConfig?.name || 'Intentional Dating',
    //   version: Constants.expoConfig?.version || '1.0.0',
    //   buildNumber: Platform.select({
    //     ios: Constants.expoConfig?.ios?.buildNumber,
    //     android: Constants.expoConfig?.android?.versionCode,
    //   }),
    //   platform: Platform.OS,
    // });

    console.log('[Sentry] Crash reporting initialized successfully');
  } catch (error) {
    console.error('[Sentry] Failed to initialize crash reporting:', error);
  }
};

/**
 * Set user context for crash reports
 * Call this after user logs in
 */
export const setSentryUser = (user: { id: string; email?: string; username?: string }) => {
  if (!SENTRY_ENABLED || !Sentry) return;

  try {
    // Sentry.setUser({
    //   id: user.id,
    //   email: user.email,
    //   username: user.username,
    // });
    console.log('[Sentry] User context set:', user.id);
  } catch (error) {
    console.error('[Sentry] Failed to set user context:', error);
  }
};

/**
 * Clear user context (call on logout)
 */
export const clearSentryUser = () => {
  if (!SENTRY_ENABLED || !Sentry) return;

  try {
    // Sentry.setUser(null);
    console.log('[Sentry] User context cleared');
  } catch (error) {
    console.error('[Sentry] Failed to clear user context:', error);
  }
};

/**
 * Manually capture an exception
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (!SENTRY_ENABLED || !Sentry) {
    console.error('[Sentry] Exception (not sent - Sentry disabled):', error, context);
    return;
  }

  try {
    // if (context) {
    //   Sentry.setContext('custom', context);
    // }
    // Sentry.captureException(error);
    console.log('[Sentry] Exception captured:', error.message);
  } catch (err) {
    console.error('[Sentry] Failed to capture exception:', err);
  }
};

/**
 * Manually capture a message
 */
export const captureMessage = (message: string, level: 'info' | 'warning' | 'error' = 'info') => {
  if (!SENTRY_ENABLED || !Sentry) {
    console.log(`[Sentry] Message (not sent - Sentry disabled) [${level}]:`, message);
    return;
  }

  try {
    // Sentry.captureMessage(message, level);
    console.log(`[Sentry] Message captured [${level}]:`, message);
  } catch (error) {
    console.error('[Sentry] Failed to capture message:', error);
  }
};

/**
 * Add a breadcrumb for debugging
 */
export const addBreadcrumb = (breadcrumb: {
  message: string;
  category?: string;
  level?: 'info' | 'warning' | 'error';
  data?: Record<string, any>;
}) => {
  if (!SENTRY_ENABLED || !Sentry) return;

  try {
    // Sentry.addBreadcrumb(breadcrumb);
  } catch (error) {
    console.error('[Sentry] Failed to add breadcrumb:', error);
  }
};

/**
 * Wrap a function to automatically capture errors
 */
export const wrapWithSentry = <T extends (...args: any[]) => any>(fn: T): T => {
  if (!SENTRY_ENABLED || !Sentry) return fn;

  return ((...args: any[]) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.catch((error) => {
          captureException(error);
          throw error;
        });
      }
      return result;
    } catch (error) {
      captureException(error as Error);
      throw error;
    }
  }) as T;
};

/**
 * Get the Sentry instance (for advanced usage)
 */
export const getSentry = () => Sentry;

/**
 * Check if Sentry is enabled and initialized
 */
export const isSentryEnabled = () => SENTRY_ENABLED && Sentry !== null;

// Export a default object with all functions
export default {
  initialize: initializeSentry,
  setUser: setSentryUser,
  clearUser: clearSentryUser,
  captureException,
  captureMessage,
  addBreadcrumb,
  wrap: wrapWithSentry,
  getSentry,
  isEnabled: isSentryEnabled,
};
