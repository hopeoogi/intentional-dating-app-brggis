
# Complete Deployment Guide for Intentional Dating App

## Overview
This guide provides step-by-step instructions to successfully deploy your app using Expo Launch.

## Pre-Deployment Checklist

### 1. Clear All Caches
Before starting any deployment, clear all caches to ensure a clean build:

```bash
# Clear npm cache
npm cache clean --force

# Clear Expo cache
rm -rf .expo
rm -rf node_modules/.cache

# Clear Metro bundler cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*

# Clear watchman (if installed)
watchman watch-del-all

# Reinstall dependencies
rm -rf node_modules
npm install
```

### 2. Verify Configuration Files

#### app.json
- ✅ Version: 1.0.7
- ✅ iOS buildNumber: 1.0.7
- ✅ Android versionCode: 8
- ✅ No `updates.url` field (removed to prevent EAS Updates)
- ✅ `runtimeVersion` set to `{ "policy": "appVersion" }`
- ✅ `extra.eas.projectId` correctly set

#### eas.json
- ✅ `EXPO_NO_DEPLOY=1` in all build profiles
- ✅ `EXPO_NO_GIT_STATUS=1` added
- ✅ Cache disabled for production and preview
- ✅ `appVersionSource: "local"` in CLI config
- ✅ Channels configured for preview and production

#### metro.config.js
- ✅ `unstable_enablePackageExports: true` (critical for Supabase)
- ✅ `unstable_enableSymlinks: false`
- ✅ Proper condition names order
- ✅ Custom resolver for CSS modules

#### babel.config.js
- ✅ No conflicting module resolvers
- ✅ Worklets plugin last in the chain

### 3. Fix Lint Errors
All lint errors have been fixed:
- ✅ `app/intro-video.tsx`: Added `navigateToNext` to useEffect dependencies
- ✅ `components/PhotoUpload.tsx`: Fixed ImagePicker import to use `launchImageLibraryAsync` correctly

### 4. Verify Supabase Configuration
- ✅ URL polyfill imported first in `index.ts` and `app/_layout.tsx`
- ✅ Supabase client uses `fetch.bind(globalThis)`
- ✅ AsyncStorage configured for session persistence
- ✅ No axios dependencies anywhere in the codebase

## Deployment Steps

### Step 1: Run Linter
```bash
npm run lint
```
Expected output: No errors

### Step 2: Run Type Checker
```bash
npm run typecheck
```
Expected output: No errors

### Step 3: Test Locally
```bash
npm run dev
```
Test all critical flows:
- Sign in/Sign up
- Application process
- Photo uploads
- Admin panel
- Conversations

### Step 4: Build for Preview (Recommended First)
```bash
npm run build:preview
```

This will:
- Build for internal distribution
- Use the preview channel
- Not deploy EAS Updates (EXPO_NO_DEPLOY=1)
- Generate a build you can test on TestFlight/Internal Testing

### Step 5: Build for Production
Once preview build is tested and working:
```bash
npm run build:production
```

This will:
- Build for production
- Auto-increment build numbers
- Use the production channel
- Not deploy EAS Updates (EXPO_NO_DEPLOY=1)

### Step 6: Monitor Build Progress
1. Go to https://expo.dev/accounts/[your-account]/projects/intentional-dating/builds
2. Watch the build logs in real-time
3. Look for any errors or warnings

## Common Issues and Solutions

### Issue 1: "(h.adapter || o.adapter) is not a function"
**Status**: FIXED ✅

**What was causing it**:
- EAS was trying to sync/deploy updates during the build process
- Axios adapter error in edge/worker runtime

**How it's fixed**:
- `EXPO_NO_DEPLOY=1` prevents EAS from deploying updates
- `EXPO_NO_GIT_STATUS=1` prevents git status checks
- No `updates.url` in app.json
- Supabase client uses native fetch, not axios
- Metro config properly resolves ES modules

### Issue 2: Lint Errors
**Status**: FIXED ✅

**What was fixed**:
- `app/intro-video.tsx`: Added missing dependency to useEffect
- `components/PhotoUpload.tsx`: Fixed ImagePicker import

### Issue 3: Cache Issues
**Status**: PREVENTABLE ✅

**Solution**:
- Always clear caches before building (see Step 1)
- Cache is disabled in eas.json for production/preview builds

### Issue 4: Module Resolution
**Status**: FIXED ✅

**How it's fixed**:
- `unstable_enablePackageExports: true` in metro.config.js
- Proper condition names order
- No conflicting babel plugins

## Expo Launch Specific Notes

When using `expo launch` command:

1. **Ensure you're logged in**:
   ```bash
   npx expo login
   ```

2. **Verify project configuration**:
   ```bash
   npx expo config
   ```

3. **Use the correct command**:
   ```bash
   npx expo launch
   ```
   OR
   ```bash
   eas build --platform all --profile production
   ```

4. **Follow the prompts**:
   - Select platforms (iOS, Android, or both)
   - Confirm build configuration
   - Wait for build to complete

## Post-Build Steps

### For iOS (TestFlight)
1. Build completes successfully
2. Download the .ipa file or use automatic submission
3. Upload to App Store Connect (if not automatic)
4. Submit for TestFlight review
5. Once approved, invite testers

### For Android (Internal Testing)
1. Build completes successfully
2. Download the .apk or .aab file
3. Upload to Google Play Console
4. Submit to Internal Testing track
5. Invite testers

## Monitoring and Debugging

### Check EAS Build Logs
```bash
eas build:list
eas build:view [build-id]
```

### Check Supabase Logs
If you encounter runtime errors:
1. Go to Supabase Dashboard
2. Navigate to Logs section
3. Check API, Auth, and Database logs

### Check App Logs
For runtime errors in the app:
1. Use React Native Debugger
2. Check console.log statements
3. Review ErrorBoundary catches

## Version Management

Current versions:
- App version: 1.0.7
- iOS build number: 1.0.7
- Android version code: 8

When incrementing versions:
1. Update `version` in app.json
2. Update `ios.buildNumber` in app.json
3. Update `android.versionCode` in app.json (must be integer)
4. Update `version` in package.json

## Environment Variables

Ensure these are set in your Supabase project:
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anonymous key

These are already hardcoded in `app/integrations/supabase/client.ts` for convenience.

## Support and Resources

- Expo Documentation: https://docs.expo.dev
- EAS Build Documentation: https://docs.expo.dev/build/introduction/
- Supabase Documentation: https://supabase.com/docs
- React Native Documentation: https://reactnative.dev

## Final Checklist Before Deployment

- [ ] All lint errors fixed
- [ ] All type errors fixed
- [ ] All caches cleared
- [ ] Dependencies up to date
- [ ] Local testing completed
- [ ] Version numbers incremented
- [ ] eas.json configured correctly
- [ ] app.json configured correctly
- [ ] No axios dependencies
- [ ] Supabase client properly configured
- [ ] Error boundaries in place
- [ ] Logged into Expo account

## Success Indicators

You'll know the deployment is successful when:
1. ✅ Build completes without errors
2. ✅ No adapter errors in logs
3. ✅ App installs on device
4. ✅ App launches without crashes
5. ✅ Sign in/Sign up works
6. ✅ Supabase connection works
7. ✅ All features functional

## Next Steps After Successful Deployment

1. **Test thoroughly on TestFlight/Internal Testing**
2. **Gather feedback from beta testers**
3. **Fix any issues found**
4. **Prepare for production release**
5. **Submit to App Store/Play Store**

---

**Last Updated**: Build 1.0.7
**Status**: Ready for Deployment ✅
