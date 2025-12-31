
# 🧹 Cache Clear & Fresh Build Guide - Version 1.0.1

## ✅ Version Numbers Updated

- **App Version**: 1.0.0 → **1.0.1**
- **iOS Build Number**: 1.0.0 → **1.0.1**
- **Android Version Code**: 1 → **2**

## 🔧 Configuration Status

All configurations are set to **Update 93** specifications:

### ✅ Supabase Client (`app/integrations/supabase/client.ts`)
- Using `fetch.bind(globalThis)` (Update 93 configuration)
- AsyncStorage for session persistence
- Minimal configuration to prevent adapter errors

### ✅ Metro Config (`metro.config.js`)
- `unstable_enablePackageExports: true` enabled
- Proper condition names order for React Native
- Custom resolver for native-tabs.module.css

### ✅ Entry Points
- `index.ts`: URL polyfill imported first
- `app/_layout.tsx`: URL polyfill imported first

### ✅ EAS Build Config (`eas.json`)
- Production environment variables set
- Cache enabled for faster builds
- Auto-increment enabled for production builds

## 🧹 Cache Clearing Steps

### Step 1: Clear Local Development Caches

Run these commands in your terminal:

```bash
# Clear Expo cache
npx expo start --clear

# Clear Metro bundler cache
rm -rf node_modules/.cache/metro

# Clear watchman cache (if installed)
watchman watch-del-all

# Clear npm cache
npm cache clean --force

# Clear Expo cache directory
rm -rf ~/.expo/cache
```

### Step 2: Clean Node Modules

```bash
# Remove node_modules and package-lock
rm -rf node_modules
rm -f package-lock.json

# Reinstall dependencies
npm install
```

### Step 3: Clear iOS Build Cache (if applicable)

```bash
# Navigate to iOS folder (if it exists)
cd ios

# Clean build folder
rm -rf build
rm -rf Pods
rm -f Podfile.lock

# Reinstall pods
pod install

# Return to root
cd ..
```

### Step 4: Clear Android Build Cache (if applicable)

```bash
# Navigate to Android folder (if it exists)
cd android

# Clean Gradle cache
./gradlew clean
rm -rf .gradle
rm -rf build
rm -rf app/build

# Return to root
cd ..
```

### Step 5: Clear EAS Build Cache

```bash
# Clear EAS build cache
eas build:configure

# Or force a clean build by disabling cache temporarily
# (Already configured in eas.json with cache.disabled: false)
```

## 🚀 Build Commands

### For Development Testing

```bash
# Start with cleared cache
npm run dev
```

### For Production Build

```bash
# Build for both platforms
npm run build:production

# Or build individually
eas build --platform ios --profile production
eas build --platform android --profile production
```

### For Preview/TestFlight Build

```bash
npm run build:preview
```

## 📋 Pre-Build Checklist

Before running the production build, verify:

- [ ] All caches cleared (Steps 1-5 above)
- [ ] Dependencies reinstalled (`npm install`)
- [ ] Version numbers updated in `app.json`
- [ ] No local modifications to core files
- [ ] Supabase client using `fetch.bind(globalThis)`
- [ ] URL polyfill imported first in `index.ts` and `app/_layout.tsx`
- [ ] Metro config has `unstable_enablePackageExports: true`

## 🔍 Verification Steps

After building, verify the build works:

1. **Install on Device**: Install the build on a physical device
2. **Test Supabase Connection**: Try logging in/signing up
3. **Test Core Features**: Navigate through main app features
4. **Check Console**: Look for any adapter-related errors
5. **Test Offline**: Verify app works without internet

## 🐛 If Issues Persist

If you still encounter the `(h.adapter || o.adapter)` error:

1. **Verify fetch binding**: Check `app/integrations/supabase/client.ts` uses `fetch.bind(globalThis)`
2. **Check Metro config**: Ensure `unstable_enablePackageExports: true` is set
3. **Verify imports**: URL polyfill must be first import in entry files
4. **Clear ALL caches**: Run all cache clearing steps again
5. **Check EAS logs**: Review build logs for any warnings

## 📝 Notes

- This build uses the **exact configuration from Update 93** that was working
- No changes were made to the Supabase client configuration
- All environment variables are properly set in `eas.json`
- The `autoIncrement` feature in EAS will handle build number increments automatically

## 🎯 Expected Outcome

After following these steps, you should have:

- A clean build environment
- Version 1.0.1 ready for deployment
- All caches cleared
- Configuration matching Update 93 (the last working build)
- No adapter-related errors

## 🚨 Important Reminders

1. **Do NOT modify** `app/integrations/supabase/client.ts` - it's using the Update 93 configuration
2. **Do NOT change** the fetch binding from `fetch.bind(globalThis)`
3. **Do NOT remove** URL polyfill imports from entry files
4. **Do NOT disable** `unstable_enablePackageExports` in Metro config

---

**Build Version**: 1.0.1 (Update 96)  
**Configuration**: Update 93 (Stable)  
**Date**: Ready for deployment
