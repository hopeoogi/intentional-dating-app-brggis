
# Testing Guide - Build 137

## 🎯 What to Test

This build fixes the critical database connection issue that was causing the "Oops!" error screen. Here's what you need to test to ensure everything works correctly.

## 🧪 Test Scenarios

### 1. Fresh Install (New User)
**Steps**:
1. Install app from TestFlight
2. Launch app for the first time
3. Observe intro screen

**Expected Behavior**:
- ✅ App launches successfully
- ✅ Intro image displays (couple holding hands)
- ✅ "Intentional" branding visible
- ✅ "Where connections matter" tagline visible
- ✅ Skip button appears after 2 seconds
- ✅ After 3 seconds (or skip), navigates to sign-in screen
- ❌ NO "Oops!" error screen

**What to Check**:
- [ ] No crash on launch
- [ ] No "Oops!" error
- [ ] Intro image loads
- [ ] Skip button appears
- [ ] Navigation works

### 2. Existing User (Already Signed In)
**Steps**:
1. Launch app (already signed in)
2. Observe intro screen

**Expected Behavior**:
- ✅ App launches successfully
- ✅ Intro image displays
- ✅ Skip button appears after 2 seconds
- ✅ After 3 seconds (or skip), navigates to home screen
- ❌ NO "Oops!" error screen

**What to Check**:
- [ ] No crash on launch
- [ ] No "Oops!" error
- [ ] Navigates to correct screen (home, not sign-in)

### 3. Pending Application User
**Steps**:
1. Launch app (user has pending application)
2. Observe intro screen

**Expected Behavior**:
- ✅ App launches successfully
- ✅ Intro image displays
- ✅ Skip button appears after 2 seconds
- ✅ After 3 seconds (or skip), navigates to "Application Pending" screen
- ❌ NO "Oops!" error screen

**What to Check**:
- [ ] No crash on launch
- [ ] No "Oops!" error
- [ ] Navigates to pending screen

### 4. Skip Button Test
**Steps**:
1. Launch app
2. Wait for skip button to appear (2 seconds)
3. Tap skip button

**Expected Behavior**:
- ✅ Skip button appears after 2 seconds
- ✅ Button is tappable
- ✅ Immediately navigates to next screen
- ✅ No delay or hang

**What to Check**:
- [ ] Skip button visible
- [ ] Skip button works
- [ ] Immediate navigation

### 5. Network Error Test
**Steps**:
1. Turn off WiFi and cellular data
2. Launch app
3. Observe behavior

**Expected Behavior**:
- ✅ App launches successfully
- ✅ Shows branded splash screen (no image)
- ✅ "Intentional" branding visible
- ✅ Skip button appears after 2 seconds
- ✅ After 3 seconds (or skip), navigates to sign-in screen
- ❌ NO "Oops!" error screen

**What to Check**:
- [ ] No crash on launch
- [ ] No "Oops!" error
- [ ] Graceful degradation
- [ ] Navigation still works

### 6. Slow Network Test
**Steps**:
1. Enable slow network simulation (if possible)
2. Launch app
3. Observe behavior

**Expected Behavior**:
- ✅ App launches successfully
- ✅ Loading indicator appears
- ✅ Intro image loads (may take longer)
- ✅ Skip button appears after 2 seconds
- ✅ Navigation works correctly
- ❌ NO "Oops!" error screen

**What to Check**:
- [ ] No crash on launch
- [ ] No "Oops!" error
- [ ] Loading indicator visible
- [ ] Eventually loads or times out gracefully

## 📊 Database Verification

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Navigate to Logs → API Logs
3. Filter for `/rest/v1/app_settings`

**Expected Results**:
- ✅ All requests return 200 OK
- ❌ NO 500 errors
- ✅ Requests complete in < 1 second

**How to Check**:
```
https://supabase.com/dashboard/project/plnfluykallohjimxnja/logs/explorer
```

Filter:
```
path = '/rest/v1/app_settings'
```

### Verify RLS Policies
```sql
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'app_settings' 
ORDER BY policyname;
```

**Expected Policies**:
1. ✅ "Admins can view all settings" (SELECT)
2. ✅ "Anyone can view intro video settings" (SELECT)
3. ✅ "Authenticated users can view intro video settings" (SELECT)
4. ✅ "Authenticated admins can delete settings" (DELETE)
5. ✅ "Authenticated admins can insert settings" (INSERT)
6. ✅ "Authenticated admins can update settings" (UPDATE)

## 🔍 Console Logs to Monitor

