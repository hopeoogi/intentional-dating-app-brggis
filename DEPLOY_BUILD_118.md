
# 🚀 Quick Deploy Guide - Build 118

## Prerequisites Checklist

- [ ] All changes saved and committed
- [ ] Terminal open in project root
- [ ] EAS CLI installed (`npm install -g eas-cli`)
- [ ] Logged into EAS (`eas login`)
- [ ] Apple Developer account configured

## 🔥 Quick Deploy Commands

### Option 1: Full Clean Deploy (Recommended)

```bash
# 1. Clear all caches
rm -rf node_modules/.cache && rm -rf .expo && rm -rf .metro

# 2. Reinstall dependencies (optional but recommended)
npm install

# 3. Build for iOS TestFlight
eas build --platform ios --profile production --clear-cache

# 4. Monitor build at: https://expo.dev/accounts/[your-account]/projects/intentional-dating/builds
```

### Option 2: Quick Deploy (If no dependency changes)

```bash
# Build for iOS TestFlight
eas build --platform ios --profile production --clear-cache
```

### Option 3: Build Both Platforms

```bash
# Build for both iOS and Android
eas build --platform all --profile production --clear-cache
```

## 📱 After Build Completes

### Automatic Steps (EAS handles these)
1. ✅ Build uploaded to App Store Connect
2. ✅ Available in TestFlight within 5-10 minutes
3. ✅ Processing by Apple (usually 5-15 minutes)

### Manual Steps (You need to do these)

1. **Go to App Store Connect**
   - https://appstoreconnect.apple.com

2. **Navigate to TestFlight**
   - Select "Intentional Dating" app
   - Go to TestFlight tab

3. **Add Build to Testing**
   - Select Build 118 (1.0.8)
   - Add to Internal Testing group
   - Add testing notes: "Fixed app crash on launch. Improved error handling and database access."

4. **Notify Testers**
   - Send notification to testers
   - Include testing instructions

## 🧪 Testing Instructions for Testers

### Test Case 1: Fresh Install
1. Delete app if previously installed
2. Install from TestFlight
3. Open app
4. **Expected:** Intro video/image shows, then sign-in screen
5. **Success:** No crash, smooth navigation

### Test Case 2: Sign In
1. Open app
2. Sign in with existing account
3. **Expected:** Navigate to home screen
4. **Success:** Can browse matches, view profile

### Test Case 3: New User
1. Open app
2. Tap "Join the Community"
3. Create new account
4. Complete application
5. **Expected:** Application submitted successfully
6. **Success:** See "Application Pending" screen

### Test Case 4: Pending Application
1. Sign in with account that has pending application
2. **Expected:** See "Application Pending" screen
3. **Success:** Appropriate message displayed

## 🔍 What to Look For

### ✅ Good Signs
- App launches without crash
- Intro video/image displays
- Navigation works smoothly
- Sign in/sign up works
- All screens load correctly
- No error messages

### ❌ Bad Signs (Report Immediately)
- App crashes on launch
- "Oops! Something went wrong" error
- Stuck on loading screen
- Can't sign in
- Navigation doesn't work
- Any error messages

## 📊 Monitoring

### Check Build Status
```bash
# View recent builds
eas build:list --platform ios --limit 5

# View specific build
eas build:view [build-id]
```

### Check Logs
```bash
# View build logs
eas build:view [build-id] --logs
```

### Check Supabase
- Dashboard: https://supabase.com/dashboard/project/plnfluykallohjimxnja
- Check API logs for errors
- Monitor database performance

## 🆘 Troubleshooting

### Build Fails

**Error: "Build failed during compilation"**
```bash
# Clear everything and try again
rm -rf node_modules
npm install
eas build --platform ios --profile production --clear-cache
```

**Error: "Credentials not found"**
```bash
# Reconfigure credentials
eas credentials
```

**Error: "Metro bundler error"**
```bash
# Clear Metro cache
rm -rf node_modules/.cache
rm -rf .expo
npm run clear-cache
```

### App Crashes in TestFlight

1. **Check Crash Reports**
   - App Store Connect → TestFlight → Crashes
   - Download crash logs

2. **Check Supabase Logs**
   - Look for 500 errors
   - Check API request patterns

3. **Check Console Logs**
   - Look for `[IntroVideo]` logs
   - Check navigation flow

4. **Report Issue**
   - Include crash logs
   - Include steps to reproduce
   - Include device/iOS version

## 📞 Support Contacts

### EAS Build Issues
- Documentation: https://docs.expo.dev/build/introduction/
- Support: https://expo.dev/support

### Supabase Issues
- Dashboard: https://supabase.com/dashboard
- Documentation: https://supabase.com/docs

### App Store Connect Issues
- Dashboard: https://appstoreconnect.apple.com
- Support: https://developer.apple.com/support/

## ✅ Success Criteria

Build 118 is successful when:

- [x] Build completes without errors
- [x] Uploaded to TestFlight
- [x] Testers can install
- [x] App launches without crash
- [x] All navigation works
- [x] Sign in/sign up works
- [x] No error screens
- [x] All features functional

## 🎉 Next Steps After Successful TestFlight

1. **Gather Feedback**
   - Monitor tester feedback
   - Fix any reported issues

2. **Prepare for Production**
   - Create App Store screenshots
   - Write app description
   - Set pricing and availability

3. **Submit for Review**
   - Submit to App Store review
   - Monitor review status
   - Respond to any feedback

4. **Launch! 🚀**
   - Release to App Store
   - Announce launch
   - Monitor user feedback

---

**Build:** 118 (1.0.8)
**Date:** January 1, 2026
**Status:** ✅ Ready to Deploy

**Deploy Command:**
```bash
eas build --platform ios --profile production --clear-cache
```

Good luck! 🍀
