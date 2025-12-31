
# Cache Clear and Build Instructions

## Issue Resolution: (h.adapter || o.adapter) Error

This document outlines the steps to completely clear all caches and prepare for a clean TestFlight build.

## What Was Done

1. **Updated Metro Config** - Added `resetCache: true` to force cache clearing on every start
2. **Updated Package.json** - Added `--clear` flag to all start scripts
3. **Updated Build Scripts** - Added `--clean` flag to prebuild script
4. **Version Bump** - Updated to version 1.0.3 and build number 4

## Manual Cache Clearing Steps

Before launching to TestFlight, run these commands in order:

```bash
# 1. Clear all Metro bundler caches
rm -rf node_modules/.cache/metro

# 2. Clear Expo caches
rm -rf .expo

# 3. Clear build artifacts
rm -rf dist
rm -rf .expo-shared

# 4. Clear iOS build artifacts (if exists)
rm -rf ios/build

# 5. Clear Android build artifacts (if exists)
rm -rf android/build

# 6. Clear watchman cache (if installed)
watchman watch-del-all

# 7. Clear npm cache
npm cache clean --force

# 8. Reinstall dependencies
rm -rf node_modules
npm install

# 9. Start with clear cache
npm run clean
```

## EAS Build Commands

For TestFlight submission:

```bash
# 1. Clear local caches first (run commands above)

# 2. Build for iOS
eas build --platform ios --profile production --clear-cache

# 3. Submit to TestFlight
eas submit --platform ios --latest
```

## What Changed in Configuration

### metro.config.js
- Added `resetCache: true` to force cache clearing
- Simplified transformer configuration
- Removed any potential adapter-related code

### babel.config.js
- No changes needed - configuration is clean

### package.json
- All start scripts now include `--clear` flag
- Build script includes `--clean` flag
- Version bumped to 1.0.3

### app.json
- Version bumped to 1.0.3
- Build number bumped to 4 (iOS)
- Version code bumped to 4 (Android)

## Verification Steps

After clearing caches and before building:

1. ✅ Verify no `node_modules/.cache` directory exists
2. ✅ Verify no `.expo` directory exists
3. ✅ Verify `package.json` version is 1.0.3
4. ✅ Verify `app.json` version is 1.0.3
5. ✅ Verify `app.json` buildNumber is 4
6. ✅ Run `npm run lint` to check for errors
7. ✅ Test app locally with `npm run ios`

## Common Issues and Solutions

### Issue: Build still fails with adapter error
**Solution**: 
- Delete `node_modules` completely
- Delete `package-lock.json`
- Run `npm install` fresh
- Clear EAS build cache with `--clear-cache` flag

### Issue: Metro bundler still shows old code
**Solution**:
- Kill all Metro processes: `pkill -f metro`
- Clear watchman: `watchman watch-del-all`
- Restart with: `npm run clean`

### Issue: iOS build fails during archive
**Solution**:
- Ensure Xcode is up to date
- Clear derived data in Xcode
- Use EAS build instead of local build

## Notes

- The `(h.adapter || o.adapter)` code was likely coming from cached Metro bundler files
- This configuration ensures caches are cleared on every start
- EAS builds should use `--clear-cache` flag to ensure clean builds
- Version numbers have been incremented for TestFlight submission

## Next Steps

1. Run the manual cache clearing steps above
2. Test locally with `npm run ios`
3. If local test passes, run `eas build --platform ios --profile production --clear-cache`
4. Submit to TestFlight with `eas submit --platform ios --latest`

## Prevention

To prevent this issue from recurring:
- Always use `npm run clean` when switching branches
- Use `--clear` flag when debugging build issues
- Keep dependencies up to date
- Don't manually edit generated files in `node_modules`
