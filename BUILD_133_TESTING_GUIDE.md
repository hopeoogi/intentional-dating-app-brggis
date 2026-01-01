
# Build 133 (v1.1.4) - Testing Guide

## 🎯 What We Fixed

### Critical Issue
The app was immediately showing the "Oops! Something went wrong" error screen after launch due to:
1. Infinite recursion in `is_active_admin()` database function
2. 500 errors when querying `app_settings` table
3. Insufficient error logging

### The Fix
- Added `SECURITY DEFINER` to `is_active_admin()` function
- Enhanced error handling and logging throughout the app
- Added timeout protection for database queries

## 📋 Testing Checklist

### Phase 1: Database Verification

#### Test 1: Verify Function Fix
```sql
-- Run in Supabase SQL Editor
SELECT prosecdef FROM pg_proc WHERE proname = 'is_active_admin';
```
**Expected:** Returns `true` (function has SECURITY DEFINER)

#### Test 2: Test Function Execution
```sql
-- Should execute without errors
SELECT is_active_admin('00000000-0000-0000-0000-000000000000');
```
**Expected:** Returns `false` without any errors

#### Test 3: Test App Settings Query
```sql
-- This was causing 500 errors before
SELECT setting_key, setting_value 
FROM app_settings 
WHERE setting_key = 'intro_video';
```
**Expected:** Returns the intro video settings without errors

### Phase 2: App Launch Testing

#### Test 4: Cold Launch
1. **Action:** Force quit the app completely
2. **Action:** Launch the app fresh
3. **Expected:** 
   - No "Oops! Something went wrong" screen
   - Intro video displays (or skips if disabled)
   - App navigates to appropriate screen

#### Test 5: Console Logs
1. **Action:** Launch app with console open
2. **Expected Logs:**
   ```
   [Supabase] Initializing client...
   [Supabase] Client initialized successfully
   [IntroVideo] Loading intro settings...
   [IntroVideo] Settings loaded successfully
   [IntroVideo] Navigating to next screen...
   ```
3. **Should NOT see:**
   - Any error messages
   - "500" errors
   - "infinite recursion" errors

### Phase 3: Navigation Flow Testing

#### Test 6: Unauthenticated User Flow
1. **Action:** Launch app (not signed in)
2. **Expected Flow:**
   - Intro video → Sign in screen
3. **Verify:** No crashes, smooth navigation

#### Test 7: Authenticated User Flow (Incomplete Onboarding)
1. **Action:** Sign in with account that hasn't completed onboarding
2. **Expected Flow:**
   - Intro video → Application screen or Pending screen
3. **Verify:** Correct routing based on application status

#### Test 8: Authenticated User Flow (Complete Onboarding)
1. **Action:** Sign in with fully onboarded account
2. **Expected Flow:**
   - Intro video → Home screen with matches
3. **Verify:** Home screen loads correctly

### Phase 4: Error Handling Testing

#### Test 9: Network Offline
1. **Action:** Turn off device network
2. **Action:** Launch app
3. **Expected:** 
   - App should handle gracefully
   - Should show offline message or skip intro
   - Should not crash

#### Test 10: Slow Network
1. **Action:** Use network throttling (slow 3G)
2. **Action:** Launch app
3. **Expected:**
   - Timeout protection kicks in after 10 seconds
   - App navigates to next screen
   - No indefinite hanging

### Phase 5: Supabase Logs Verification

#### Test 11: Check API Logs
1. **Action:** Go to Supabase Dashboard → Logs → API
2. **Action:** Launch app multiple times
3. **Expected:**
   - All requests return 200 status
   - NO 500 errors for `app_settings`
   - Successful queries visible

#### Test 12: Check Auth Logs
1. **Action:** Go to Supabase Dashboard → Logs → Auth
2. **Action:** Sign in/out multiple times
3. **Expected:**
   - Successful auth operations
   - No errors

## 🐛 Known Issues to Watch For

### Issue 1: Intro Video Not Loading
**Symptoms:** Blank screen or immediate skip
**Check:** 
- Verify `app_settings` has intro_video entry
- Check if `enabled: true` in settings
- Verify URL is accessible

### Issue 2: Navigation Loop
**Symptoms:** App keeps redirecting
**Check:**
- User's `onboarding_complete` status
- Pending user status
- Auth session validity

### Issue 3: Slow Initial Load
**Symptoms:** Long delay before intro video
**Check:**
- Network speed
- Supabase response times
- Console for timeout messages

## ✅ Success Criteria

### Must Pass
- [ ] No "Oops! Something went wrong" screen on launch
- [ ] No 500 errors in Supabase logs
- [ ] Intro video displays or skips gracefully
- [ ] Navigation works for all user states
- [ ] No console errors

### Should Pass
- [ ] App launches in under 3 seconds
- [ ] Smooth transitions between screens
- [ ] Proper error messages if network issues
- [ ] Logs are clear and helpful

### Nice to Have
- [ ] Intro video plays smoothly
- [ ] No lag or stuttering
- [ ] Professional user experience

## 🔧 Debugging Tools

### Console Logs
Look for these key log patterns:
```
✅ Good: [Supabase] Client initialized successfully
✅ Good: [IntroVideo] Settings loaded successfully
❌ Bad: ERROR: infinite recursion
❌ Bad: 500 Internal Server Error
```

### Supabase Dashboard
- **API Logs:** Check for 500 errors
- **Auth Logs:** Verify authentication works
- **Database:** Query tables directly to verify data

### Device Logs
- **iOS:** Xcode Console or Console.app
- **Android:** Android Studio Logcat

## 📊 Test Results Template

```
Build: 1.1.4 (133)
Date: ___________
Tester: ___________

Phase 1 - Database: ✅ / ❌
Phase 2 - App Launch: ✅ / ❌
Phase 3 - Navigation: ✅ / ❌
Phase 4 - Error Handling: ✅ / ❌
Phase 5 - Supabase Logs: ✅ / ❌

Critical Issues Found: ___________
Minor Issues Found: ___________
Overall Status: PASS / FAIL

Notes:
___________
```

## 🚀 Ready for Production?

### Checklist
- [ ] All Phase 1-5 tests pass
- [ ] No critical issues found
- [ ] Supabase logs clean
- [ ] Multiple testers verified
- [ ] Different devices tested
- [ ] Both iOS and Android tested (if applicable)

---

**Good luck with testing!** 🎉
