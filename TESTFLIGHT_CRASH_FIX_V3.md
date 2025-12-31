
# TestFlight Crash Fix - Update 93+

## Issue
After successfully deploying Update 93 to TestFlight, the app crashes immediately upon launch on iPhone devices.

## Root Causes Identified

### 1. **app.json Configuration Issue (PRIMARY)**
The `app.json` file contained an `eas.projectId` entry in the `extra` section, which is known to cause white screen/crash issues in production builds.

**Problem:**
```json
"extra": {
  "router": {
    "origin": false
  },
  "eas": {
    "projectId": "plnfluykallohjimxnja"
  }
}
```

**Solution:**
Removed the `eas` object from the `extra` section. The project ID is already configured in the EAS build system and doesn't need to be in app.json.

```json
"extra": {
  "router": {
    "origin": false
  }
}
```

### 2. **Splash Screen API Usage**
The app was using `SplashScreen.hideAsync()` which is the legacy API. For Expo SDK 54, the recommended approach is to use `SplashScreen.hide()`.

**Changed:**
```typescript
// Before
SplashScreen.hideAsync();

// After
SplashScreen.hide();
```

### 3. **Error Boundary Added**
Added an ErrorBoundary component to wrap the entire app, which will catch any React errors and prevent complete crashes, showing a user-friendly error screen instead.

## Changes Made

### 1. app.json
- ✅ Removed `eas.projectId` from `extra` section
- ✅ Kept all other configurations intact

### 2. app/_layout.tsx
- ✅ Changed `SplashScreen.hideAsync()` to `SplashScreen.hide()`
- ✅ Wrapped entire app in `<ErrorBoundary>` component
- ✅ Maintained URL polyfill import at the top

### 3. app/integrations/supabase/client.ts
- ✅ Added try-catch wrapper around dev-only session check
- ✅ Ensured Supabase initialization won't crash the app if unreachable

## Testing Checklist

Before submitting to TestFlight:

- [ ] Build the app locally with `eas build --platform ios --profile production`
- [ ] Test on iOS Simulator
- [ ] Test on physical iOS device (development build)
- [ ] Verify splash screen shows and hides correctly
- [ ] Verify app doesn't crash on launch
- [ ] Check that Supabase connection works
- [ ] Verify all tabs are accessible
- [ ] Test navigation between screens

## Deployment Steps

1. **Clear all caches:**
   ```bash
   rm -rf node_modules
   rm -rf .expo
   rm -rf ios
   rm -rf android
   npm install
   ```

2. **Build for TestFlight:**
   ```bash
   eas build --platform ios --profile production
   ```

3. **Monitor build logs** for any errors

4. **After successful build:**
   - Submit to TestFlight
   - Wait for Apple's processing
   - Download on iPhone and test thoroughly

## Expected Behavior

After these fixes:
- ✅ App should launch successfully on iPhone
- ✅ Splash screen should display briefly then hide
- ✅ Main app interface should load
- ✅ All tabs should be accessible
- ✅ Supabase connection should work
- ✅ If any errors occur, ErrorBoundary will catch them and show a friendly error screen

## Monitoring

After deployment to TestFlight:

1. **Check Expo logs:**
   - No build errors
   - No runtime errors in production

2. **Check Supabase logs:**
   - API requests are successful
   - Auth requests work properly
   - No database errors

3. **User Testing:**
   - App launches successfully
   - No immediate crashes
   - All features work as expected

## Rollback Plan

If the app still crashes after these fixes:

1. Check TestFlight crash logs in App Store Connect
2. Review Expo build logs for any warnings
3. Check Supabase logs for any errors
4. Consider reverting to the last known working build
5. Add more detailed error logging to identify the issue

## Additional Notes

- The `eas.projectId` in `app.json` was likely added automatically by EAS CLI but is not needed for production builds
- The splash screen API change aligns with Expo SDK 54 best practices
- The ErrorBoundary provides a safety net for any unexpected React errors
- All URL polyfill imports remain in place to ensure Supabase works correctly

## References

- [Expo Splash Screen Documentation](https://docs.expo.dev/versions/latest/sdk/splash-screen/)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
- [Supabase React Native Setup](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)
