
# Deployment Guide - Version 1.0.3 (Build 106)

## 🚀 Pre-Deployment Checklist

### 1. Environment Verification
- [ ] Supabase project is active and accessible
- [ ] Database migrations have been applied successfully
- [ ] Admin user exists in `admin_users` table
- [ ] App settings table has default intro video configuration
- [ ] All RLS policies are in place

### 2. Code Verification
- [ ] All new files are created and saved
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] All imports are correct
- [ ] Version numbers updated in app.json

### 3. Testing Verification
- [ ] Intro video screen loads
- [ ] Sign-in works
- [ ] Application process completes
- [ ] Admin panel accessible
- [ ] Photo uploads work

## 📦 Step-by-Step Deployment

### Step 1: Clear All Caches

```bash
# Navigate to project directory
cd /path/to/your/project

# Clear Expo cache
npx expo start --clear

# Stop the dev server (Ctrl+C)

# Clear npm cache
npm cache clean --force

# Clear Metro bundler cache
rm -rf $TMPDIR/metro-*
rm -rf $TMPDIR/haste-*

# Clear watchman (macOS only)
watchman watch-del-all

# Clear iOS build cache (if applicable)
cd ios && rm -rf build && cd ..

# Clear Android build cache (if applicable)
cd android && ./gradlew clean && cd ..
```

### Step 2: Fresh Dependency Install

```bash
# Remove existing node_modules and lock files
rm -rf node_modules
rm package-lock.json
rm yarn.lock  # if using yarn

# Fresh install
npm install

# Verify no errors during install
```

### Step 3: Verify Database Migrations

```bash
# Check Supabase project status
# Go to: https://supabase.com/dashboard/project/plnfluykallohjimxnja

# Verify these tables exist:
# - app_settings
# - application_questions
# - application_responses
# - pending_users
# - pending_user_photos
# - admin_users

# Verify default data exists:
# - app_settings has 'intro_video' entry
# - application_questions has 10 questions
```

### Step 4: Test Locally

```bash
# Start development server
npx expo start --clear

# Test on iOS simulator
# Press 'i' in terminal

# Test on Android emulator
# Press 'a' in terminal

# Test critical flows:
# 1. Intro video → Sign in
# 2. Sign in → Application process
# 3. Complete application → Pending screen
# 4. Admin panel → Intro video settings
```

### Step 5: Build for Production

#### iOS Build

```bash
# Ensure you're logged into EAS
eas login

# Build for iOS
eas build --platform ios --profile production

# Wait for build to complete (15-30 minutes)
# Build will be available in Expo dashboard
```

#### Android Build

```bash
# Build for Android
eas build --platform android --profile production

# Wait for build to complete (15-30 minutes)
```

#### Build Both Platforms

```bash
# Build both at once
eas build --platform all --profile production
```

### Step 6: Submit to TestFlight (iOS)

```bash
# After iOS build completes
eas submit --platform ios

# Follow prompts to submit to App Store Connect
# Build will appear in TestFlight within 10-30 minutes
```

### Step 7: Distribute Android Build

```bash
# Download APK from Expo dashboard
# Or submit to Google Play Console:
eas submit --platform android
```

## 🔍 Post-Deployment Verification

### 1. TestFlight Testing (iOS)

- [ ] Install from TestFlight
- [ ] Launch app - verify intro video shows
- [ ] Sign in with test account
- [ ] Complete application process
- [ ] Verify photos upload
- [ ] Check admin panel access
- [ ] Test all navigation flows

### 2. Android Testing

- [ ] Install APK or from Play Store
- [ ] Launch app - verify intro video shows
- [ ] Sign in with test account
- [ ] Complete application process
- [ ] Verify photos upload
- [ ] Check admin panel access
- [ ] Test all navigation flows

### 3. Database Verification

```sql
-- Check pending users
SELECT * FROM pending_users ORDER BY submitted_at DESC LIMIT 10;

-- Check application responses
SELECT * FROM application_responses ORDER BY created_at DESC LIMIT 20;

-- Check app settings
SELECT * FROM app_settings WHERE setting_key = 'intro_video';

-- Check admin users
SELECT * FROM admin_users WHERE active = true;
```

## 🐛 Troubleshooting

### Issue: Intro Video Not Showing

**Solution:**
1. Check `app_settings` table has intro_video entry
2. Verify `enabled` is true in settings
3. Check URL is valid and accessible
4. Clear app cache and restart

### Issue: Sign-In Fails

**Solution:**
1. Verify Supabase project is active
2. Check auth settings in Supabase dashboard
3. Ensure email confirmation is configured
4. Check network connectivity

### Issue: Application Process Errors

**Solution:**
1. Verify all 10 questions exist in `application_questions`
2. Check RLS policies on `application_responses`
3. Ensure user is authenticated
4. Check AsyncStorage permissions

### Issue: Photos Not Uploading

**Solution:**
1. Check camera/photo library permissions
2. Verify Supabase Storage bucket exists
3. Check storage RLS policies
4. Ensure proper file size limits

### Issue: Admin Panel Not Accessible

**Solution:**
1. Verify user exists in `admin_users` table
2. Check `active` is true for admin user
3. Verify RLS policies on admin tables
4. Ensure proper authentication

### Issue: Build Fails

**Solution:**
1. Clear all caches (see Step 1)
2. Remove node_modules and reinstall
3. Check for TypeScript errors
4. Verify all imports are correct
5. Check EAS build logs for specific errors

## 📊 Monitoring

### Key Metrics to Track

1. **User Acquisition**
   - New sign-ups per day
   - Application completion rate
   - Approval rate

2. **Technical Performance**
   - App crash rate
   - API response times
   - Photo upload success rate

3. **User Engagement**
   - Daily active users
   - Application abandonment rate
   - Time to complete application

### Logging

All errors are automatically logged to:
- Console (development)
- Sentry (production, if configured)
- Supabase logs (database operations)

## 🔄 Rollback Plan

If critical issues are discovered:

1. **Immediate Rollback**
   ```bash
   # Revert to previous build in TestFlight
   # Or deploy previous version:
   git checkout v1.0.2
   eas build --platform all --profile production
   ```

2. **Database Rollback**
   ```sql
   -- If needed, revert migrations
   -- Contact Supabase support for assistance
   ```

3. **Communication**
   - Notify users via in-app message
   - Send email to affected users
   - Post update on status page

## ✅ Success Criteria

Deployment is successful when:

- [ ] Build completes without errors
- [ ] App launches successfully on both platforms
- [ ] Intro video displays correctly
- [ ] Sign-in flow works end-to-end
- [ ] Application process completes successfully
- [ ] Photos upload without issues
- [ ] Admin panel is accessible and functional
- [ ] No critical errors in logs
- [ ] User feedback is positive

## 📞 Support Contacts

- **Expo Support:** https://expo.dev/support
- **Supabase Support:** https://supabase.com/support
- **App Store Connect:** https://developer.apple.com/contact/
- **Google Play Console:** https://support.google.com/googleplay/android-developer

## 🎉 Deployment Complete!

Once all checks pass:
1. Mark build as ready for production
2. Notify team of successful deployment
3. Monitor for first 24 hours
4. Gather user feedback
5. Plan next iteration

---

**Version:** 1.0.3 (Build 106)
**Deployment Date:** [To be filled]
**Deployed By:** [To be filled]
**Status:** ✅ Ready for Deployment
