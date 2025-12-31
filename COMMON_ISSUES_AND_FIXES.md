
# Common Issues and Fixes - Intentional Dating App

## 🚨 App Crashes on Launch

### Symptom
App crashes immediately after opening from TestFlight.

### Possible Causes & Fixes

#### 1. Missing Provider Wrapper
**Error**: "useUser must be used within a UserProvider"
**Fix**: ✅ Already fixed - UserProvider added to app layout

#### 2. Splash Screen Issues
**Error**: App hangs on splash screen or crashes during hide
**Fix**: ✅ Already fixed - Using `SplashScreen.hide()` instead of `hideAsync()`

#### 3. AsyncStorage Race Condition
**Error**: App crashes during initial data load
**Fix**: ✅ Already fixed - Using `Promise.all()` and loading states

#### 4. Notification Permission Crash
**Error**: App crashes when requesting notification permissions
**Fix**: ✅ Already fixed - All notification code wrapped in try-catch

## 📱 Build Issues

### Issue: "Unable to resolve config plugin"
**Solution**: Remove the problematic plugin from `app.json` plugins array

### Issue: "Stripping types is currently unsupported"
**Solution**: This is a Node.js version issue. Ensure you're using Node 18 or 20.

### Issue: "API failed to sync"
**Solution**: 
1. Check your Apple Developer account credentials
2. Ensure certificates are valid
3. Try running `eas credentials` to reset

## 🔐 Authentication Issues

### Issue: Users can't sign in
**Checks**:
1. Verify Supabase URL and anon key are correct
2. Check if email confirmation is required
3. Verify RLS policies allow user access
4. Check network connectivity

### Issue: Session not persisting
**Fix**: Ensure AsyncStorage is properly configured in Supabase client

## 💾 Database Issues

### Issue: "permission denied for table"
**Fix**: Check RLS policies for the table
```sql
-- View policies for a table
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';

-- Enable RLS if not enabled
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- Add basic policy
CREATE POLICY "Users can view their own data" 
ON your_table_name FOR SELECT 
USING (auth.uid() = user_id);
```

### Issue: Slow queries
**Fix**: Add indexes
```sql
-- Add index on frequently queried columns
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_messages_match_id ON messages(match_id);
```

## 🔔 Notification Issues

### Issue: Push notifications not working
**Checks**:
1. Verify push notification entitlements in app.json
2. Check if user granted notification permissions
3. Verify Expo push token is being generated
4. Check if notifications are enabled in iOS Settings

### Issue: "Failed to get push token"
**Fix**: 
1. Ensure project ID is set in app.json
2. Check if running on physical device (not simulator for iOS)
3. Verify notification permissions are granted

## 🖼️ Image Upload Issues

### Issue: Images not uploading
**Checks**:
1. Verify camera/photo library permissions
2. Check Supabase storage bucket exists
3. Verify storage policies allow uploads
4. Check file size limits

### Issue: "Permission denied" on image upload
**Fix**: Add storage policy
```sql
-- Allow authenticated users to upload
CREATE POLICY "Users can upload their own images"
ON storage.objects FOR INSERT
WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
```

## 🎨 UI Issues

### Issue: Blank screen after splash
**Fix**: Check if components are waiting for data before rendering

### Issue: Tab bar not showing
**Fix**: Verify FloatingTabBar is rendered outside Stack navigator

### Issue: Modal not appearing
**Fix**: Check modal presentation style in Stack.Screen options

## 🌐 Network Issues

### Issue: "Network request failed"
**Checks**:
1. Verify internet connectivity
2. Check Supabase URL is correct
3. Verify API keys are valid
4. Check if RLS policies are blocking requests

### Issue: Slow API responses
**Fix**:
1. Add database indexes
2. Optimize queries (use select specific columns)
3. Implement caching
4. Use pagination for large datasets

## 📊 Performance Issues

### Issue: App feels sluggish
**Fixes**:
1. Use FlatList for long lists (not ScrollView)
2. Implement image caching
3. Reduce unnecessary re-renders (use React.memo)
4. Optimize database queries
5. Use loading skeletons

### Issue: High memory usage
**Fixes**:
1. Properly dispose of listeners
2. Clear image cache periodically
3. Limit number of images loaded at once
4. Use image compression

## 🔧 Development Issues

### Issue: Hot reload not working
**Fix**: 
```bash
# Clear Metro cache
npm start -- --reset-cache

# Or
expo start -c
```

### Issue: "Unable to resolve module"
**Fix**:
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm start -- --reset-cache
```

## 📱 Device-Specific Issues

### Issue: Works on simulator but not device
**Checks**:
1. Verify all permissions are granted on device
2. Check if device has internet connectivity
3. Verify certificates are valid for device
4. Check iOS version compatibility

### Issue: Works on iOS but not Android
**Checks**:
1. Verify Android permissions in app.json
2. Check if using iOS-specific APIs
3. Test on Android emulator
4. Check for platform-specific code

## 🚀 Deployment Issues

### Issue: Build fails on EAS
**Checks**:
1. Verify eas.json is properly configured
2. Check for TypeScript errors
3. Verify all dependencies are installed
4. Check EAS build logs for specific errors

### Issue: TestFlight upload fails
**Checks**:
1. Verify Apple Developer account is active
2. Check if app identifier is registered
3. Verify certificates are valid
4. Check if app version is incremented

## 🆘 Emergency Fixes

### If app is crashing in production:

1. **Immediate Action**:
   - Check App Store Connect crash logs
   - Identify the crash location
   - Determine affected iOS versions/devices

2. **Quick Fix**:
   - Implement error boundary around problematic component
   - Add try-catch to failing async operations
   - Add null checks for potentially undefined values

3. **Deploy Fix**:
   ```bash
   # Increment version
   # Fix the issue
   # Build and submit
   eas build --platform ios --profile production
   eas submit --platform ios
   ```

4. **Monitor**:
   - Watch crash reports for 24-48 hours
   - Verify crash rate decreases
   - Respond to user feedback

## 📞 Getting Help

### Resources
- **Expo Docs**: https://docs.expo.dev
- **Supabase Docs**: https://supabase.com/docs
- **React Native Docs**: https://reactnative.dev/docs
- **Expo Forums**: https://forums.expo.dev
- **Stack Overflow**: Tag with `expo`, `react-native`, `supabase`

### Debug Tools
- **Expo Dev Tools**: Run `expo start` and press `d`
- **React DevTools**: Install browser extension
- **Flipper**: For advanced debugging
- **Xcode Console**: For iOS-specific issues
- **Android Studio Logcat**: For Android-specific issues

### Logging Best Practices
```typescript
// Add detailed logging
console.log('Function started:', { param1, param2 });

try {
  // Your code
  console.log('Operation successful');
} catch (error) {
  console.error('Operation failed:', error);
  // Log additional context
  console.error('Context:', { userId, action, timestamp });
}
```

---

**Remember**: Most issues can be resolved by:
1. Reading error messages carefully
2. Checking logs (console, EAS, App Store Connect)
3. Verifying configuration files
4. Testing on physical devices
5. Consulting documentation
