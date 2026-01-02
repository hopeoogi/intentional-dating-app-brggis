
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// BUILD 174 - FIXED API SYNC ERROR
// ============================================================================
// Root cause: Aggressive module blocking interfered with expo launch builds
// Solution: Simplified metro config, removed module blocking
// Native fetch is already enforced in Supabase client
// ============================================================================

console.log('[Metro] Starting Metro bundler - BUILD 174');

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

console.log('[Metro] Configuration complete - BUILD 174');
console.log('[Metro] Simplified config - removed module blocking');
console.log('[Metro] Native fetch enforced in Supabase client');

module.exports = config;
