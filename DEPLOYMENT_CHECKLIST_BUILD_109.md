
# Deployment Checklist - Build 109

## Pre-Deployment

### 1. Verify Configuration Files
- [ ] `eas.json` has `EXPO_NO_DEPLOY=1` in production profile
- [ ] `app.json` version is `1.0.6`
- [ ] `app.json` iOS buildNumber is `1.0.6`
- [ ] `app.json` Android versionCode is `7`
- [ ] `app.json` does NOT have `updates.url` field
- [ ] `app.json` has `extra.eas.projectId` set

### 2. Clean Environment
```bash
# Run these commands:
rm -rf node_modules
rm -rf .expo
rm -rf ios/build
rm -rf android/build
rm -rf android/.gradle
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*
npm cache clean --force
watchman watch-del-all 2>/dev/null || true
```
- [ ] All caches cleared
- [ ] Watchman cleared (if installed)

### 3. Fresh Install
```bash
npm install
```
- [ ] Dependencies installed successfully
- [ ] No errors during installation

### 4. Local Testing
```bash
npx expo start --clear
```
- [ ] Metro bundler starts successfully
- [ ] App loads on iOS simulator/device
- [ ] App loads on Android emulator/device
- [ ] No console errors
- [ ] Supabase client initializes
- [ ] Can sign in/sign up
- [ ] Can view profiles
- [ ] Can send messages

## Deployment

### 5. Build for Production
```bash
# For iOS
eas build --platform ios --profile production

# For Android
eas build --platform android --profile production

# For both
eas build --platform all --profile production
```
- [ ] Build command executed
- [ ] Build started successfully

### 6. Monitor Build
Watch the build logs for:
- [ ] ✅ "Building iOS app" (or Android)
- [ ] ✅ "Uploading build artifacts"
- [ ] ✅ "Build completed successfully"
- [ ] ❌ NO "API failed to sync" errors
- [ ] ❌ NO "(h.adapter || o.adapter) is not a function" errors
- [ ] ❌ NO "Unhandled Worker Script Exception" errors

### 7. Download Build
- [ ] Build completed successfully
- [ ] Downloaded IPA file (iOS)
- [ ] Downloaded APK file (Android)

## Post-Deployment

### 8. Test Build
- [ ] Install on physical device
- [ ] App launches successfully
- [ ] No crash on startup
- [ ] Can sign in
- [ ] Can view profiles
- [ ] Can send messages
- [ ] Push notifications work
- [ ] Location services work
- [ ] Image upload works

### 9. Submit to Stores

#### iOS - TestFlight
- [ ] Upload to App Store Connect
- [ ] Add to TestFlight
- [ ] Invite testers
- [ ] Monitor for crashes

#### iOS - App Store
- [ ] Create new version in App Store Connect
- [ ] Upload build
- [ ] Fill in "What's New"
- [ ] Submit for review

#### Android - Google Play
- [ ] Upload to Google Play Console
- [ ] Create new release
- [ ] Fill in release notes
- [ ] Submit for review

### 10. Monitor
- [ ] Check TestFlight for crashes
- [ ] Check App Store Connect for crashes
- [ ] Check Google Play Console for crashes
- [ ] Monitor user feedback
- [ ] Check Supabase logs for errors

## Troubleshooting

### If Build Fails with Adapter Error
1. [ ] Verify `EXPO_NO_DEPLOY=1` is in eas.json
2. [ ] Verify `updates.url` is removed from app.json
3. [ ] Clear EAS cache: `eas build --clear-cache`
4. [ ] Try building again

### If App Crashes on Launch
1. [ ] Check device logs
2. [ ] Check Supabase connection
3. [ ] Verify all environment variables
4. [ ] Check for missing dependencies

### If Features Don't Work
1. [ ] Check Supabase RLS policies
2. [ ] Check API endpoints
3. [ ] Check network connectivity
4. [ ] Check console logs

## Success Criteria

### Build Success
✅ Build completes without errors
✅ No adapter errors in logs
✅ IPA/APK files generated

### App Success
✅ App launches without crashes
✅ Authentication works
✅ Database operations work
✅ All features functional

### Store Success
✅ Uploaded to TestFlight/Google Play
✅ No crashes reported
✅ Users can install and use app

## Notes

- **OTA Updates Disabled**: You'll need to rebuild for updates
- **This is Temporary**: Until EAS fixes their worker script
- **Everything Else Works**: All app features work perfectly

## Version Info
- Build: 109
- Version: 1.0.6
- iOS Build: 1.0.6
- Android Version Code: 7

## Documentation
- `BUILD_109_DEPLOYMENT_GUIDE.md` - Full guide
- `ADAPTER_ERROR_ROOT_CAUSE.md` - Technical details
- `QUICK_DEPLOY_BUILD_109.md` - Quick commands

---

**Ready to Deploy?** 
If all pre-deployment checks pass, run:
```bash
eas build --platform all --profile production
```
