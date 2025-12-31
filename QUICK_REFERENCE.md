
# Quick Reference Guide - Intentional Dating App

## 🚀 Common Commands

### Development
```bash
# Start development server
npm run dev

# Start on iOS
npm run ios

# Start on Android
npm run android

# Clear cache and restart
npm run clean
```

### Building
```bash
# Build for iOS (TestFlight)
eas build --platform ios --profile production

# Build for Android
eas build --platform android --profile production

# Submit to App Store
eas submit --platform ios

# Submit to Play Store
eas submit --platform android
```

### Database Operations
```bash
# Access Supabase dashboard
https://supabase.com/dashboard/project/plnfluykallohjimxnja

# View tables
https://supabase.com/dashboard/project/plnfluykallohjimxnja/editor

# View Edge Functions
https://supabase.com/dashboard/project/plnfluykallohjimxnja/functions
```

## 📋 Key Files

### Configuration
- `app.json` - Expo configuration
- `eas.json` - EAS Build configuration
- `package.json` - Dependencies
- `metro.config.js` - Metro bundler config

### Core App Files
- `app/_layout.tsx` - Root layout
- `app/(tabs)/_layout.tsx` - Tab navigation
- `app/integrations/supabase/client.ts` - Supabase client
- `contexts/UserContext.tsx` - User state management

### Key Screens
- `app/(tabs)/(home)/index.tsx` - Match browsing
- `app/(tabs)/conversations.tsx` - Conversations
- `app/(tabs)/profile.tsx` - User profile
- `app/admin/pending-users.tsx` - Admin approval

## 🔑 Important Constants

### Supabase
- **Project ID**: `plnfluykallohjimxnja`
- **URL**: `https://plnfluykallohjimxnja.supabase.co`
- **Anon Key**: (in `app/integrations/supabase/client.ts`)

### App Identifiers
- **iOS Bundle ID**: `com.anonymous.Natively`
- **Android Package**: `com.anonymous.Natively`
- **Scheme**: `intentional-dating`

## 🎨 Design System

### Colors (from `styles/commonStyles.ts`)
```typescript
colors.primary      // Main brand color
colors.background   // App background
colors.card         // Card background
colors.text         // Primary text
colors.textSecondary // Secondary text
colors.border       // Borders
colors.error        // Error states
colors.warning      // Warning states
```

### Status Badge Tiers
- **Basic** (Blue): `#007AFF`
- **Elite** (Purple): `#AF52DE`
- **Star** (Gold): `#FFD700`

## 📊 Subscription Tiers

### Basic (Free)
- 3 daily matches
- 3 daily conversations
- 50 mile radius
- Basic tier matches only

### Elite ($9.99/month)
- 10 daily matches
- 10 daily conversations
- 100 mile radius
- Basic + Elite tier matches

### Star ($19.99/month)
- Unlimited matches
- Unlimited conversations
- Unlimited radius
- All tier matches

## 🔐 Admin Access

### Create Admin User
```sql
INSERT INTO admin_users (auth_user_id, role, permissions, active)
VALUES (
  'USER_AUTH_ID_HERE',
  'super_admin',
  '{"can_approve_users": true, "can_view_analytics": true, "can_manage_promo_codes": true, "can_manage_notifications": true}'::jsonb,
  true
);
```

### Admin Roles
- `super_admin` - Full access
- `admin` - Most features
- `moderator` - User management only
- `support` - View only

## 📱 Testing Accounts

### Create Test User
1. Sign up through the app
2. Submit application with photos
3. Admin approves in admin panel
4. User can now browse matches

### Test Admin Access
1. Create user account
2. Add to `admin_users` table (SQL above)
3. Navigate to `/admin` in app
4. Access admin features

## 🐛 Common Issues & Fixes

### "Adapter Error"
```bash
rm -rf node_modules/.cache
rm -rf .expo
npm run clean
npm install
```

### "Build Failed"
```bash
# Clear Xcode derived data (iOS)
rm -rf ~/Library/Developer/Xcode/DerivedData

# Clear Android build
cd android && ./gradlew clean && cd ..

# Rebuild
eas build --platform ios --clear-cache
```

### "Supabase Connection Failed"
1. Check internet connection
2. Verify Supabase project is active
3. Check API keys in `client.ts`
4. Review Supabase logs

### "Edge Function Error"
1. Check function logs in Supabase dashboard
2. Verify environment variables are set
3. Test function with curl:
```bash
curl -X POST https://plnfluykallohjimxnja.supabase.co/functions/v1/approve-user \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"pendingUserId": "UUID", "action": "approve"}'
```

## 📈 Monitoring

### Check App Health
- Supabase Dashboard: Database activity
- EAS Dashboard: Build status
- App Store Connect: TestFlight feedback
- Sentry (if integrated): Error tracking

### Key Metrics to Monitor
- Daily active users
- Approval rate (pending users)
- Conversation completion rate
- Subscription conversion rate
- Average response time

## 🔄 Update Process

### App Updates
1. Update version in `app.json`
2. Update version in `package.json`
3. Increment build number (iOS) / version code (Android)
4. Build and submit

### Database Updates
1. Create migration in Supabase
2. Test in development
3. Apply to production
4. Update app if schema changes

## 📞 Support Resources

- **Expo Docs**: https://docs.expo.dev
- **Supabase Docs**: https://supabase.com/docs
- **React Native Docs**: https://reactnative.dev
- **EAS Build Docs**: https://docs.expo.dev/build/introduction

## 🎯 Launch Checklist

- [ ] All dependencies installed
- [ ] App builds successfully
- [ ] Admin account created
- [ ] Test users approved
- [ ] Push notifications configured
- [ ] Privacy policy added
- [ ] Terms of service added
- [ ] App Store listing prepared
- [ ] TestFlight build uploaded
- [ ] Internal testing completed

---

**Last Updated**: January 2025
**App Version**: 1.0.3
**Build Number**: 4
