
# Quick Deploy - Update 107

## 🚀 Fast Track Deployment

### Step 1: Clean Everything (2 minutes)
```bash
# One command to rule them all
rm -rf node_modules .expo $TMPDIR/metro-* $TMPDIR/haste-* && npm cache clean --force && npm install
```

### Step 2: Verify Installation (30 seconds)
```bash
# Check critical packages
npm list expo-av expo-router @supabase/supabase-js
```

### Step 3: Test Locally (5 minutes)
```bash
# Start with clean cache
npx expo start --clear
```

**Test these flows:**
1. ✅ App opens → Intro screen shows
2. ✅ Intro finishes → Sign-in screen appears
3. ✅ Click "Join the Community" → Application starts
4. ✅ Complete application → Sequential pages work
5. ✅ Admin panel → Intro video settings load

### Step 4: Build (15-30 minutes)
```bash
# Production build for both platforms
eas build --platform all --profile production
```

### Step 5: Submit to TestFlight (5 minutes)
```bash
# Submit iOS build
eas submit --platform ios
```

## 🎯 What Changed

| Feature | Status | Notes |
|---------|--------|-------|
| Intro Video Screen | ✅ NEW | Supports video & images |
| Admin Video Manager | ✅ ENHANCED | Easy configuration |
| Sign-In Screen | ✅ EXISTING | Already working |
| Application Flow | ✅ EXISTING | Already sequential |
| AI Images | ✅ UPDATED | NYC dating themes |
| Version Numbers | ✅ UPDATED | 1.0.4 / Build 5 |

## 🔍 Quick Verification

### Check Intro Video
1. Open app
2. Should see NYC couple image
3. "Intentional" text overlay
4. Auto-advances after 3 seconds

### Check Admin Panel
1. Sign in as admin
2. Navigate to Admin Portal
3. Click "Intro Video"
4. Should see current settings
5. Try changing URL
6. Preview should update

### Check Application Flow
1. From sign-in, click "Join the Community"
2. Should see Step 1 of 10
3. Progress bar at top
4. Back button works
5. Continue button advances

## ⚡ Troubleshooting

### Build Fails
```bash
# Nuclear option - start fresh
rm -rf node_modules package-lock.json
npm install
npx expo prebuild --clean
eas build --platform all --profile production
```

### Intro Not Showing
```sql
-- Check database
SELECT * FROM app_settings WHERE setting_key = 'intro_video';

-- Enable if disabled
UPDATE app_settings 
SET setting_value = jsonb_set(setting_value, '{enabled}', 'true')
WHERE setting_key = 'intro_video';
```

### Video Won't Play
- Check URL is accessible
- Try with default Unsplash image
- Verify expo-av is installed: `npm list expo-av`

## 📋 Pre-Flight Checklist

Before submitting to TestFlight:

- [ ] Clean build completed successfully
- [ ] Tested on iOS simulator
- [ ] Tested on Android emulator
- [ ] Intro screen displays correctly
- [ ] Sign-in works
- [ ] Application flow works
- [ ] Admin panel accessible
- [ ] No console errors
- [ ] Version numbers updated (1.0.4)

## 🎉 Ready to Deploy?

If all checks pass:
```bash
# Build and submit in one go
eas build --platform ios --profile production --auto-submit
```

## 📞 Quick Help

**Intro video not showing?**
→ Check `app_settings` table, verify `enabled: true`

**Build failing?**
→ Run clean install: `rm -rf node_modules && npm install`

**Admin panel not loading?**
→ Verify admin user exists in `admin_users` table

**Application not saving?**
→ Check Supabase connection, verify `application_questions` table

---

**Version**: 1.0.4 (Update 107)
**Estimated Deploy Time**: 30-45 minutes
**Status**: ✅ Ready for Production
