
# Quick Deploy Commands - Update 106

## 🚀 Fast Track Deployment

Copy and paste these commands in order:

### 1. Clear Everything
```bash
# Stop any running processes first (Ctrl+C)

# Clear Expo cache
npx expo start --clear
# Then stop it (Ctrl+C)

# Clear npm cache
npm cache clean --force

# Clear Metro bundler
rm -rf $TMPDIR/metro-* $TMPDIR/haste-*

# Clear watchman (macOS only)
watchman watch-del-all

# Fresh install
rm -rf node_modules package-lock.json
npm install
```

### 2. Test Locally
```bash
# Start dev server
npx expo start --clear

# In another terminal, test iOS
npx expo start --ios

# Or test Android
npx expo start --android
```

### 3. Build for Production
```bash
# Login to EAS (if not already)
eas login

# Build both platforms
eas build --platform all --profile production

# Or build individually:
# eas build --platform ios --profile production
# eas build --platform android --profile production
```

### 4. Submit to TestFlight
```bash
# After iOS build completes
eas submit --platform ios
```

## 📋 Pre-Flight Checklist

Run these checks before building:

```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting issues
npm run lint

# Verify version numbers
cat app.json | grep version
# Should show: "version": "1.0.3"
# Should show: "buildNumber": "1.0.3"
# Should show: "versionCode": 4
```

## 🔍 Quick Verification

### Check Database Tables
```sql
-- Run in Supabase SQL Editor
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('app_settings', 'application_questions', 'application_responses');
-- Should return 3 rows
```

### Check Default Data
```sql
-- Check intro video settings
SELECT * FROM app_settings WHERE setting_key = 'intro_video';
-- Should return 1 row

-- Check application questions
SELECT COUNT(*) FROM application_questions;
-- Should return 10
```

### Check Admin User
```sql
-- Verify admin user exists
SELECT * FROM admin_users WHERE active = true;
-- Should return at least 1 row
```

## 🐛 Quick Fixes

### If Build Fails
```bash
# Nuclear option - clear everything
rm -rf node_modules package-lock.json
rm -rf ios/build android/build
npm cache clean --force
npm install
npx expo start --clear
```

### If Database Issues
```sql
-- Re-run migrations in Supabase SQL Editor
-- Copy SQL from migration files and run manually
```

### If Routing Issues
```bash
# Clear Expo cache and restart
rm -rf .expo
npx expo start --clear
```

## 📱 Testing Commands

### iOS Simulator
```bash
# List available simulators
xcrun simctl list devices

# Boot specific simulator
xcrun simctl boot "iPhone 15 Pro"

# Run app
npx expo start --ios
```

### Android Emulator
```bash
# List available emulators
emulator -list-avds

# Start emulator
emulator -avd Pixel_7_API_34

# Run app
npx expo start --android
```

## 🔄 Update Commands

### If You Need to Make Changes
```bash
# 1. Make your code changes

# 2. Test locally
npx expo start --clear

# 3. Increment version in app.json
# Change version to 1.0.4
# Change buildNumber to 1.0.4
# Change versionCode to 5

# 4. Build again
eas build --platform all --profile production
```

## 📊 Status Check Commands

### Check Build Status
```bash
# List recent builds
eas build:list

# View specific build
eas build:view [BUILD_ID]
```

### Check Submission Status
```bash
# List submissions
eas submit:list

# View specific submission
eas submit:view [SUBMISSION_ID]
```

## 🎯 One-Line Deploy

If everything is working and you just want to deploy:

```bash
npm cache clean --force && rm -rf node_modules package-lock.json && npm install && eas build --platform all --profile production
```

## 🆘 Emergency Rollback

If you need to rollback to previous version:

```bash
# 1. Revert version in app.json
# Change back to 1.0.2

# 2. Build previous version
eas build --platform all --profile production

# 3. Submit to TestFlight
eas submit --platform ios
```

## 📞 Get Help

### Check Logs
```bash
# Expo logs
npx expo start --clear

# EAS build logs
eas build:view [BUILD_ID]

# Supabase logs
# Go to: https://supabase.com/dashboard/project/plnfluykallohjimxnja/logs
```

### Common Issues

**"Module not found"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"Build failed"**
```bash
# Check EAS build logs
eas build:view [BUILD_ID]
```

**"Database error"**
```sql
-- Check RLS policies
SELECT * FROM pg_policies;
```

## ✅ Success Indicators

You'll know deployment is successful when:

- ✅ Build completes without errors
- ✅ App installs on TestFlight
- ✅ Intro video displays
- ✅ Sign-in works
- ✅ Application process completes
- ✅ Admin panel accessible

## 🎉 You're Done!

Once deployed:
1. Install from TestFlight
2. Test complete user flow
3. Invite beta testers
4. Monitor for issues
5. Gather feedback

---

**Version:** 1.0.3 (106)
**Quick Deploy:** ✅ Ready
**Status:** 🚀 Deploy Now!
