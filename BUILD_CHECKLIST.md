
# Pre-Build Checklist - Prevent "(h.adapter || o.adapter) is not a function" Error

## Before Every EAS Build

### 1. Clear All Caches ✓
```bash
# Clear Metro cache
rm -rf node_modules/.cache

# Clear Expo cache
expo start -c
# Press Ctrl+C after it starts

# Or simply run
npm run dev
# Then press Ctrl+C
```

### 2. Verify Configuration Files ✓

#### `metro.config.js` must have:
```javascript
config.resolver.unstable_enablePackageExports = true;
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];
```

#### `eas.json` must have in ALL profiles:
```json
"env": {
  "EXPO_NO_METRO_LAZY": "1"
}
```

#### `babel.config.js` must include in extensions:
```javascript
extensions: [
  ".ios.ts", ".android.ts", ".ts",
  ".ios.tsx", ".android.tsx", ".tsx",
  ".jsx", ".js", ".json",
  ".cjs", ".mjs"  // These are critical!
]
```

### 3. Dependency Check ✓
```bash
# Verify all dependencies are installed
npm install

# Check for any peer dependency warnings
npm list
```

### 4. Local Test ✓
```bash
# Test on iOS simulator/device
npm run ios

# Test on Android emulator/device
npm run android

# Verify no runtime errors
```

### 5. Build Command ✓
```bash
# For iOS production
eas build --platform ios --profile production

# For iOS preview (TestFlight)
eas build --platform ios --profile preview

# For Android production
eas build --platform android --profile production
```

## Quick Troubleshooting

### If build fails with adapter error:

1. **Did you clear caches?** → Run `expo start -c`
2. **Did you reinstall dependencies?** → Run `rm -rf node_modules && npm install`
3. **Is `unstable_enablePackageExports` enabled?** → Check `metro.config.js`
4. **Is `EXPO_NO_METRO_LAZY` set?** → Check `eas.json`
5. **Are `.cjs` and `.mjs` in extensions?** → Check `babel.config.js`

### If app crashes after successful build:

1. Check TestFlight crash logs in App Store Connect
2. Verify Supabase credentials are correct
3. Check that all required permissions are in `app.json`
4. Ensure error boundaries are in place

## Success Indicators

✅ Build completes without "adapter" errors
✅ No module resolution warnings in build logs
✅ App launches successfully on device
✅ Supabase client initializes without errors
✅ All features work as expected

## Emergency Rollback

If all else fails:
1. Revert to last known working commit
2. Clear all caches
3. Reinstall dependencies
4. Build again

## Support Resources

- EAS Build Logs: Check in Expo dashboard
- Supabase Status: https://status.supabase.com
- Expo Status: https://status.expo.dev
- Documentation: See `EAS_BUILD_FIX.md`
