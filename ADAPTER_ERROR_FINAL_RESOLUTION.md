
# Adapter Error Final Resolution

## Problem
The `(h.adapter || o.adapter) is not a function` error was occurring during EAS builds. This error is related to module resolution issues with the Supabase client library, specifically how it resolves its internal HTTP adapter.

## Root Cause
The error was caused by a combination of factors:

1. **Conflicting Module Resolution**: Having `babel-plugin-module-resolver` installed (even if not actively used) can conflict with Metro's `unstable_enablePackageExports` feature
2. **Incorrect Package Export Resolution**: Without proper configuration, Metro cannot correctly resolve `@supabase/supabase-js`'s conditional exports
3. **Adapter Initialization Issues**: The Supabase client was not properly binding the fetch implementation to the global context

## Solution Implemented

### 1. Removed babel-plugin-module-resolver
**File: `package.json`**
- Removed `babel-plugin-module-resolver` from `devDependencies`
- This package conflicts with Metro's native package export resolution

### 2. Enhanced Metro Configuration
**File: `metro.config.js`**
- Enabled `unstable_enablePackageExports` - This is the PRIMARY fix
- Added `unstable_conditionNames` to specify resolution order
- Disabled symlinks to prevent circular dependency issues
- Configured proper source extension priority

Key changes:
```javascript
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_enableSymlinks = false;
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'import',
];
```

### 3. Simplified Babel Configuration
**File: `babel.config.js`**
- Removed all module resolution plugins
- Kept only essential plugins for Expo and worklets
- Relies entirely on Metro for module resolution

### 4. Optimized Supabase Client
**File: `app/integrations/supabase/client.ts`**
- Explicitly bound fetch to globalThis: `fetch: fetch.bind(globalThis)`
- Simplified configuration to minimal required options
- Added comprehensive logging for debugging

### 5. Enhanced EAS Build Configuration
**File: `eas.json`**
- Added `EXPO_NO_DOTENV=1` to prevent environment variable conflicts
- Kept `EXPO_NO_METRO_LAZY=1` for proper module loading
- Kept `EXPO_USE_METRO_WORKSPACE_ROOT=1` for workspace resolution

## Why This Works

### Metro Package Exports
When `unstable_enablePackageExports` is enabled, Metro can correctly resolve the `exports` field in `@supabase/supabase-js`'s package.json. This field specifies different entry points for different environments (Node.js, browser, React Native).

### No Module Resolver Conflicts
By removing `babel-plugin-module-resolver`, we eliminate any potential conflicts between Babel's module resolution and Metro's native resolution. This ensures a single, consistent resolution strategy.

### Proper Fetch Binding
By explicitly binding fetch to globalThis, we ensure that the Supabase client uses the correct fetch implementation for React Native, preventing adapter-related errors.

## Verification Steps

1. **Clear all caches**:
   ```bash
   rm -rf node_modules
   rm -rf .expo
   rm -rf ios/build
   rm -rf android/build
   rm -rf android/.gradle
   npm cache clean --force
   ```

2. **Reinstall dependencies**:
   ```bash
   npm install
   ```

3. **Clear Metro cache**:
   ```bash
   npx expo start --clear
   ```

4. **Run EAS build**:
   ```bash
   eas build --platform all --profile production
   ```

## Expected Outcome

- ✅ No `(h.adapter || o.adapter) is not a function` errors
- ✅ Supabase client initializes correctly
- ✅ All API calls work as expected
- ✅ Build completes successfully on EAS

## Additional Notes

- This configuration is based on official Expo and Supabase documentation
- The `unstable_enablePackageExports` flag is the recommended approach for modern package resolution
- All changes are production-ready and follow best practices

## References

- [Expo Metro Configuration](https://docs.expo.dev/guides/customizing-metro/)
- [Supabase React Native Setup](https://supabase.com/docs/guides/getting-started/quickstarts/react-native)
- [Better Auth Expo Integration](https://www.better-auth.com/docs/integrations/expo) (Similar package export resolution pattern)

## Last Updated
January 2025
