
# Debugging Guide for Intentional Dating App

## 🔍 How to Debug Issues

### 1. Enable Console Logging

#### On iOS (Physical Device)
1. Connect device to Mac
2. Open Xcode
3. Go to Window > Devices and Simulators
4. Select your device
5. Click "Open Console"
6. Filter by "Intentional" or look for our log prefixes

#### On iOS (Simulator)
1. Run the app in simulator
2. Open Console.app on Mac
3. Filter by "Intentional"

#### On Android
1. Connect device via USB
2. Run `adb logcat | grep -i intentional`
3. Or use Android Studio's Logcat

### 2. Understanding Log Prefixes

Our app uses prefixed logs for easy filtering:

- `[App]` - App lifecycle events (startup, splash screen, etc.)
- `[Supabase]` - Database operations and connection status
- `[UserContext]` - User data loading and updates
- `[Notifications]` - Push notification setup and operations
- `[Subscriptions]` - Subscription and IAP operations

### 3. Common Issues and Solutions

#### Issue: App Crashes on Launch

**Symptoms:**
- App opens and immediately closes
- White screen then crash
- No UI appears

**Debug Steps:**
1. Check console logs for error messages
2. Look for the last log message before crash
3. Common causes:
   - Supabase initialization failure
   - AsyncStorage timeout
   - Font loading error
   - Notification setup error

**Solution:**
- All these issues should be fixed in v1.0.1
- If still occurring, check the specific error message
- Verify network connectivity
- Check device storage space

#### Issue: Supabase Connection Fails

**Symptoms:**
- Log shows: `[Supabase] Connection test failed`
- Data not loading
- Features not working

**Debug Steps:**
1. Check network connectivity
2. Verify Supabase URL is correct
3. Check API key is valid
4. Look for specific error message

**Solution:**
```
[Supabase] Connection test failed: <error message>
```
- If "network error" - check internet connection
- If "unauthorized" - check API key
- If "timeout" - check network speed

#### Issue: Notifications Not Working

**Symptoms:**
- No push notifications received
- Log shows: `[Notifications] Permission not granted`

**Debug Steps:**
1. Check notification permissions in Settings
2. Look for initialization logs
3. Verify push token was obtained

**Solution:**
- Grant notification permissions in Settings
- Restart app after granting permissions
- Check for: `[Notifications] Push token obtained successfully`

#### Issue: User Data Not Loading

**Symptoms:**
- Profile not showing
- Matches not loading
- Log shows: `[UserContext] Error loading user preferences`

**Debug Steps:**
1. Check AsyncStorage logs
2. Verify network connection
3. Check Supabase connection

**Solution:**
- Clear app data and restart
- Check network connectivity
- Verify Supabase is accessible

### 4. Crash Report Analysis

#### TestFlight Crash Reports

1. Go to App Store Connect
2. Select your app
3. Go to TestFlight > Crashes
4. Download crash report

#### Reading Crash Reports

Look for:
- **Exception Type:** What kind of error occurred
- **Exception Codes:** Specific error codes
- **Crashed Thread:** Which thread crashed
- **Stack Trace:** Where in the code it crashed

Common crash types:
- `EXC_BAD_ACCESS` - Memory access error
- `SIGABRT` - App was terminated
- `SIGSEGV` - Segmentation fault
- `NSInvalidArgumentException` - Invalid argument passed to method

### 5. Network Debugging

#### Check Supabase Connection

```javascript
// This runs automatically 3 seconds after app launch
// Look for these logs:
[Supabase] Connection test successful
// or
[Supabase] Connection test failed: <error>
```

#### Test API Calls

Use the Supabase dashboard to test queries:
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to SQL Editor
4. Run test queries

### 6. Storage Debugging

#### Check AsyncStorage

```javascript
// Logs to look for:
[UserContext] Loading user preferences...
[UserContext] Loaded subscription tier: basic
[UserContext] Loaded match filters
[UserContext] User preferences loaded successfully
```

#### Clear Storage (for testing)

On iOS:
1. Settings > General > iPhone Storage
2. Find "Intentional Dating"
3. Delete App (this clears all data)

On Android:
1. Settings > Apps > Intentional Dating
2. Storage > Clear Data

### 7. Performance Monitoring

#### Startup Time

Look for these logs in sequence:
```
[App] Preparing app...
[Supabase] Initializing client...
[UserContext] Loading user preferences...
[Notifications] Setting up notifications...
[App] App ready
[App] Splash screen hidden
```

Time between first and last log should be < 3 seconds.

#### Memory Usage

Use Xcode Instruments or Android Profiler to monitor:
- Memory usage
- CPU usage
- Network requests
- Disk I/O

### 8. Testing Scenarios

#### Test Fresh Install
```bash
# iOS
xcrun simctl uninstall booted com.anonymous.Natively
xcrun simctl install booted path/to/app.app

# Android
adb uninstall com.anonymous.Natively
adb install path/to/app.apk
```

#### Test Offline Mode
1. Enable airplane mode
2. Launch app
3. Verify offline functionality
4. Disable airplane mode
5. Verify data syncs

#### Test Permission Denials
1. Deny all permissions
2. Launch app
3. Verify app still works
4. Grant permissions one by one
5. Verify features enable

### 9. Common Error Messages

#### "Error loading user preferences"
- **Cause:** AsyncStorage timeout or error
- **Solution:** Clear app data, restart

#### "Connection test failed"
- **Cause:** Network issue or Supabase down
- **Solution:** Check network, verify Supabase status

#### "Permission not granted"
- **Cause:** User denied permission
- **Solution:** Grant permission in Settings

#### "Error setting up notifications"
- **Cause:** Notification setup failed
- **Solution:** Check permissions, restart app

### 10. Reporting Issues

When reporting an issue, include:

1. **Device Information:**
   - Device model (e.g., iPhone 14 Pro)
   - OS version (e.g., iOS 17.2)
   - App version (e.g., 1.0.1)

2. **Steps to Reproduce:**
   - What you did before the issue occurred
   - Exact sequence of actions

3. **Console Logs:**
   - Copy all logs from app launch to error
   - Include timestamps

4. **Screenshots/Videos:**
   - Visual evidence of the issue
   - Screen recordings if possible

5. **Crash Report:**
   - If app crashed, include crash report
   - Available in TestFlight or Xcode

### 11. Quick Fixes

#### App Won't Launch
1. Force quit app
2. Restart device
3. Reinstall app

#### Features Not Working
1. Check network connection
2. Check permissions
3. Clear app data
4. Restart app

#### Slow Performance
1. Close other apps
2. Restart device
3. Check available storage
4. Check network speed

### 12. Developer Tools

#### Useful Commands

```bash
# iOS - View logs
xcrun simctl spawn booted log stream --predicate 'processImagePath contains "Intentional"'

# Android - View logs
adb logcat | grep -i intentional

# iOS - Clear app data
xcrun simctl uninstall booted com.anonymous.Natively

# Android - Clear app data
adb shell pm clear com.anonymous.Natively

# Check app is installed
# iOS
xcrun simctl listapps booted | grep Natively

# Android
adb shell pm list packages | grep natively
```

## 📞 Need Help?

If you're still stuck after following this guide:

1. Check TESTFLIGHT_CRASH_FIX_V2.md for detailed fix information
2. Review SUBMISSION_READY_V2.md for submission status
3. Check PRE_SUBMISSION_CHECKLIST_V2.md for testing checklist

---

**Remember:** All critical issues have been fixed in v1.0.1. If you encounter new issues, they are likely edge cases that can be addressed with targeted fixes.
