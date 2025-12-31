
# Complete Cache Clear and Build Guide

This guide provides step-by-step instructions to completely clear all caches and rebuild the project to resolve the adapter error.

## Step 1: Stop All Running Processes

```bash
# Stop any running Expo dev servers
# Press Ctrl+C in any terminal running expo start

# Kill any lingering Metro processes (macOS/Linux)
killall node

# Kill any lingering Metro processes (Windows)
taskkill /F /IM node.exe
```

## Step 2: Clear All Caches

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules

# Remove Expo cache
rm -rf .expo

# Remove Metro cache
rm -rf node_modules/.cache/metro

# Remove iOS build artifacts (if applicable)
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock

# Remove Android build artifacts (if applicable)
rm -rf android/build
rm -rf android/.gradle
rm -rf android/app/build

# Remove package-lock.json to ensure clean dependency resolution
rm -f package-lock.json
```

## Step 3: Reinstall Dependencies

```bash
# Install dependencies with clean slate
npm install

# For iOS, reinstall pods (if applicable)
cd ios && pod install && cd ..
```

## Step 4: Verify Configuration

Check that these files have the correct configuration:

### metro.config.js
- ✅ `config.resolver.unstable_enablePackageExports = true`
- ✅ No babel-plugin-module-resolver references

### babel.config.js
- ✅ No module-resolver plugin
- ✅ Only expo preset and essential plugins

### package.json
- ✅ No `babel-plugin-module-resolver` in devDependencies
- ✅ `@supabase/supabase-js` version `^2.47.10`

### app/integrations/supabase/client.ts
- ✅ `fetch: fetch.bind(globalThis)` in global config
- ✅ Simplified configuration

## Step 5: Test Locally

```bash
# Start Expo with cleared cache
npx expo start --clear

# Test on iOS simulator
npx expo start --ios --clear

# Test on Android emulator
npx expo start --android --clear
```

## Step 6: Build with EAS

```bash
# Build for preview (faster, for testing)
eas build --platform all --profile preview

# Build for production
eas build --platform all --profile production
```

## Troubleshooting

### If you still see the adapter error:

1. **Check Metro logs**:
   - Look for any warnings about package resolution
   - Verify that `@supabase/supabase-js` is being resolved correctly

2. **Verify fetch is available**:
   - Add console.log in `app/integrations/supabase/client.ts`
   - Check that `fetch` is defined and is a function

3. **Check for conflicting packages**:
   ```bash
   npm ls @supabase/supabase-js
   npm ls axios
   ```

4. **Verify environment variables**:
   - Check that `EXPO_NO_METRO_LAZY=1` is set in EAS build
   - Check that `EXPO_USE_METRO_WORKSPACE_ROOT=1` is set in EAS build

### If build fails on EAS:

1. **Check EAS build logs**:
   - Look for the exact error message
   - Check if it's during dependency installation or build phase

2. **Verify EAS configuration**:
   ```bash
   eas build:configure
   ```

3. **Try building with cache disabled**:
   - Temporarily set `"cache": { "disabled": true }` in eas.json
   - This forces a completely clean build

## Success Indicators

You'll know the fix worked when:

- ✅ Local development server starts without errors
- ✅ Supabase client initializes successfully (check console logs)
- ✅ EAS build completes without adapter errors
- ✅ App runs on physical devices without crashes
- ✅ API calls to Supabase work correctly

## Quick Command Reference

```bash
# Complete clean and rebuild (one-liner)
rm -rf node_modules .expo package-lock.json && npm cache clean --force && npm install && npx expo start --clear

# EAS build with clean cache
eas build --platform all --profile production --clear-cache
```

## Notes

- Always test locally before building with EAS
- Keep an eye on console logs for any warnings
- The first build after clearing caches may take longer
- Subsequent builds should be faster due to EAS caching

## Last Updated
January 2025
