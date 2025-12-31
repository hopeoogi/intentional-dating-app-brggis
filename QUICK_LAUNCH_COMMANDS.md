
# Quick Launch Commands for TestFlight

## 🚀 Fast Track to TestFlight

Run these commands in order for a successful TestFlight launch:

### Step 1: Clear All Caches (CRITICAL)
```bash
# One-liner to clear everything
rm -rf node_modules/.cache/metro .expo dist .expo-shared ios/build android/build && watchman watch-del-all && npm cache clean --force
```

### Step 2: Fresh Install
```bash
# Remove and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Step 3: Local Test
```bash
# Test locally first
npm run clean
npm run ios
```

### Step 4: Build for TestFlight
```bash
# Build with cache clearing
eas build --platform ios --profile production --clear-cache
```

### Step 5: Submit to TestFlight
```bash
# Submit latest build
eas submit --platform ios --latest
```

## 🔍 Quick Verification

Before building, verify:
```bash
# Check versions
grep '"version"' package.json app.json
# Should show: 1.0.3 in both

# Check build numbers
grep 'buildNumber\|versionCode' app.json
# Should show: 4 for both

# Run linter
npm run lint
# Should pass with no errors
```

## ⚡ Emergency Reset

If something goes wrong:
```bash
# Nuclear option - reset everything
rm -rf node_modules package-lock.json .expo dist .expo-shared ios android
npm install
npx expo prebuild --clean
npm run clean
```

## 📋 Quick Checklist

- [ ] Cleared Metro cache
- [ ] Cleared Expo cache
- [ ] Cleared node_modules
- [ ] Fresh npm install
- [ ] Version is 1.0.3
- [ ] Build number is 4
- [ ] Lint passes
- [ ] Local test works
- [ ] EAS build with --clear-cache
- [ ] Submit to TestFlight

## 🎯 Expected Results

✅ Metro bundler starts clean
✅ No adapter errors in logs
✅ App launches successfully
✅ EAS build completes
✅ TestFlight upload succeeds

## ⚠️ Common Issues

### Issue: Metro cache not clearing
```bash
pkill -f metro
rm -rf node_modules/.cache
npm run clean
```

### Issue: Watchman errors
```bash
watchman watch-del-all
brew reinstall watchman  # if on Mac
```

### Issue: EAS build fails
```bash
# Try with explicit cache clear
eas build --platform ios --profile production --clear-cache --no-wait
```

## 📞 Need Help?

1. Check `CACHE_CLEAR_AND_BUILD.md` for detailed instructions
2. Check `TESTFLIGHT_LAUNCH_CHECKLIST_V3.md` for full checklist
3. Check `BUILD_60_SUMMARY.md` for what changed
4. Check `DEBUGGING_GUIDE.md` for troubleshooting

---

**Remember**: The key to success is clearing ALL caches before building!
