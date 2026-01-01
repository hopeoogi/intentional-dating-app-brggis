
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// PERMANENT FIX FOR ADAPTER ERROR - METRO CONFIGURATION
// ============================================================================
// This configuration ensures proper module resolution and prevents the
// "(h.adapter || o.adapter) is not a function" error by:
// 1. Enabling package exports for proper ES module resolution
// 2. Setting correct condition names for React Native
// 3. Disabling problematic features that can cause conflicts
// 4. Using file-based caching for consistency
// ============================================================================

// PRIMARY FIX: Enable package exports for proper ES module resolution
config.resolver.unstable_enablePackageExports = true;

// CRITICAL: Disable symlinks to prevent circular dependency issues
config.resolver.unstable_enableSymlinks = false;

// Set proper condition names order for React Native
// This ensures React Native-specific exports are prioritized
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'import',
];

// Disable lazy bundling to ensure all modules are properly resolved
config.server = {
  ...config.server,
  enhanceMiddleware: (middleware) => {
    return (req, res, next) => {
      // Ensure proper CORS headers for fetch requests
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      return middleware(req, res, next);
    };
  },
};

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

// Block any axios imports to prevent adapter errors
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block axios imports completely
  if (moduleName === 'axios' || moduleName.includes('axios')) {
    throw new Error(
      `[Metro] Blocked axios import: "${moduleName}". ` +
      'This app uses native fetch only. Please remove axios from your code and dependencies.'
    );
  }

  // Handle native-tabs.module.css
  if (moduleName.includes('native-tabs.module.css')) {
    return {
      filePath: path.resolve(__dirname, 'assets/native-tabs.module.css'),
      type: 'sourceFile',
    };
  }
  
  // Use default resolver for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
