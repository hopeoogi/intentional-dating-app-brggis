
# EAS Build Error Fix - "(h.adapter || o.adapter) is not a function"

## Problem
The error `CommandError: API failed to sync: Unhandled Worker Script Exception (h.adapter || o.adapter) is not a function` occurs during EAS builds. This is caused by module resolution issues with modern ES module packages, particularly `@supabase/supabase-js`.

## Root Cause
The error happens because:
1. Modern npm packages use the `exports` field in `package.json` for conditional exports
2. Metro bundler needs explicit configuration to resolve these exports correctly
3. The Supabase JS client uses modern ES module patterns that require proper resolution

## Fixes Applied

### 1. Enhanced Metro Configuration (`metro.config.js`)
- ✅ Enabled `unstable_enablePackageExports` for modern package resolution
- ✅ Added proper source extensions including `.cjs` and `.mjs`
- ✅ Configured resolver main fields for React Native compatibility
- ✅ Added transformer configuration for better module handling

### 2. Updated Babel Configuration (`babel.config.js`)
- ✅ Added `.cjs` and `.mjs` to module resolver extensions
- ✅ Ensured proper alias resolution for all module types

### 3. Enhanced EAS Build Configuration (`eas.json`)
- ✅ Added `EXPO_NO_METRO_LAZY=1` environment variable to all build profiles
- ✅ This prevents lazy bundling issues during EAS builds

### 4. Improved Supabase Client (`app/integrations/supabase/client.ts`)
- ✅ Added better error handling and logging
- ✅ Added client info headers for better debugging
- ✅ Improved platform-specific initialization

### 5. Package Resolution (`package.json`)
- ✅ Added explicit resolution for `@supabase/supabase-js`
- ✅ Maintained resolution for `@expo/prebuild-config`

## Steps to Apply the Fix

### Before Building:

1. **Clear all caches:**
   ```bash
   # Clear Metro bundler cache
   rm -rf node_modules/.cache
   
   # Clear Expo cache
   expo start -c
   
   # Or use the dev script which includes --clear
   npm run dev
   ```

2. **Reinstall dependencies:**
   ```bash
   # Remove existing installations
   rm -rf node_modules
   rm package-lock.json
   
   # Reinstall
   npm install
   ```

3. **Verify configuration:**
   - Ensure `metro.config.js` has `unstable_enablePackageExports = true`
   - Ensure `eas.json` has `EXPO_NO_METRO_LAZY=1` in all build profiles
   - Ensure `babel.config.js` includes `.cjs` and `.mjs` extensions

### Building with EAS:

1. **For production builds:**
   ```bash
   eas build --platform ios --profile production
   ```

2. **For preview builds:**
   ```bash
   eas build --platform ios --profile preview
   ```

## Why This Fix Works

1. **`unstable_enablePackageExports`**: Tells Metro to respect the `exports` field in `package.json`, which is how modern packages like Supabase define their entry points.

2. **Source Extensions**: Adding `.cjs` and `.mjs` ensures Metro can resolve CommonJS and ES modules correctly.

3. **`EXPO_NO_METRO_LAZY`**: Prevents Metro from using lazy bundling during EAS builds, which can cause module resolution issues.

4. **Resolver Main Fields**: Ensures Metro looks for the correct entry points in the right order for React Native.

5. **Package Resolutions**: Forces npm to use specific versions that are known to work together.

## Verification

After applying these fixes, you should see:
- ✅ No "(h.adapter || o.adapter) is not a function" errors
- ✅ Successful EAS builds
- ✅ App launches without crashes
- ✅ Supabase client initializes correctly

## If Issues Persist

If you still encounter issues after applying these fixes:

1. **Check EAS Build Logs:**
   - Look for any warnings about module resolution
   - Check if there are any other packages causing similar issues

2. **Verify Environment:**
   - Ensure you're using the latest EAS CLI: `npm install -g eas-cli`
   - Check your Node.js version: `node --version` (should be 18.x or 20.x)

3. **Test Locally First:**
   - Run `expo start --clear` and test on a physical device
   - Ensure the app works locally before building with EAS

4. **Check Supabase Connection:**
   - Verify your Supabase URL and keys are correct
   - Check that your Supabase project is active

## Additional Notes

- This fix is compatible with Expo SDK 54
- The configuration works for both iOS and Android builds
- Web builds should also work with these settings
- The fix maintains compatibility with all existing features

## Related Documentation

- [Expo Metro Config](https://docs.expo.dev/guides/customizing-metro/)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/installing)
- [EAS Build Configuration](https://docs.expo.dev/build/eas-json/)
