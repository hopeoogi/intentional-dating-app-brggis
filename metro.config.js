
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// CRITICAL FIX FOR "(h.adapter || o.adapter) is not a function" ERROR
// ============================================================================
// This configuration ensures proper ES module resolution for @supabase/supabase-js
// and other modern packages that use conditional exports.
//
// The error occurs when Metro cannot properly resolve the HTTP adapter in
// Supabase's internal modules. This is fixed by enabling package exports.
// ============================================================================

// PRIMARY FIX: Enable package exports for proper ES module resolution
// This allows Metro to correctly resolve @supabase/supabase-js's conditional exports
// and prevents the adapter error
config.resolver.unstable_enablePackageExports = true;

// IMPORTANT: Disable symlinks to prevent circular dependency issues
// This ensures a clean resolution path without symlink-related complications
config.resolver.unstable_enableSymlinks = false;

// Set proper condition names order for React Native
// This ensures React Native-specific exports are prioritized over browser/node exports
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'import',
];

// Use file-based cache for better performance and consistency
config.cacheStores = [
  new FileStore({ 
    root: path.join(__dirname, 'node_modules', '.cache', 'metro') 
  }),
];

// Ensure proper source extensions order - prioritize native extensions
config.resolver.sourceExts = [
  'tsx',
  'ts',
  'jsx',
  'js',
  'json',
  'mjs',
  'cjs',
];

// Add asset extensions including CSS for web compatibility
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'css',
  'db',
  'mp3',
  'ttf',
  'obj',
  'png',
  'jpg',
];

// Ensure node_modules are resolved correctly
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// Custom resolver to handle missing CSS modules in expo-router
const defaultResolver = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // If expo-router is trying to import native-tabs.module.css, redirect to our assets folder
  if (moduleName.includes('native-tabs.module.css')) {
    return {
      filePath: path.resolve(__dirname, 'assets/native-tabs.module.css'),
      type: 'sourceFile',
    };
  }
  
  // Use default resolver for everything else
  if (defaultResolver) {
    return defaultResolver(context, moduleName, platform);
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
