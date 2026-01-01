
# Quick Deploy - Build 144

## Prerequisites
- EAS CLI installed
- Logged into Expo account
- Supabase project accessible

## Step-by-Step Deployment

### 1. Clean Everything (5 minutes)
```bash
# Remove all caches and artifacts
rm -rf node_modules/.cache
rm -rf .expo
rm -rf node_modules

# Fresh install
npm install

# Verify no axios
ls node_modules | grep axios
# Should return nothing - if it shows axios, something is wrong
```

### 2. Verify Configuration (2 minutes)
```bash
# Check versions
grep '"version"' package.json app.json

# Should show 1.2.0 in both files

# Check Metro config
cat metro.config.js | grep "REBUILD 144"

# Should show comment about BUILD 144
```

### 3. Test Locally (10 minutes)
```bash
# Start dev server
npm run dev

# In another terminal, test iOS
npm run ios

# Or test Android
npm run android

# Verify:
# - App launches
# - Intro screen appears
# - No adapter errors in console
# - Navigation works
```

### 4. Build for Production (30 minutes)
```bash
# Build both platforms
eas build --platform all --profile production

# Or build individually
eas build --platform ios --profile production
eas build --platform android --profile production
```

### 5. Monitor Build (30 minutes)
```bash
# Watch build progress
# Go to: https://expo.dev

# Or check status
eas build:list

# Wait for both builds to complete
```

### 6. Submit to TestFlight (15 minutes)
```bash
# Submit iOS build
eas submit --platform ios --profile production

# Follow prompts to select build
```

### 7. Verify TestFlight (15 minutes)
1. Go to App Store Connect
2. Navigate to TestFlight
3. Wait for processing
4. Install on test device
5. Test thoroughly

## Quick Verification Checklist

After deployment, verify:

- [ ] App launches without errors
- [ ] Intro screen loads quickly
- [ ] Navigation to signin works
- [ ] No adapter errors in logs
- [ ] No 500 errors from Supabase
- [ ] Authentication works
- [ ] Admin portal accessible
- [ ] No crashes

## Troubleshooting

### Build Fails
```bash
# Clear EAS cache and retry
eas build --platform all --profile production --clear-cache
```

### Adapter Error Appears
```bash
# Verify axios is not installed
npm ls axios

# Should show: (empty)

# If axios appears, remove it
npm uninstall axios
rm -rf node_modules
npm install
```

### 500 Errors
```bash
# Check Supabase logs
# Go to Supabase dashboard → Logs

# Test RLS policies
# Go to Supabase dashboard → SQL Editor
# Run: SELECT * FROM app_settings WHERE setting_key = 'intro_video';
```

## Emergency Rollback

If critical issues found:

```bash
# Remove from TestFlight
# Go to App Store Connect → TestFlight
# Disable build 1.2.0

# Notify users
# Add note in TestFlight: "Please use previous version while we fix issues"
```

## Success Indicators

Build is successful if:
- ✅ No errors during build
- ✅ TestFlight upload succeeds
- ✅ App launches on test device
- ✅ No adapter errors
- ✅ No 500 errors
- ✅ All features work

## Timeline

- **Clean & Verify**: 7 minutes
- **Local Testing**: 10 minutes
- **Build**: 30 minutes
- **Submit**: 15 minutes
- **TestFlight**: 15 minutes
- **Total**: ~77 minutes

## Commands Summary

```bash
# Complete deployment in one go
rm -rf node_modules/.cache .expo node_modules && \
npm install && \
npm run dev & \
sleep 10 && \
eas build --platform all --profile production && \
eas submit --platform ios --profile production
```

## Post-Deployment

After successful deployment:

1. Monitor logs for 24 hours
2. Check Supabase dashboard for errors
3. Review TestFlight feedback
4. Test on multiple devices
5. Document any issues

## Support

If you encounter issues:

1. Check logs: `npx expo start`
2. Check Supabase: Dashboard → Logs
3. Check EAS: https://expo.dev
4. Review this guide
5. Check BUILD_144_COMPLETE_REBUILD.md

---

**Status**: ✅ READY TO DEPLOY
**Build**: 144
**Version**: 1.2.0
**Estimated Time**: 77 minutes
