
# 🚀 Quick Deploy - Build 138

## Prerequisites
- EAS CLI installed and logged in
- Xcode configured (for iOS)
- All environment variables set

## Step-by-Step Deployment

### Step 1: Clean Everything (2 minutes)
```bash
# Remove all caches
rm -rf node_modules/.cache
rm -rf .expo
rm -rf node_modules
rm -rf package-lock.json

# Clear npm cache
npm cache clean --force

# Clear watchman (if installed)
watchman watch-del-all 2>/dev/null || true
```

### Step 2: Fresh Install (3-5 minutes)
```bash
# Install dependencies
npm install

# Verify installation
npm list @supabase/supabase-js
npm list expo-router
npm list react-native
```

### Step 3: Verify Configuration (1 minute)
```bash
# Check version numbers
grep '"version"' package.json
grep '"version"' app.json

# Should show:
# package.json: "version": "1.1.6"
# app.json: "version": "1.1.6"
```

### Step 4: Build for iOS (15-25 minutes)
```bash
# Start the build
eas build --platform ios --profile production

# The build will:
# 1. Upload project to EAS
# 2. Install dependencies
# 3. Run Metro bundler
# 4. Compile native code
# 5. Create IPA file
```

### Step 5: Monitor Build
1. Watch terminal output for errors
2. Check EAS dashboard: https://expo.dev/accounts/[your-account]/projects/intentional-dating/builds
3. Look for these success indicators:
   - ✅ "Uploading project" completes
   - ✅ "Installing dependencies" completes
   - ✅ "Metro bundler" completes without adapter errors
   - ✅ "Building iOS app" completes
   - ✅ "Build finished" message

### Step 6: Download & Test (5 minutes)
```bash
# Once build completes, download IPA
# From EAS dashboard or CLI:
eas build:download --platform ios --latest

# Install on TestFlight:
# 1. Go to App Store Connect
# 2. Upload IPA to TestFlight
# 3. Add build to testing group
# 4. Notify testers
```

## What to Watch For

### During Build
- ❌ **Adapter errors**: Should NOT appear
- ❌ **Axios errors**: Should NOT appear
- ❌ **Capability sync errors**: Should NOT appear
- ✅ **Metro bundling**: Should complete successfully
- ✅ **Native compilation**: Should complete without errors

### After Installation
- ✅ App launches without "Oops!" screen
- ✅ Intro splash displays for 3 seconds
- ✅ Skip button appears after 2 seconds
- ✅ Navigation works correctly
- ✅ Sign-in flow completes
- ✅ Home screen loads for authenticated users

## Troubleshooting

### Build Fails with Adapter Error
```bash
# Verify eas.json has correct flags
grep "EXPO_NO_CAPABILITY_SYNC" eas.json
grep "EXPO_NO_LAUNCH" eas.json

# Should show:
# "EXPO_NO_CAPABILITY_SYNC": "1"
# "EXPO_NO_LAUNCH": "1"
# "EAS_NO_LAUNCH": "1"
```

### Build Fails with Metro Error
```bash
# Clear Metro cache again
rm -rf node_modules/.cache
rm -rf .expo

# Restart build
eas build --platform ios --profile production --clear-cache
```

### Build Succeeds but App Crashes
```bash
# Check Sentry logs
# Check Supabase logs
# Check device console logs

# Common fixes:
# 1. Verify Supabase credentials
# 2. Check RLS policies
# 3. Test database connectivity
```

## Expected Timeline

| Step | Duration | Status |
|------|----------|--------|
| Clean caches | 2 min | ⏱️ |
| Install dependencies | 3-5 min | ⏱️ |
| Verify config | 1 min | ⏱️ |
| EAS build | 15-25 min | ⏱️ |
| Download & upload | 5 min | ⏱️ |
| **Total** | **26-38 min** | ⏱️ |

## Success Checklist

- [ ] All caches cleared
- [ ] Dependencies installed
- [ ] Version numbers correct (1.1.6)
- [ ] Build started successfully
- [ ] No adapter errors during build
- [ ] Build completed successfully
- [ ] IPA downloaded
- [ ] Uploaded to TestFlight
- [ ] App launches on device
- [ ] No "Oops!" screen
- [ ] Intro splash works
- [ ] Navigation works
- [ ] Sign-in works

## Quick Commands Reference

```bash
# Full clean and build
rm -rf node_modules/.cache .expo node_modules package-lock.json && \
npm cache clean --force && \
npm install && \
eas build --platform ios --profile production

# Check build status
eas build:list --platform ios --limit 5

# Download latest build
eas build:download --platform ios --latest

# View build logs
eas build:view [build-id]
```

## After Successful Deployment

1. **Monitor for 24 hours**
   - Check crash reports in Sentry
   - Monitor Supabase dashboard
   - Review TestFlight feedback

2. **Gather Feedback**
   - Ask testers to test critical flows
   - Collect any issues or bugs
   - Note performance feedback

3. **Plan Next Steps**
   - Address any minor issues
   - Plan next feature iteration
   - Consider Supabase upgrade if needed

---

## Ready to Deploy?

Run this single command to start:

```bash
rm -rf node_modules/.cache .expo node_modules package-lock.json && npm cache clean --force && npm install && eas build --platform ios --profile production
```

Then monitor the build and follow the checklist above! 🎉

---

**Build**: 138  
**Version**: 1.1.6  
**Status**: ✅ READY  
**Confidence**: HIGH
