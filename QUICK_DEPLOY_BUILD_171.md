
# 🚀 QUICK DEPLOY - BUILD 171

## ⚡ ONE-COMMAND DEPLOYMENT

### Clear Caches & Build
```bash
rm -rf node_modules/.cache && rm -rf .expo && rm -rf node_modules/.cache/metro && eas build --platform all --profile production
```

### iOS Only
```bash
rm -rf node_modules/.cache && rm -rf .expo && rm -rf node_modules/.cache/metro && eas build --platform ios --profile production
```

### Android Only
```bash
rm -rf node_modules/.cache && rm -rf .expo && rm -rf node_modules/.cache/metro && eas build --platform android --profile production
```

## 📋 STEP-BY-STEP

### 1. Clear Caches (Required)
```bash
rm -rf node_modules/.cache
rm -rf .expo
rm -rf node_modules/.cache/metro
```

### 2. Start Metro (Optional - for testing)
```bash
expo start --clear
```

### 3. Build for Production
```bash
# iOS
eas build --platform ios --profile production

# Android
eas build --platform android --profile production

# Both
eas build --platform all --profile production
```

### 4. Submit to TestFlight
```bash
eas submit --platform ios
```

## ✅ VERIFICATION COMMANDS

### Test Edge Functions
```bash
# Test generate-intro-image
curl -X POST https://plnfluykallohjimxnja.supabase.co/functions/v1/generate-intro-image \
  -H "Content-Type: application/json" \
  -d '{}'

# Test approve-user CORS
curl -X OPTIONS https://plnfluykallohjimxnja.supabase.co/functions/v1/approve-user \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: authorization, content-type" \
  -v
```

### Check Build Status
```bash
eas build:list
```

### Check Submission Status
```bash
eas submit:list
```

## 🎯 WHAT TO EXPECT

### Build Output:
- ✅ "BUILD 171" in logs
- ✅ Version 1.2.9
- ✅ No adapter errors
- ✅ No API sync errors
- ✅ Clean build completion

### Edge Function Tests:
- ✅ Status 200 or appropriate error
- ✅ CORS headers present
- ✅ Request ID in response
- ✅ JSON format correct

### App Launch:
- ✅ New York skyline loads
- ✅ No crashes
- ✅ Smooth navigation
- ✅ No console errors

## 🚨 TROUBLESHOOTING

### Build Fails
```bash
# Clear everything and try again
rm -rf node_modules
npm install
rm -rf node_modules/.cache
rm -rf .expo
eas build --platform ios --profile production --clear-cache
```

### Metro Issues
```bash
# Kill Metro and restart
pkill -f "expo start"
expo start --clear
```

### Edge Function Issues
```bash
# Check logs in Supabase Dashboard
# Verify environment variables are set
# Test with curl commands above
```

## 📊 BUILD INFO

**Build:** 171  
**Version:** 1.2.9  
**iOS Build:** 1.2.9  
**Android Version Code:** 25  

**Edge Functions:**
- generate-intro-image: Version 4
- approve-user: Version 5

**Status:** ✅ READY

---

**Quick Reference:**
- [BUILD_171_COMPLETE_SUMMARY.md](./BUILD_171_COMPLETE_SUMMARY.md) - Full details
- [START_HERE_BUILD_171.md](./START_HERE_BUILD_171.md) - Getting started
- [FINAL_CHECKLIST_BUILD_171.md](./FINAL_CHECKLIST_BUILD_171.md) - Complete checklist
