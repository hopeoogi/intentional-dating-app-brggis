
# Deployment Guide - Build 144

## Pre-Deployment Checklist

### 1. Clean Environment
```bash
# Remove all caches
rm -rf node_modules/.cache
rm -rf .expo
rm -rf node_modules

# Fresh install
npm install

# Verify no axios
ls node_modules | grep axios
# Should return nothing
```

### 2. Verify Configuration Files
- [ ] `package.json` version is 1.2.0
- [ ] `app.json` version is 1.2.0
- [ ] `app.json` iOS buildNumber is 1.2.0
- [ ] `app.json` Android versionCode is 16
- [ ] `metro.config.js` is simplified
- [ ] `app/integrations/supabase/client.ts` uses native fetch

### 3. Test Locally
```bash
# Start dev server
npm run dev

# Test on iOS simulator
npm run ios

# Test on Android emulator
npm run android
```

### 4. Verify Database
- [ ] RLS policies are updated
- [ ] No 500 errors in Supabase logs
- [ ] Admin users table has entries
- [ ] App settings table is accessible

## Deployment Steps

### Step 1: Build for Production

```bash
# Build for both platforms
eas build --platform all --profile production
```

**Expected Output:**
- iOS build starts
- Android build starts
- Both builds complete successfully
- No adapter errors in build logs

### Step 2: Monitor Build Progress

1. Go to https://expo.dev/accounts/[your-account]/projects/intentional-dating/builds
2. Watch build logs for any errors
3. Verify both builds complete successfully

### Step 3: Submit to TestFlight

Once builds complete:

```bash
# Submit iOS build to TestFlight
eas submit --platform ios --profile production
```

### Step 4: Verify TestFlight Upload

1. Go to App Store Connect
2. Check TestFlight section
3. Verify build 1.2.0 appears
4. Wait for processing to complete

### Step 5: Test on TestFlight

1. Install from TestFlight
2. Launch app
3. Verify intro screen loads
4. Navigate to signin
5. Test authentication
6. Check admin portal
7. Verify no errors

## Post-Deployment Monitoring

### Check Logs

#### Expo Logs
```bash
# View real-time logs
npx expo start
```

#### Supabase Logs
1. Go to Supabase dashboard
2. Navigate to Logs section
3. Filter by API logs
4. Look for 500 errors

### Key Metrics to Monitor

- **Crash Rate**: Should be 0%
- **API Error Rate**: Should be < 1%
- **Startup Time**: Should be < 2 seconds
- **User Feedback**: Monitor TestFlight feedback

## Troubleshooting

### Issue: Adapter Error Still Appears

**Solution:**
1. Verify axios is not in node_modules
2. Clear all caches
3. Rebuild from scratch

```bash
rm -rf node_modules node_modules/.cache .expo
npm install
eas build --platform all --profile production --clear-cache
```

### Issue: 500 Errors from Supabase

**Solution:**
1. Check RLS policies in Supabase dashboard
2. Verify admin_users table has entries
3. Test queries directly in Supabase SQL editor

```sql
-- Test app_settings query
SELECT * FROM app_settings WHERE setting_key = 'intro_video';

-- Test admin check
SELECT * FROM admin_users WHERE active = true;
```

### Issue: App Crashes on Launch

**Solution:**
1. Check device logs
2. Verify all dependencies are installed
3. Test on different devices

### Issue: Intro Screen Stuck

**Solution:**
1. Check network connection
2. Verify navigation is working
3. Check console logs for errors

## Rollback Procedure

If critical issues are found:

1. **Immediate**: Remove build from TestFlight
2. **Notify**: Alert users via TestFlight notes
3. **Investigate**: Review logs and error reports
4. **Fix**: Address issues in code
5. **Rebuild**: Create new build with fixes
6. **Test**: Thoroughly test before redeploying

## Success Criteria

Build 144 is successful if:

- [ ] No adapter errors in logs
- [ ] No 500 errors from Supabase
- [ ] App launches successfully
- [ ] Intro screen loads quickly
- [ ] Navigation works smoothly
- [ ] Authentication functions properly
- [ ] Admin portal is accessible
- [ ] No crashes reported
- [ ] User feedback is positive

## Timeline

- **Build Time**: ~30 minutes
- **TestFlight Processing**: ~15 minutes
- **Testing**: ~1 hour
- **Monitoring**: 24-48 hours

## Communication

### To Users
"We've completely rebuilt the app to fix recurring issues. This version (1.2.0) should be much more stable. Please report any issues you encounter."

### To Team
"Build 144 is a complete rebuild addressing adapter errors and 500 errors. Monitor closely for the first 24 hours."

## Next Steps After Successful Deployment

1. Monitor for 24 hours
2. Collect user feedback
3. Address any minor issues
4. Plan next feature release
5. Update documentation

## Emergency Contacts

- **Technical Issues**: [Your contact]
- **Supabase Issues**: Check Supabase status page
- **Expo Issues**: Check Expo status page

## Notes

- This is a major rebuild, not just a patch
- All known issues have been addressed
- Focus is on stability over new features
- Monitor closely for first 48 hours

---

**Build Status**: ✅ READY FOR DEPLOYMENT
**Last Updated**: [Current Date]
**Build Number**: 144
**Version**: 1.2.0
