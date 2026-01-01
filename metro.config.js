
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// STABLE METRO CONFIGURATION - UPDATE 117 APPROACH
// ============================================================================
// This configuration uses the proven stable settings from Update 117 that
// worked reliably. We've removed the overly complex configurations from
// Update 125 that were causing adapter issues.
//
// Key principles:
// 1. Enable package exports for ES module resolution
// 2. Keep configuration simple and minimal
// 3. Only essential customizations
// 4. Proven stable settings
// ============================================================================

// PRIMARY FIX: Enable package exports for proper ES module resolution
config.resolver.unstable_enablePackageExports = true;

// CRITICAL: Disable symlinks to prevent circular dependency issues
config.resolver.unstable_enableSymlinks = false;

// Set proper condition names order for React Native
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

// Simple custom resolver for special cases
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block axios imports to prevent adapter errors
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
