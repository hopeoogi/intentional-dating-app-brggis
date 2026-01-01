
# Quick Deploy Commands - Intentional Dating App

## 🚀 Complete Deployment Workflow

### 1. Pre-Deployment Cleanup
```bash
# Clear all caches
npm cache clean --force
rm -rf .expo
rm -rf node_modules/.cache
rm -rf /tmp/metro-*
rm -rf /tmp/haste-*
watchman watch-del-all 2>/dev/null || true

# Reinstall dependencies
rm -rf node_modules
npm install
```

### 2. Verify Code Quality
```bash
# Run linter
npm run lint

# Run type checker
npm run typecheck
```

### 3. Test Locally
```bash
# Start development server
npm run dev

# Or with specific platform
npm run ios
npm run android
```

### 4. Build for Preview (Recommended First)
```bash
# Build preview version for testing
npm run build:preview

# Or using EAS directly
eas build --platform all --profile preview
```

### 5. Build for Production
```bash
# Build production version
npm run build:production

# Or using EAS directly
eas build --platform all --profile production

# Build specific platform
eas build --platform ios --profile production
eas build --platform android --profile production
```

## 📱 Platform-Specific Commands

### iOS Only
```bash
# Preview build
eas build --platform ios --profile preview

# Production build
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

### Android Only
```bash
# Preview build
eas build --platform android --profile preview

# Production build
eas build --platform android --profile production

# Submit to Play Store
eas submit --platform android
```

## 🔍 Monitoring and Debugging

### Check Build Status
```bash
# List all builds
eas build:list

# View specific build
eas build:view [build-id]

# View latest build
eas build:view --latest
```

### Check Build Logs
```bash
# View logs for specific build
eas build:view [build-id] --logs

# Follow logs in real-time
eas build:view [build-id] --logs --follow
```

### Check Project Configuration
```bash
# View current Expo configuration
npx expo config

# View EAS configuration
eas config
```

## 🛠️ Troubleshooting Commands

### Clear Metro Bundler Cache
```bash
npm run clear-cache
# Or manually
expo start --clear
```

### Reset Everything
```bash
# Nuclear option - reset everything
rm -rf node_modules
rm -rf .expo
rm -rf ios
rm -rf android
npm cache clean --force
npm install
```

### Check for Updates
```bash
# Update Expo CLI
npm install -g expo-cli@latest

# Update EAS CLI
npm install -g eas-cli@latest

# Update project dependencies
npx expo install --fix
```

## 📊 Version Management

### Increment Version
```bash
# Update version in app.json (manual)
# version: "1.0.7" -> "1.0.8"
# ios.buildNumber: "1.0.7" -> "1.0.8"
# android.versionCode: 8 -> 9

# Update version in package.json (manual)
# "version": "1.0.7" -> "1.0.8"
```

### Check Current Version
```bash
# View app.json
cat app.json | grep version

# View package.json
cat package.json | grep version
```

## 🔐 Authentication

### Login to Expo
```bash
npx expo login
```

### Check Login Status
```bash
npx expo whoami
```

### Logout
```bash
npx expo logout
```

## 📦 Dependency Management

### Install New Dependency
```bash
# Use Expo's install command for compatibility
npx expo install [package-name]

# Or use npm
npm install [package-name]
```

### Update Dependencies
```bash
# Update all Expo packages
npx expo install --fix

# Update specific package
npm update [package-name]
```

### Check for Outdated Packages
```bash
npm outdated
```

## 🧪 Testing Commands

### Run Tests (if configured)
```bash
npm test
```

### Run E2E Tests (if configured)
```bash
npm run test:e2e
```

## 📝 Useful Aliases (Add to ~/.bashrc or ~/.zshrc)

```bash
# Quick deploy aliases
alias expo-clean="npm cache clean --force && rm -rf .expo && rm -rf node_modules/.cache"
alias expo-reset="rm -rf node_modules && rm -rf .expo && npm install"
alias expo-build-preview="eas build --platform all --profile preview"
alias expo-build-prod="eas build --platform all --profile production"
alias expo-lint="npm run lint && npm run typecheck"
```

## 🎯 One-Command Deploy

### Complete Deploy Workflow
```bash
# Clean, verify, and build in one go
npm cache clean --force && \
rm -rf .expo && \
rm -rf node_modules/.cache && \
npm run lint && \
npm run typecheck && \
eas build --platform all --profile production
```

## 📱 Device Testing

### Install on iOS Device
```bash
# After build completes, download and install via TestFlight
# Or use development build
eas build --platform ios --profile development
```

### Install on Android Device
```bash
# After build completes, download APK and install
# Or use development build
eas build --platform android --profile development
```

## 🔄 Continuous Integration

### GitHub Actions (Example)
```yaml
name: EAS Build
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run lint
      - run: npm run typecheck
      - run: eas build --platform all --profile production --non-interactive
```

## 📞 Support Commands

### Get Help
```bash
# Expo CLI help
npx expo --help

# EAS CLI help
eas --help

# Specific command help
eas build --help
```

### Check System Info
```bash
# Expo diagnostics
npx expo-doctor

# Node version
node --version

# npm version
npm --version
```

---

**Quick Reference Card**

| Task | Command |
|------|---------|
| Clean cache | `npm run clear-cache` |
| Lint | `npm run lint` |
| Type check | `npm run typecheck` |
| Dev server | `npm run dev` |
| Preview build | `npm run build:preview` |
| Production build | `npm run build:production` |
| List builds | `eas build:list` |
| View build | `eas build:view [id]` |

---

**Last Updated**: Build 1.0.7
**Status**: Ready to Deploy ✅
