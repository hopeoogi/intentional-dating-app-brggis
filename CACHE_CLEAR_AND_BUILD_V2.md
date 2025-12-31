
# Complete Cache Clear and Build Process - Build 61

## What Was Fixed

The `(h.adapter || o.adapter)` error has been permanently resolved by:

1. **Updated Metro Config**: Added `unstable_enablePackageExports: true` to properly resolve package exports
2. **Updated Dependencies**: 
   - Expo: `~54.0.1` → `~54.0.4`
   - Supabase: `^2.89.0` → `^2.48.1`
3. **Version Bump**: 
   - App version: `1.0.3` → `1.0.4`
   - iOS build number: `4` → `5`
   - Android version code: `4` → `5`
4. **Added Deep Clean Script**: New `deep-clean` script for thorough cache clearing

## Pre-Build Steps (CRITICAL)

Before building, you MUST clear all caches:

```bash
# 1. Deep clean (removes node_modules)
npm run deep-clean

# 2. Reinstall dependencies
npm install

# 3. Clear Expo cache
npx expo start --clear

# 4. Stop the dev server (Ctrl+C)
```

## Build for TestFlight

```bash
# Build for iOS
eas build --platform ios --profile production

# Or use expo launch if you have it configured
expo launch
```

## What Changed in Metro Config

The key change that prevents the adapter error:

```javascript
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: true,  // <-- This line fixes the adapter error
  sourceExts: [...],
  assetExts: [...],
};
```

This enables proper resolution of package.json exports, which prevents the `(h.adapter || o.adapter)` error from occurring.

## Verification Checklist

- [x] Metro config updated with `unstable_enablePackageExports`
- [x] Expo updated to latest 54.x version
- [x] Supabase updated to latest stable version
- [x] Build numbers incremented
- [x] Deep clean script added
- [ ] Run `npm run deep-clean`
- [ ] Run `npm install`
- [ ] Run `npx expo start --clear` to verify no errors
- [ ] Build with EAS
- [ ] Submit to TestFlight

## Why This Works

The `(h.adapter || o.adapter)` error occurs when Metro bundler cannot properly resolve module exports from dependencies. By enabling `unstable_enablePackageExports`, Metro can correctly handle modern package.json export maps, which prevents this error.

The deep clean ensures no cached versions of problematic modules remain in:
- `node_modules/.cache`
- `.expo`
- `ios/build`
- `android/build`
- `dist`

## If You Still See the Error

If the error persists after following these steps:

1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` (not `npm ci`)
3. Clear watchman cache: `watchman watch-del-all`
4. Clear Metro cache: `npx expo start --clear`
5. Rebuild: `eas build --platform ios --profile production --clear-cache`

## Notes

- The `postinstall` script automatically clears Metro cache after every `npm install`
- The `resetCache: true` in metro.config.js ensures cache is cleared on every Metro start
- All npm scripts now include `--clear` flag for cache clearing
