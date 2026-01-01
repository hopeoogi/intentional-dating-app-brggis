
# 🚀 Deploy Update 107 to TestFlight - Step by Step

## Prerequisites
- [ ] You have EAS CLI installed (`npm install -g eas-cli`)
- [ ] You're logged into EAS (`eas login`)
- [ ] You have Apple Developer account configured

## Step 1: Clean Everything (2 minutes)

Copy and paste this entire command:

```bash
rm -rf node_modules .expo $TMPDIR/metro-* $TMPDIR/haste-* && npm cache clean --force && npm install
```

**Expected output**: Installation progress, should complete without errors

## Step 2: Verify Installation (30 seconds)

```bash
npm list expo-av
```

**Expected output**: Should show `expo-av@16.0.8` or similar

## Step 3: Test Locally (5 minutes)

```bash
npx expo start --clear
```

**What to test:**
1. Press `i` for iOS simulator
2. App should open
3. Intro screen should show (NYC couple image)
4. "Intentional" text should appear
5. After 3 seconds, should go to sign-in screen
6. Click "Join the Community"
7. Should see "Step 1 of 10"

**If everything works, press Ctrl+C to stop the server**

## Step 4: Build for Production (15-30 minutes)

```bash
eas build --platform ios --profile production
```

**What happens:**
- EAS will upload your code
- Build will start on EAS servers
- You'll get a URL to track progress
- Build takes 15-30 minutes

**Expected output:**
```
✔ Build finished
Build URL: https://expo.dev/accounts/...
```

## Step 5: Submit to TestFlight (5 minutes)

```bash
eas submit --platform ios
```

**What happens:**
- EAS will ask you to select a build
- Select the build you just created
- It will submit to App Store Connect
- Takes 5-10 minutes

**Expected output:**
```
✔ Submitted to App Store Connect
```

## Step 6: Wait for Apple Processing (30-60 minutes)

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to your app
3. Go to TestFlight tab
4. Wait for "Processing" to change to "Ready to Test"
5. Add testers or test yourself

## 🎉 Done!

Your app is now on TestFlight with:
- ✅ Intro video screen
- ✅ Admin panel for video management
- ✅ Sign-in screen
- ✅ Sequential application process
- ✅ AI-generated NYC dating images
- ✅ Version 1.0.4

## 🔍 Quick Test on TestFlight

Once processing is complete:

1. Install from TestFlight
2. Open app
3. Should see intro screen (NYC couple)
4. Should see "Intentional" text
5. Should auto-advance to sign-in
6. Click "Join the Community"
7. Should see application Step 1

## 🐛 If Something Goes Wrong

### Build Fails
```bash
# Try this
npx expo prebuild --clean
eas build --platform ios --profile production
```

### Intro Not Showing
1. Sign in as admin
2. Go to Admin Portal
3. Click "Intro Video"
4. Verify "Enabled" is ON
5. Check URL is valid

### Can't Access Admin Panel
```sql
-- Run this in Supabase SQL Editor
SELECT * FROM admin_users WHERE auth_user_id = 'YOUR_USER_ID';
```

## 📊 Build Status

| Step | Status | Time |
|------|--------|------|
| Clean Install | ⏳ Pending | 2 min |
| Verify Packages | ⏳ Pending | 30 sec |
| Local Test | ⏳ Pending | 5 min |
| Production Build | ⏳ Pending | 15-30 min |
| Submit to TestFlight | ⏳ Pending | 5 min |
| Apple Processing | ⏳ Pending | 30-60 min |

**Total Time**: ~1 hour

## 🎯 Success Criteria

You'll know it worked when:
- [x] Build completes without errors
- [x] Submission succeeds
- [x] App appears in TestFlight
- [x] Intro screen shows on launch
- [x] Sign-in screen works
- [x] Application process flows correctly
- [x] Admin panel accessible

## 📞 Need Help?

**Build failing?**
→ Check console output, share error message

**Intro not showing?**
→ Check Admin Panel → Intro Video settings

**Can't sign in?**
→ Verify Supabase connection, check auth settings

---

**Ready?** Start with Step 1 above! 🚀

**Version**: 1.0.4 (Update 107)
**Date**: January 2025
**Status**: Ready to Deploy
