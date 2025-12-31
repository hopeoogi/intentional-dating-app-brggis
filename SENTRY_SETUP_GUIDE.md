
# Sentry Setup Guide for Intentional Dating App

This guide will help you set up Sentry crash reporting for the Intentional Dating App.

## Why Sentry?

Sentry provides:
- **Real-time crash reporting** - Know immediately when something breaks
- **Detailed stack traces** - See exactly where errors occur
- **User context** - Know which users are affected
- **Performance monitoring** - Track slow operations
- **Release tracking** - Compare error rates across versions

## Step-by-Step Setup

### 1. Create a Sentry Account

1. Go to [https://sentry.io](https://sentry.io)
2. Click "Get Started" or "Sign Up"
3. Choose the free plan (includes 5,000 errors/month)
4. Verify your email

### 2. Create a New Project

1. Click "Create Project" in your Sentry dashboard
2. Select "React Native" as the platform
3. Name your project "Intentional Dating" or similar
4. Click "Create Project"

### 3. Get Your DSN

After creating the project, you'll see a DSN (Data Source Name) that looks like:

```
https://abc123def456@o123456.ingest.sentry.io/789012
```

**Copy this DSN** - you'll need it in the next step.

### 4. Install Sentry SDK

In your project directory, run:

```bash
npm install @sentry/react-native
```

### 5. Configure Sentry in Your App

Edit `app/integrations/sentry/client.ts`:

```typescript
// Change these lines:
const SENTRY_ENABLED = true; // Enable Sentry
const SENTRY_DSN = 'https://your-dsn-here'; // Paste your DSN
```

Then uncomment all the Sentry code in the file (remove the `//` comments).

### 6. Test Sentry

Add this code temporarily to test:

```typescript
import { captureException } from '@/app/integrations/sentry/client';

// Trigger a test error
captureException(new Error('Test error from Intentional Dating App'));
```

Check your Sentry dashboard - you should see the error appear within a few seconds!

### 7. Configure Sentry Settings (Optional)

In your Sentry project settings, you can:

1. **Set up alerts** - Get notified when errors occur
2. **Configure integrations** - Connect to Slack, email, etc.
3. **Set up releases** - Track errors by app version
4. **Configure sampling** - Reduce the number of events sent

## Advanced Configuration

### Environment-Specific Settings

You can configure different settings for development vs production:

```typescript
Sentry.init({
  dsn: SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  // Only send 10% of events in development
  tracesSampleRate: __DEV__ ? 0.1 : 1.0,
  // Don't send errors in development (optional)
  beforeSend(event) {
    if (__DEV__) {
      console.log('[Sentry] Would send:', event);
      return null; // Don't send in dev
    }
    return event;
  },
});
```

### User Context

Set user context after login:

```typescript
import { setSentryUser } from '@/app/integrations/sentry/client';

// After successful login
setSentryUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

Clear user context on logout:

```typescript
import { clearSentryUser } from '@/app/integrations/sentry/client';

// On logout
clearSentryUser();
```

### Breadcrumbs

Add breadcrumbs to track user actions:

```typescript
import { addBreadcrumb } from '@/app/integrations/sentry/client';

// Track important actions
addBreadcrumb({
  message: 'User started conversation',
  category: 'user-action',
  level: 'info',
  data: { matchId: match.id },
});
```

### Performance Monitoring

Enable performance monitoring to track slow operations:

```typescript
Sentry.init({
  // ... other config
  tracesSampleRate: 1.0, // Capture 100% of transactions
  enableAutoPerformanceTracking: true,
});
```

## Monitoring Your App

### Sentry Dashboard

Your Sentry dashboard shows:
- **Issues** - Grouped errors with stack traces
- **Performance** - Slow operations and transactions
- **Releases** - Error rates by app version
- **Alerts** - Notifications for new or frequent errors

### Key Metrics to Watch

1. **Error Rate** - Percentage of sessions with errors
2. **Crash-Free Sessions** - Percentage of sessions without crashes
3. **Most Common Errors** - Top issues affecting users
4. **Affected Users** - Number of users experiencing errors

### Setting Up Alerts

1. Go to **Alerts** in your Sentry project
2. Click "Create Alert"
3. Choose a condition (e.g., "Error rate increases")
4. Set up notifications (email, Slack, etc.)

## Best Practices

### 1. Don't Log Sensitive Data

Never send passwords, tokens, or personal information to Sentry:

```typescript
Sentry.init({
  beforeSend(event) {
    // Remove sensitive data
    if (event.request?.headers) {
      delete event.request.headers['Authorization'];
    }
    return event;
  },
});
```

### 2. Use Breadcrumbs Wisely

Add breadcrumbs for important user actions, but don't overdo it:

```typescript
// Good - important action
addBreadcrumb({ message: 'User sent message' });

// Bad - too granular
addBreadcrumb({ message: 'User moved finger' });
```

### 3. Group Similar Errors

Use fingerprinting to group similar errors:

```typescript
Sentry.init({
  beforeSend(event) {
    // Group all network errors together
    if (event.message?.includes('Network')) {
      event.fingerprint = ['network-error'];
    }
    return event;
  },
});
```

### 4. Set Up Releases

Track errors by app version:

```typescript
Sentry.init({
  release: `intentional-dating@${Constants.expoConfig?.version}`,
  dist: Platform.select({
    ios: Constants.expoConfig?.ios?.buildNumber,
    android: Constants.expoConfig?.android?.versionCode?.toString(),
  }),
});
```

## Troubleshooting

### Errors Not Appearing

1. **Check DSN** - Make sure it's correct
2. **Check internet** - Sentry needs network access
3. **Check console** - Look for Sentry initialization errors
4. **Check beforeSend** - Make sure you're not filtering out all errors

### Too Many Errors

1. **Adjust sample rate** - Reduce `tracesSampleRate`
2. **Filter errors** - Use `beforeSend` to ignore certain errors
3. **Upgrade plan** - Sentry has paid plans with higher limits

### Performance Issues

1. **Reduce sample rate** - Lower `tracesSampleRate`
2. **Disable in development** - Only enable in production
3. **Use lazy loading** - Load Sentry asynchronously

## Cost Considerations

Sentry pricing is based on events (errors) per month:

- **Free**: 5,000 errors/month
- **Team**: $26/month for 50,000 errors/month
- **Business**: $80/month for 100,000 errors/month

Tips to stay within limits:
- Use sampling to reduce events
- Filter out noisy errors
- Group similar errors together

## Support

- **Sentry Docs**: https://docs.sentry.io/platforms/react-native/
- **Sentry Support**: https://sentry.io/support/
- **Community**: https://discord.gg/sentry

---

**Next Steps**:
1. Create your Sentry account
2. Get your DSN
3. Configure the app
4. Test with a sample error
5. Monitor your dashboard

Happy debugging! 🐛🔍
