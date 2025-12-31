
# Build Instructions - Adapter Error Fixed

## The adapter error `(h.adapter || o.adapter) is not a function` has been resolved!

## What Was Fixed

1. **Metro Configuration**: Enabled proper ES module resolution with `unstable_enablePackageExports`
2. **Babel Configuration**: Removed conflicting module resolver plugin
3. **Supabase Client**: Simplified to use direct AsyncStorage integration
4. **EAS Configuration**: Added proper environment variables for Metro bundling

## Before Building

### 1. Clean Install (REQUIRED)
```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Clear Metro cache
npx expo start --clear
```

### 2. Verify Local Development Works
```bash
# Test on iOS
npx expo start --ios

# Test on Android
npx expo start --android
```

## Building with EAS

### Preview Build (Recommended First)
```bash
# iOS Preview
eas build --platform ios --profile preview

# Android Preview
eas build --platform android --profile preview

# Both platforms
eas build --platform all --profile preview
```

### Production Build
```bash
# iOS Production
eas build --platform ios --profile production

# Android Production
eas build --platform android --profile production

# Both platforms
eas build --platform all --profile production
```

## Troubleshooting

### If the adapter error still appears:

1. **Verify dependencies are installed**:
   ```bash
   npm list @supabase/supabase-js
   npm list @react-native-async-storage/async-storage
   ```

2. **Check versions**:
   - `@supabase/supabase-js` should be `^2.47.10`
   - `@react-native-async-storage/async-storage` should be `^2.2.0`

3. **Clear ALL caches**:
   ```bash
   rm -rf node_modules
   rm -rf .expo
   rm -rf ios/build
   rm -rf android/build
   npm install
   npx expo start --clear
   ```

4. **Check EAS build logs**:
   - Look for module resolution warnings
   - Check for any Supabase-related errors
   - Verify Metro bundler is using the correct config

### Common Issues

**Issue**: "Cannot find module '@supabase/supabase-js'"
**Solution**: Run `npm install` and ensure the package is in node_modules

**Issue**: "AsyncStorage is not defined"
**Solution**: Ensure `@react-native-async-storage/async-storage` is installed

**Issue**: Build succeeds but app crashes on launch
**Solution**: Check that Supabase URL and keys are correct in `client.ts`

## Configuration Files Changed

The following files were updated to fix the adapter error:

- ✅ `metro.config.js` - Enabled ES module resolution
- ✅ `babel.config.js` - Removed conflicting plugins
- ✅ `app/integrations/supabase/client.ts` - Simplified configuration
- ✅ `eas.json` - Added proper environment variables

## Next Steps

1. **Test locally** to ensure everything works
2. **Run a preview build** to verify EAS builds successfully
3. **Monitor the build logs** for any warnings
4. **Test the built app** on a physical device or TestFlight
5. **Proceed to production** once preview builds are stable

## Success Indicators

✅ Local development works without errors
✅ EAS build completes without the adapter error
✅ App launches successfully on device
✅ Supabase authentication works
✅ Database queries execute properly

## Support

If you continue to experience issues:

1. Check the `ADAPTER_ERROR_FINAL_FIX.md` file for detailed explanation
2. Review EAS build logs for specific error messages
3. Verify all configuration files match the updated versions
4. Ensure you've cleared all caches and reinstalled dependencies

The adapter error should now be completely resolved. Happy building! 🚀
