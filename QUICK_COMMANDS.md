
# Quick Command Reference

## 🧹 Clear Cache & Rebuild

### Option 1: Quick Clear (Recommended)
```bash
# Clear Expo cache and restart
npx expo start --clear
```

### Option 2: Deep Clean
```bash
# Remove all caches and dependencies
rm -rf node_modules
rm -rf .expo
rm -rf ios/build
rm -rf android/build
rm -rf android/.gradle

# Reinstall dependencies
npm install

# Start with clean cache
npx expo start --clear
```

### Option 3: Nuclear Option (If nothing else works)
```bash
# Remove everything
rm -rf node_modules
rm -rf .expo
rm -rf ios
rm -rf android
rm -rf package-lock.json
rm -rf yarn.lock

# Reinstall
npm install

# Regenerate native folders
npx expo prebuild --clean

# Start fresh
npx expo start --clear
```

## 🚀 Build Commands

### Development Build
```bash
# Start development server
npx expo start

# Start with tunnel (for testing on external devices)
npx expo start --tunnel

# Start with clear cache
npx expo start --clear
```

### Production Build (EAS)

#### iOS
```bash
# Build for iOS
eas build --platform ios --profile production

# Build for iOS simulator (testing)
eas build --platform ios --profile preview
```

#### Android
```bash
# Build for Android
eas build --platform android --profile production

# Build APK for testing
eas build --platform android --profile preview
```

#### Both Platforms
```bash
# Build for both iOS and Android
eas build --platform all --profile production
```

### Submit to Stores

#### iOS App Store
```bash
# Submit to App Store
eas submit --platform ios
```

#### Google Play Store
```bash
# Submit to Play Store
eas submit --platform android
```

## 🧪 Testing Commands

### Run on Simulator/Emulator
```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Web browser
npx expo start --web
```

### Type Checking
```bash
# Check TypeScript types
npm run typecheck
```

### Linting
```bash
# Run ESLint
npm run lint
```

## 📦 Dependency Management

### Install New Package
```bash
# Install a package
npm install package-name

# Install dev dependency
npm install --save-dev package-name
```

### Update Packages
```bash
# Update all packages
npm update

# Update specific package
npm update package-name

# Check for outdated packages
npm outdated
```

### Remove Package
```bash
# Remove a package
npm uninstall package-name
```

## 🗄️ Database Commands

### Supabase CLI (if installed)
```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database
supabase db reset

# Generate TypeScript types
supabase gen types typescript --project-id plnfluykallohjimxnja > app/integrations/supabase/types.ts
```

## 🔍 Debugging Commands

### View Logs
```bash
# View Metro bundler logs
npx expo start --clear

# View device logs (iOS)
npx react-native log-ios

# View device logs (Android)
npx react-native log-android
```

### Inspect Bundle
```bash
# Analyze bundle size
npx expo export --dump-sourcemap

# Check bundle contents
npx expo export --dev
```

## 🛠️ Troubleshooting Commands

### Fix Common Issues
```bash
# Fix Metro bundler issues
npx expo start --clear

# Fix iOS pods
cd ios && pod install && cd ..

# Fix Android Gradle
cd android && ./gradlew clean && cd ..

# Reset Expo cache
npx expo start --clear --reset-cache
```

### Check Environment
```bash
# Check Expo version
npx expo --version

# Check Node version
node --version

# Check npm version
npm --version

# Check EAS CLI version
eas --version
```

## 📱 Device Testing

### Install on Device
```bash
# Install on connected iOS device
npx expo run:ios --device

# Install on connected Android device
npx expo run:android --device
```

### QR Code Testing
```bash
# Start with tunnel for external testing
npx expo start --tunnel

# Scan QR code with Expo Go app
```

## 🔐 Environment Variables

### Set Environment Variables
```bash
# Development
export EXPO_PUBLIC_SUPABASE_URL="your-url"
export EXPO_PUBLIC_SUPABASE_ANON_KEY="your-key"

# Or create .env file
echo "EXPO_PUBLIC_SUPABASE_URL=your-url" > .env
echo "EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key" >> .env
```

## 📊 Performance Commands

### Profile App
```bash
# Start with performance monitoring
npx expo start --dev-client

# Generate performance report
npx expo export --dump-sourcemap
```

### Optimize Bundle
```bash
# Production build (optimized)
eas build --platform all --profile production

# Check bundle size
npx expo export --dump-sourcemap
```

## 🎯 Quick Workflows

### Daily Development
```bash
# 1. Pull latest code
git pull

# 2. Install any new dependencies
npm install

# 3. Start development server
npx expo start --clear
```

### Before Committing
```bash
# 1. Check types
npm run typecheck

# 2. Run linter
npm run lint

# 3. Test on device
npx expo start --clear
```

### Before Deploying
```bash
# 1. Clear everything
rm -rf node_modules .expo
npm install

# 2. Test thoroughly
npx expo start --clear

# 3. Build for production
eas build --platform all --profile production

# 4. Submit to stores
eas submit --platform all
```

## 🆘 Emergency Commands

### App Won't Start
```bash
# Try these in order:
npx expo start --clear
npx expo start --clear --reset-cache
rm -rf node_modules && npm install && npx expo start --clear
```

### Build Failing
```bash
# Clear EAS build cache
eas build --clear-cache --platform all

# Or rebuild from scratch
rm -rf node_modules
npm install
eas build --platform all --profile production
```

### Database Issues
```bash
# Check Supabase status
curl https://plnfluykallohjimxnja.supabase.co/rest/v1/

# Test database connection
# (Run in Supabase SQL Editor)
SELECT 1;
```

## 📝 Useful Aliases

Add these to your `.bashrc` or `.zshrc`:

```bash
# Expo shortcuts
alias expo-start="npx expo start --clear"
alias expo-clean="rm -rf node_modules .expo && npm install"
alias expo-build="eas build --platform all --profile production"

# Git shortcuts
alias gs="git status"
alias ga="git add ."
alias gc="git commit -m"
alias gp="git push"

# npm shortcuts
alias ni="npm install"
alias nu="npm update"
alias nr="npm run"
```

---

**Pro Tip**: Bookmark this file for quick reference during development!

**Most Used Commands**:
1. `npx expo start --clear` - Start development
2. `eas build --platform all --profile production` - Build for production
3. `rm -rf node_modules && npm install` - Fix dependency issues
4. `npx expo start --tunnel` - Test on external devices
