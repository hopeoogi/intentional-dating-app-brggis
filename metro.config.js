
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// BUILD 178 - BETTERAUTH COMPATIBLE METRO CONFIGURATION
// ============================================================================
// Enables package exports for BetterAuth module resolution
// Simplified config without aggressive module blocking
// ============================================================================

console.log('[Metro] Starting Metro bundler - BUILD 178');
console.log('[Metro] Configuration: BetterAuth compatible with package exports');

// CRITICAL: Enable package exports for BetterAuth
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

console.log('[Metro] ✅ Configuration complete - BUILD 178');
console.log('[Metro] ✅ Package exports enabled for BetterAuth');
console.log('[Metro] ✅ Ready for bundling');

module.exports = config;
