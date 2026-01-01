
# ⚡ Quick Deploy Commands - Build 120

## 🎯 CRITICAL FIX
This build fixes the "Oops! Something went wrong" error. Deploy immediately.

## 📋 PREREQUISITES
- EAS CLI installed (`npm install -g eas-cli`)
- Logged into EAS (`eas login`)
- Apple Developer account configured
- Google Play account configured (for Android)

## 🚀 DEPLOYMENT COMMANDS

### 1️⃣ Clean Everything
```bash
# Remove all caches and node_modules
rm -rf node_modules/.cache && rm -rf .expo && rm -rf node_modules

# Fresh install
npm install
```

### 2️⃣ Build iOS (Production)
```bash
# Start iOS production build
eas build --platform ios --profile production

# Wait for build to complete (15-30 minutes)
# Build will appear in: https://expo.dev/accounts/[your-account]/projects/intentional-dating/builds
```

### 3️⃣ Build Android (Production)
```bash
# Start Android production build
eas build --platform android --profile production

# Wait for build to complete (15-30 minutes)
```

### 4️⃣ Submit to TestFlight
```bash
# Submit iOS build to TestFlight
eas submit --platform ios --profile production

# Follow prompts to select build
# Wait for processing (30-60 minutes)
```

### 5️⃣ Submit to Google Play (Optional)
```bash
# Submit Android build to Google Play
eas submit --platform android --profile production

# Follow prompts to select build
```

## ✅ VERIFICATION COMMANDS

### Check Build Status
```bash
# List recent builds
eas build:list

# View specific build
eas build:view [build-id]
```

### Check Submission Status
```bash
# List recent submissions
eas submit:list

# View specific submission
eas submit:view [submission-id]
```

## 🧪 TESTING COMMANDS

### Test Database Connection
```bash
# In Supabase SQL Editor, run:
SELECT setting_value FROM app_settings WHERE setting_key = 'intro_video';

# Should return intro video settings without errors
```

### Check RLS Policies
```bash
# In Supabase SQL Editor, run:
SELECT * FROM pg_policies WHERE tablename = 'app_settings';

# Should show policies using is_active_admin() function
```

## 📊 MONITORING COMMANDS

### View Supabase Logs
```bash
# API logs
# Go to: https://supabase.com/dashboard/project/plnfluykallohjimxnja/logs/api-logs

# Postgres logs  
# Go to: https://supabase.com/dashboard/project/plnfluykallohjimxnja/logs/postgres-logs
```

### View Expo Logs
```bash
# View runtime logs
npx expo start --clear

# View build logs
eas build:view [build-id]
```

## 🔄 ALTERNATIVE: Build Both Platforms at Once
```bash
# Build iOS and Android simultaneously
eas build --platform all --profile production
```

## 🆘 IF BUILD FAILS

### Clear Everything and Retry
```bash
# Nuclear option - clear everything
rm -rf node_modules
rm -rf .expo
rm -rf node_modules/.cache
rm -rf ~/.expo
rm -rf ~/Library/Caches/expo

# Reinstall
npm install

# Retry build
eas build --platform ios --profile production
```

### Check EAS Configuration
```bash
# Validate eas.json
eas build:configure

# Check project status
eas project:info
```

### View Detailed Build Logs
```bash
# Get build ID from eas build:list
eas build:view [build-id]

# Download build logs
eas build:logs [build-id]
```

## 📱 TESTING ON DEVICE

### iOS (TestFlight)
1. Install TestFlight app from App Store
2. Open TestFlight invitation link
3. Install Build 120
4. Launch app and verify:
   - No "Oops" error
   - Intro video displays
   - Navigation works

### Android (Internal Testing)
1. Join internal testing group
2. Download from Google Play
3. Install Build 120
4. Launch app and verify same as iOS

## 🎯 SUCCESS INDICATORS

### Build Success
```
✅ Build completed successfully
✅ No errors in build logs
✅ Build available in EAS dashboard
✅ Build size is reasonable (<50MB)
```

### Submission Success
```
✅ Submission accepted
✅ Processing completed
✅ Available in TestFlight/Play Console
✅ No rejection notices
```

### App Success
```
✅ App launches without errors
✅ Intro video displays
✅ Navigation works correctly
✅ No crashes reported
```

## 📞 QUICK REFERENCE

### Important URLs
- **EAS Dashboard**: https://expo.dev/accounts/[your-account]/projects/intentional-dating
- **Supabase Dashboard**: https://supabase.com/dashboard/project/plnfluykallohjimxnja
- **TestFlight**: https://appstoreconnect.apple.com
- **Play Console**: https://play.google.com/console

### Important Commands
```bash
# Build
eas build --platform ios --profile production

# Submit
eas submit --platform ios --profile production

# Status
eas build:list

# Logs
eas build:view [build-id]
```

## ⏱️ ESTIMATED TIMELINE

```
Clean & Install:     5 minutes
iOS Build:          20 minutes
Android Build:      20 minutes
iOS Submission:     10 minutes
TestFlight Process: 45 minutes
-----------------------------------
Total:             ~100 minutes
```

## 🎉 AFTER SUCCESSFUL DEPLOYMENT

### Immediate Actions
1. ✅ Test app on physical device
2. ✅ Check Supabase logs for errors
3. ✅ Verify all features work
4. ✅ Monitor crash reports

### Next Steps
1. Collect user feedback
2. Monitor for 24 hours
3. Prepare App Store submission
4. Plan next features

---

**Build**: 120
**Version**: 1.1.0
**Status**: 🟢 READY TO DEPLOY
**Priority**: 🔴 CRITICAL FIX

**Quick Start**: Run commands in order, wait for each to complete before proceeding to next.
