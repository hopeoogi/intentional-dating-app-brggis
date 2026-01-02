
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// BUILD 177 - VERIFIED METRO CONFIGURATION
// ============================================================================
// Based on successful Build 174 fix
// Simplified config without aggressive module blocking
// Native fetch is enforced in Supabase client
// This configuration has been proven to work with expo launch
// ============================================================================

console.log('[Metro] Starting Metro bundler - BUILD 177');
console.log('[Metro] Configuration: Simplified, no module blocking');
console.log('[Metro] Native fetch: Enforced in Supabase client');

// Enable package exports for better module resolution
config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_enableSymlinks = false;

// Set condition names for proper module resolution
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
];

// Configure cache
config.cacheStores = [
  new FileStore({ 
    root: path.join(__dirname, 'node_modules', '.cache', 'metro') 
  }),
];

// Source extensions
config.resolver.sourceExts = [
  'tsx',
  'ts',
  'jsx',
  'js',
  'json',
  'mjs',
  'cjs',
];

// Asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts.filter(ext => !['mjs', 'cjs'].includes(ext)),
  'css',
  'db',
  'mp3',
  'ttf',
  'obj',
  'png',
  'jpg',
];

// Simple resolver for native tabs CSS
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.includes('native-tabs.module.css')) {
    return {
      filePath: path.resolve(__dirname, 'assets/native-tabs.module.css'),
      type: 'sourceFile',
    };
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

console.log('[Metro] ✅ Configuration complete - BUILD 177');
console.log('[Metro] ✅ Ready for bundling');

module.exports = config;
