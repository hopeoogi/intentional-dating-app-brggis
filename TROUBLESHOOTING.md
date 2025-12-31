
# 🔧 Troubleshooting Guide

## Common Issues & Solutions

### 1. Adapter Error: `(h.adapter || o.adapter) is not a function`

**Cause**: Cached Metro bundler files or incompatible HTTP client library

**Solution**:
```bash
# Step 1: Clear all caches
rm -rf node_modules/.cache
rm -rf .expo
rm -rf ios/build
rm -rf android/build

# Step 2: Clean npm cache
npm cache clean --force

# Step 3: Reinstall dependencies
rm -rf node_modules
npm install

# Step 4: Start with clean cache
npm run clean

# Step 5: Start fresh
npm run ios
```

**Prevention**: The app now uses only native fetch (no axios or other HTTP clients)

---

### 2. Build Fails on EAS

**Symptoms**: Build fails with cryptic errors

**Solution**:
```bash
# Clear EAS cache
eas build --platform ios --clear-cache

# Check build logs
eas build:view [BUILD_ID]

# Verify credentials
eas credentials

# Try production profile
eas build --platform ios --profile production
```

**Common Causes**:
- Outdated dependencies
- Missing credentials
- Invalid app.json configuration
- Xcode version mismatch

---

### 3. Supabase Connection Failed

**Symptoms**: "Failed to fetch" or "Network request failed"

**Solution**:
```typescript
// Check in app/integrations/supabase/client.ts
console.log('Supabase URL:', SUPABASE_URL);
console.log('Platform:', Platform.OS);

// Test connection
supabase.from('users').select('count').limit(1)
  .then(({ data, error }) => {
    if (error) console.error('Connection failed:', error);
    else console.log('Connection successful');
  });
```

**Checklist**:
- [ ] Internet connection working
- [ ] Supabase project active
- [ ] API keys correct
- [ ] RLS policies not blocking requests
- [ ] CORS configured (for web)

---

### 4. Edge Function Error

**Symptoms**: 500 error or "Function failed"

**Solution**:
```bash
# Check function logs
# Go to Supabase Dashboard → Edge Functions → approve-user → Logs

# Test function locally
supabase functions serve approve-user

# Test with curl
curl -X POST https://plnfluykallohjimxnja.supabase.co/functions/v1/approve-user \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pendingUserId": "UUID", "action": "approve"}'
```

**Common Issues**:
- Missing environment variables
- Invalid JWT token
- Database permissions
- Timeout (function too slow)

---

### 5. App Crashes on Launch

**Symptoms**: App opens then immediately closes

**Solution**:
```bash
# Check crash logs
# iOS: Xcode → Window → Devices and Simulators → View Device Logs
# Android: adb logcat

# Common fixes:
1. Clear app data
2. Reinstall app
3. Check for JavaScript errors
4. Verify all required dependencies installed
```

**Debug Steps**:
1. Add console.log in `app/_layout.tsx`
2. Check ErrorBoundary is catching errors
3. Test on different device
4. Check Expo logs: `npx expo start`

---

### 6. Photos Not Uploading

**Symptoms**: Image picker works but upload fails

**Solution**:
```typescript
// Check permissions
import * as ImagePicker from 'expo-image-picker';

const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
if (status !== 'granted') {
  Alert.alert('Permission needed', 'Please grant photo library access');
}

// Check Supabase storage
const { data, error } = await supabase.storage
  .from('user-photos')
  .upload(`${userId}/${Date.now()}.jpg`, file);

if (error) console.error('Upload error:', error);
```

**Checklist**:
- [ ] Permissions granted
- [ ] Storage bucket exists
- [ ] Storage policies configured
- [ ] File size under limit
- [ ] Valid file format

---

### 7. Push Notifications Not Working

**Symptoms**: Notifications not received

**Solution**:
```typescript
// Check notification permissions
import * as Notifications from 'expo-notifications';

const { status } = await Notifications.getPermissionsAsync();
console.log('Notification permission:', status);

// Get push token
const token = await Notifications.getExpoPushTokenAsync();
console.log('Push token:', token);

// Test notification
await Notifications.scheduleNotificationAsync({
  content: {
    title: 'Test',
    body: 'This is a test notification',
  },
  trigger: null, // Send immediately
});
```

