
# Quick Deploy - Build 145

## One-Command Deploy
```bash
# Clear cache and build
npm run clear-cache && eas build --platform all --profile production
```

## Step-by-Step

### 1. Pre-Deploy
```bash
# Clear all caches
npm run clear-cache

# Verify changes
git status
```

### 2. Build
```bash
# Build for both platforms
eas build --platform all --profile production

# Or build individually
eas build --platform ios --profile production
eas build --platform android --profile production
```

### 3. Monitor
Watch for:
- ✅ `[Metro] Blocked module: axios`
- ✅ `[Supabase] Using native fetch API`
- ✅ Build completes successfully

### 4. Submit
```bash
# Submit to TestFlight
eas submit --platform ios --latest

# Submit to Play Store (when ready)
eas submit --platform android --latest
```

## Quick Test
After installing from TestFlight:

1. **Launch app** - Should show intro screen
2. **Wait 3 seconds** - Should navigate to signin
3. **Sign in** - Should work without errors
4. **Check console** - Should see no adapter errors

## Success Criteria
- ✅ No adapter errors
- ✅ No 500 errors
- ✅ App launches smoothly
- ✅ All features work

## If Issues Occur
1. Check build logs for errors
2. Verify axios is blocked
3. Clear caches and rebuild
4. Review Sentry for crashes

## Version
- **App:** 1.2.1
- **iOS:** 1.2.1
- **Android:** 17

---

**Ready to deploy!** 🚀
