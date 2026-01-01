
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// BUILD 145 - FINAL ADAPTER ERROR FIX
// ============================================================================
// This configuration completely blocks axios and any libraries that might
// bundle it, ensuring we only use native fetch throughout the app.
// ============================================================================

// Enable package exports for proper ES module resolution
config.resolver.unstable_enablePackageExports = true;

// Disable symlinks to prevent circular dependency issues
config.resolver.unstable_enableSymlinks = false;

// Set proper condition names order for React Native
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
];

// Use file-based cache for better performance and consistency
config.cacheStores = [
  new FileStore({ 
    root: path.join(__dirname, 'node_modules', '.cache', 'metro') 
  }),
];

// Ensure proper source extensions order
config.resolver.sourceExts = [
  'tsx',
  'ts',
  'jsx',
  'js',
  'json',
  'mjs',
  'cjs',
];

// Add asset extensions
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

// ============================================================================
// CRITICAL: Block axios and related HTTP libraries
// ============================================================================
// This is the key to eliminating the adapter error. We block axios at the
// Metro bundler level so it can never be included in the bundle.
// ============================================================================
const blockedModules = [
  'axios',
  'node-fetch',
  'cross-fetch',
  'isomorphic-fetch',
  'whatwg-fetch',
];

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block axios and related libraries
  if (blockedModules.some(blocked => moduleName === blocked || moduleName.startsWith(`${blocked}/`))) {
    console.warn(`[Metro] Blocked module: ${moduleName} - Use native fetch instead`);
    return {
      type: 'empty',
    };
  }

  // Handle native-tabs.module.css
  if (moduleName.includes('native-tabs.module.css')) {
    return {
      filePath: path.resolve(__dirname, 'assets/native-tabs.module.css'),
      type: 'sourceFile',
    };
  }
  
  // Use default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
