
# Sentry Crash Reporting Integration

This module provides crash reporting and error tracking for the Intentional Dating App using Sentry.

## Features

- **Automatic Crash Reporting**: Captures unhandled exceptions and crashes
- **Error Boundary Integration**: Works with React Error Boundaries
- **Performance Monitoring**: Track app performance and slow operations
- **User Context**: Associate errors with specific users
- **Breadcrumb Tracking**: Track user actions leading up to errors
- **Independent Module**: Can be enabled/disabled without affecting other code

## Setup Instructions

### 1. Create a Sentry Account

1. Go to [https://sentry.io](https://sentry.io) and sign up
2. Create a new project and select "React Native"
3. Copy your DSN (Data Source Name) from the project settings

### 2. Install Sentry SDK

```bash
npm install @sentry/react-native
```

### 3. Configure Sentry

Edit `app/integrations/sentry/client.ts`:

```typescript
const SENTRY_ENABLED = true; // Enable Sentry
const SENTRY_DSN = 'your-dsn-here'; // Paste your DSN
```

Uncomment the Sentry initialization code in the `initializeSentry` function.

### 4. Initialize in Your App

Sentry is automatically initialized in `app/_layout.tsx`. No additional setup needed!

## Usage

### Automatic Error Capture

Errors are automatically captured when they occur. No additional code needed!

### Manual Error Capture

```typescript
import { captureException, captureMessage } from '@/app/integrations/sentry/client';

try {
  // Your code
} catch (error) {
  captureException(error as Error, { context: 'additional info' });
}

// Or capture a message
captureMessage('Something important happened', 'info');
```

### Set User Context

```typescript
import { setSentryUser, clearSentryUser } from '@/app/integrations/sentry/client';

// After user logs in
setSentryUser({
  id: user.id,
  email: user.email,
  username: user.name,
});

// On logout
clearSentryUser();
```

### Add Breadcrumbs

```typescript
import { addBreadcrumb } from '@/app/integrations/sentry/client';

addBreadcrumb({
  message: 'User clicked button',
  category: 'ui',
  level: 'info',
  data: { buttonId: 'submit' },
});
```

## Testing

To test that Sentry is working:

```typescript
import { captureException } from '@/app/integrations/sentry/client';

// Trigger a test error
captureException(new Error('Test error from Intentional Dating App'));
```

Check your Sentry dashboard to see if the error appears.

## Disabling Sentry

To disable Sentry (e.g., during development):

```typescript
const SENTRY_ENABLED = false;
```

## Best Practices

1. **Don't log sensitive data**: Avoid capturing passwords, tokens, or personal information
2. **Use breadcrumbs**: Add breadcrumbs for important user actions to help debug issues
3. **Set user context**: Always set user context after login for better error tracking
4. **Filter errors**: Use the `beforeSend` hook to filter out unwanted errors
5. **Monitor performance**: Use Sentry's performance monitoring to track slow operations

## Troubleshooting

### Errors not appearing in Sentry

1. Check that `SENTRY_ENABLED` is `true`
2. Verify your DSN is correct
3. Check your internet connection
4. Look for initialization errors in the console

### Too many errors

1. Adjust the `tracesSampleRate` to reduce the number of events sent
2. Use the `beforeSend` hook to filter out specific errors
3. Set up error grouping rules in Sentry dashboard

## Support

For more information, visit:
- [Sentry React Native Documentation](https://docs.sentry.io/platforms/react-native/)
- [Sentry Dashboard](https://sentry.io)
