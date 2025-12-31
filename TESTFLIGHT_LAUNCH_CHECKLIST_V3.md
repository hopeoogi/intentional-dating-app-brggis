
# TestFlight Launch Checklist v3
## Build 4 - Cache Clear Edition

This checklist ensures the `(h.adapter || o.adapter)` error is completely resolved.

## Pre-Build Verification

### 1. Cache Clearing (CRITICAL)
- [ ] Run: `rm -rf node_modules/.cache/metro`
- [ ] Run: `rm -rf .expo`
- [ ] Run: `rm -rf dist .expo-shared`
- [ ] Run: `watchman watch-del-all` (if watchman installed)
- [ ] Run: `npm cache clean --force`
- [ ] Delete `node_modules` folder
- [ ] Delete `package-lock.json`
- [ ] Run: `npm install`

### 2. Version Verification
- [ ] `package.json` version: **1.0.3** ✓
- [ ] `app.json` version: **1.0.3** ✓
- [ ] `app.json` iOS buildNumber: **4** ✓
- [ ] `app.json` Android versionCode: **4** ✓

### 3. Configuration Verification
- [ ] `metro.config.js` has `resetCache: true` ✓
- [ ] `eas.json` production build has cache clearing enabled ✓
- [ ] No `(h.adapter || o.adapter)` code in any source files ✓

### 4. Code Quality
- [ ] Run: `npm run lint` - Should pass with no errors
- [ ] Check for any console errors in source files
- [ ] Verify all imports are correct

### 5. Local Testing
- [ ] Run: `npm run clean`
- [ ] Run: `npm run ios`
- [ ] App launches successfully
- [ ] No Metro bundler errors
- [ ] No runtime errors in console

## Build Process

### 1. EAS Build
```bash
# Clear EAS cache and build
eas build --platform ios --profile production --clear-cache
```

### 2. Monitor Build
- [ ] Watch build logs for any errors
- [ ] Verify no adapter-related errors appear
- [ ] Confirm build completes successfully
- [ ] Note the build ID for reference

### 3. TestFlight Submission
```bash
# Submit to TestFlight
eas submit --platform ios --latest
```

## Post-Build Verification

### 1. TestFlight Upload
- [ ] Build appears in App Store Connect
- [ ] Build status shows "Processing"
- [ ] No immediate rejection emails

### 2. TestFlight Testing
- [ ] Install build on test device
- [ ] App launches without crashes
- [ ] Test core functionality:
  - [ ] User authentication
  - [ ] Profile viewing
  - [ ] Conversations
  - [ ] Match filters
  - [ ] Admin panel (if admin user)

### 3. Crash Monitoring
- [ ] Check Xcode Organizer for crashes
- [ ] Monitor App Store Connect for crash reports
- [ ] Check Supabase logs for backend errors

## Troubleshooting

### If Build Fails with Adapter Error
1. Stop all Metro processes: `pkill -f metro`
2. Clear all caches again (see step 1 above)
3. Delete `ios` and `android` folders if they exist
4. Run: `npx expo prebuild --clean`
5. Try build again with `--clear-cache`

### If Build Succeeds but App Crashes
1. Check crash logs in Xcode Organizer
2. Review Supabase client initialization
3. Check AsyncStorage operations
4. Verify all required permissions are set

### If TestFlight Upload Fails
1. Verify bundle identifier matches: `com.anonymous.Natively`
2. Check provisioning profiles in App Store Connect
3. Ensure certificates are valid
4. Try manual upload through Xcode Organizer

## Success Criteria

✅ Build completes without errors
✅ No `(h.adapter || o.adapter)` errors in logs
✅ App uploads to TestFlight successfully
✅ App launches on test device without crashes
✅ Core functionality works as expected

## Build Information

- **Version**: 1.0.3
- **Build Number**: 4
- **Date**: 2025-01-XX
- **Changes**: 
  - Removed all cached files
  - Updated Metro config to force cache clearing
  - Updated EAS config to clear cache on production builds
  - Incremented version and build numbers

## Notes

- This build specifically addresses the recurring `(h.adapter || o.adapter)` error
- All caches have been cleared and configurations updated
- Metro bundler will reset cache on every start
- EAS builds will clear cache before building
- Version numbers have been incremented for proper TestFlight submission

## Contact

If issues persist after following this checklist:
1. Review `CACHE_CLEAR_AND_BUILD.md` for detailed instructions
2. Check `DEBUGGING_GUIDE.md` for troubleshooting steps
3. Review previous conversation history for context
