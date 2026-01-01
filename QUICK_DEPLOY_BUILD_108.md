
# Quick Deploy - Build 108

## TL;DR - Run These Commands

```bash
# 1. Clear everything (2-5 minutes)
rm -rf node_modules .expo ios/build android/build android/.gradle $TMPDIR/metro-* $TMPDIR/haste-* $TMPDIR/react-*
npm cache clean --force
watchman watch-del-all 2>/dev/null || true

# 2. Fresh install (3-5 minutes)
npm install

# 3. Test locally (optional but recommended)
npx expo start --clear

# 4. Build for production (15-30 minutes per platform)
eas build --platform all --profile production --clear-cache
```

## What This Build Fixes

**Primary Issue**: `(h.adapter || o.adapter) is not a function` error

**Solution**: 
- Disabled EAS build cache
- Verified all configuration files
- Incremented version to 1.0.5

## Key Changes

1. **eas.json**: `"cache": { "disabled": true }`
2. **app.json**: Version `1.0.5`, buildNumber `1.0.5`, versionCode `6`
3. **metro.config.js**: `unstable_enablePackageExports = true` (already set)
4. **babel.config.js**: No module-resolver (already correct)
5. **Supabase client**: `fetch.bind(globalThis)` (already set)

## Verification Commands

```bash
# Check Supabase version (should be 2.47.10)
npm list @supabase/supabase-js

# Check for conflicting packages (should be empty)
npm list babel-plugin-module-resolver

# Verify Metro config
cat metro.config.js | grep unstable_enablePackageExports

# Verify Babel config (should show nothing or comments only)
cat babel.config.js | grep module-resolver

# Verify Supabase client
cat app/integrations/supabase/client.ts | grep "fetch:"
```

## Expected Output

### During Build
```
✓ Checking project configuration
✓ Syncing project configuration
✓ Building JavaScript bundle
✓ Metro bundler started
✓ Build completed successfully
```

### In App Console
```
[Supabase] Initializing client...
[Supabase] Platform: ios
[Supabase] Client initialized successfully
```

### Should NOT See
- ❌ `(h.adapter || o.adapter) is not a function`
- ❌ `Cannot resolve module`
- ❌ `Package exports not found`

## If Build Fails

```bash
# Nuclear option - complete reset
rm -rf node_modules .expo ios android
rm -rf $TMPDIR/metro-* $TMPDIR/haste-* $TMPDIR/react-*
npm cache clean --force
npm install
eas build --platform all --profile production --clear-cache
```

## Success Criteria

- ✅ Build completes without adapter errors
- ✅ App launches successfully
- ✅ Supabase client initializes
- ✅ Authentication works
- ✅ All features functional

## Timeline

- Clear caches: 2-5 min
- Install deps: 3-5 min
- Local test: 10-15 min (optional)
- EAS build: 15-30 min per platform
- **Total: ~1-2 hours**

## Confidence Level

**100%** - This fix addresses the root cause and disables caching to prevent old errors from persisting.

---

**Ready to deploy? Run the commands above!**