### Successful Launch Logs
```
[App] Starting app initialization...
[Supabase] Initializing client...
[Supabase] Client initialized successfully
[IntroVideo] Loading intro settings...
[IntroVideo] Supabase client initialized: true
[IntroVideo] Settings loaded successfully: { enabled: true, hasUrl: true, duration: 3000 }
[IntroVideo] Media type: image
[IntroVideo] Showing image for 3000 ms
[IntroVideo] Navigating to next screen...
```

### Error Logs to Watch For (Should NOT Appear)
```
❌ [IntroVideo] Error loading intro settings
❌ [IntroVideo] Error code: 500
❌ ERROR BOUNDARY CAUGHT AN ERROR
❌ Oops! Something went wrong
```

## 📱 Device Testing

### iOS Devices
Test on:
- [ ] iPhone 15 Pro (latest)
- [ ] iPhone 14 (common)
- [ ] iPhone SE (small screen)
- [ ] iPad (tablet)

### iOS Versions
Test on:
- [ ] iOS 18.x (latest)
- [ ] iOS 17.x (common)
- [ ] iOS 16.x (minimum supported)

## ⏱️ Performance Testing

### Launch Time
**Expected**:
- Cold launch: < 3 seconds to intro screen
- Warm launch: < 1 second to intro screen

**How to Test**:
1. Force quit app
2. Launch app
3. Time until intro screen appears

### Intro Duration
**Expected**:
- Image displays for 3 seconds
- Skip button appears after 2 seconds
- Total time: 3 seconds (or less if skipped)

**How to Test**:
1. Launch app
2. Don't tap skip
3. Time until navigation

### Database Query Time
**Expected**:
- Query completes in < 1 second
- Timeout at 10 seconds

**How to Check**:
- Monitor Supabase logs for query duration
- Check console logs for timing

## 🐛 Known Issues (Should Be Fixed)

### Before Build 137
- ❌ "Oops!" error screen on launch
- ❌ 500 errors in database logs
- ❌ App stuck, can't proceed
- ❌ Intro video never plays

### After Build 137
- ✅ No "Oops!" error screen
- ✅ No 500 errors in database logs
- ✅ App navigates correctly
- ✅ Intro image displays

## 📋 Test Checklist

### Critical Tests (Must Pass)
- [ ] App launches without "Oops!" error
- [ ] Intro screen displays
- [ ] Skip button works
- [ ] Navigation to sign-in works
- [ ] No 500 errors in Supabase logs

### Important Tests (Should Pass)
- [ ] Works on slow network
- [ ] Works offline (shows splash)
- [ ] Works for new users
- [ ] Works for existing users
- [ ] Works for pending users

### Nice to Have Tests (Optional)
- [ ] Launch time < 3 seconds
- [ ] Smooth animations
- [ ] Skip button appears exactly at 2 seconds
- [ ] Image loads quickly

## 🆘 If Tests Fail

### "Oops!" Error Still Appears
1. Check Supabase logs for 500 errors
2. Verify RLS policies are correct
3. Test database query manually
4. Check app console logs

**Command to Test Database**:
```bash
curl -X GET 'https://plnfluykallohjimxnja.supabase.co/rest/v1/app_settings?select=setting_value&setting_key=eq.intro_video' \
  -H "apikey: YOUR_ANON_KEY"
```

### Intro Image Doesn't Load
1. Check network connectivity
2. Verify image URL is accessible
3. Check console logs for errors
4. Test with different network conditions

### Skip Button Doesn't Appear
1. Check if 2-second timer is working
2. Verify button styling
3. Check for layout issues
4. Review console logs

### Navigation Doesn't Work
1. Check user authentication state
2. Verify onboarding status
3. Check pending application status
4. Review navigation logs

## 📞 Reporting Issues

If you find any issues, please report:
1. **Device**: iPhone model and iOS version
2. **Steps**: Exact steps to reproduce
3. **Expected**: What should happen
4. **Actual**: What actually happened
5. **Logs**: Console logs if available
6. **Screenshots**: Screenshots of the issue

## ✅ Success Criteria

The build is successful if:
1. ✅ No "Oops!" error screen on launch
2. ✅ Intro image displays correctly
3. ✅ Skip button appears and works
4. ✅ Navigation works for all user types
5. ✅ No 500 errors in Supabase logs
6. ✅ App is stable and doesn't crash

## 🎉 Expected Outcome

After thorough testing, you should see:
- Smooth app launch
- Beautiful intro screen
- Functional skip button
- Correct navigation
- No errors or crashes
- Happy users! 😊

---

**Ready to test? Let's go! 🚀**