**Checklist**:
- [ ] Permissions granted
- [ ] Push token saved to database
- [ ] Notification service configured
- [ ] Device has internet connection
- [ ] App in foreground/background (test both)

---

### 8. Lint Errors

**Symptoms**: `npm run lint` shows errors

**Solution**:
```bash
# Auto-fix what's possible
npm run lint -- --fix

# Ignore specific rules (if needed)
# Add to .eslintrc.js:
rules: {
  'rule-name': 'off',
}
```

**Common Lint Issues**:
- Unused imports → Remove them
- Missing dependencies in useEffect → Add or disable rule
- Array type → Use `T[]` instead of `Array<T>`

---

### 9. TypeScript Errors

**Symptoms**: Red squiggly lines in editor

**Solution**:
```bash
# Regenerate types
npx supabase gen types typescript --project-id plnfluykallohjimxnja > app/integrations/supabase/types.ts

# Check tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true
  }
}
```

**Common Fixes**:
- Add type annotations
- Use `any` temporarily (not recommended)
- Check import paths
- Verify types file is up to date

---

### 10. Slow Performance

**Symptoms**: App feels sluggish

**Solution**:
```typescript
// Use React.memo for expensive components
const ProfileCard = React.memo(({ user }) => {
  // Component code
});

// Use useCallback for functions
const handlePress = useCallback(() => {
  // Function code
}, [dependencies]);

// Optimize images
<Image
  source={{ uri: photo.url }}
  style={styles.image}
  resizeMode="cover"
  // Add these:
  defaultSource={require('./placeholder.png')}
  loadingIndicatorSource={require('./loading.png')}
/>
```

**Performance Checklist**:
- [ ] Images optimized
- [ ] Lists use FlatList (not ScrollView)
- [ ] Unnecessary re-renders prevented
- [ ] Heavy computations memoized
- [ ] Network requests cached

---

## Emergency Procedures

### If Everything Breaks:

1. **Nuclear Option** (Start Fresh):
```bash
# Backup your code first!
git commit -am "Backup before reset"

# Delete everything
rm -rf node_modules
rm -rf .expo
rm -rf ios
rm -rf android
rm -rf package-lock.json

# Reinstall
npm install

# Rebuild
npx expo prebuild --clean
```

2. **Rollback to Last Working Version**:
```bash
git log --oneline
git checkout [COMMIT_HASH]
npm install
```

3. **Contact Support**:
- Expo: https://expo.dev/support
- Supabase: https://supabase.com/support
- Stack Overflow: Tag with `expo`, `react-native`, `supabase`

---

## Prevention Tips

### Best Practices:

1. **Commit Often**
```bash
git commit -am "Working state before changes"
```

2. **Test Before Building**
```bash
npm run ios  # Test locally first
npm run lint # Check for errors
```

3. **Keep Dependencies Updated**
```bash
npm outdated  # Check for updates
npm update    # Update safely
```

4. **Monitor Logs**
- Check Supabase logs daily
- Review EAS build logs
- Monitor app crashes

5. **Backup Database**
```bash
# In Supabase Dashboard:
# Database → Backups → Create Backup
```

---

## Getting Help

### Before Asking for Help:

1. **Check Logs**
   - Metro bundler logs
   - Supabase logs
   - EAS build logs
   - Device logs

2. **Search Documentation**
   - Expo docs
   - Supabase docs
   - React Native docs

3. **Search Issues**
   - GitHub issues
   - Stack Overflow
   - Expo forums

### When Asking for Help:

Include:
- Error message (full text)
- Steps to reproduce
- What you've tried
- Relevant code snippets
- Platform (iOS/Android/Web)
- Versions (Expo, React Native, etc.)

---

## Quick Fixes Reference

| Issue | Quick Fix |
|-------|-----------|
| Adapter error | `npm run clean && npm install` |
| Build fails | `eas build --clear-cache` |
| Supabase error | Check RLS policies |
| App crashes | Check ErrorBoundary logs |
| Slow performance | Use React.memo |
| Photos not uploading | Check storage policies |
| Notifications not working | Check permissions |
| Lint errors | `npm run lint -- --fix` |
| TypeScript errors | Regenerate types |
| Cache issues | `rm -rf .expo && npm run clean` |

---

**Remember**: Most issues are caused by:
1. Cached files
2. Missing dependencies
3. Configuration errors
4. Permission issues

Clear caches and reinstall dependencies first! 🔧
