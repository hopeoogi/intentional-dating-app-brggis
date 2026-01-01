
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// STABLE METRO CONFIGURATION - UPDATE 136
// ============================================================================
// This is the proven stable configuration that eliminates adapter errors.
// Key principles:
// 1. Enable package exports for proper ES module resolution
// 2. Disable symlinks to prevent circular dependency issues
// 3. Block adapter-based HTTP clients (axios, node-fetch, etc.)
// 4. Use file-based cache for consistency
// 5. Proper source extension ordering
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

// Use file-based cache for better performance
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

// List of modules that use adapters and should be blocked
const BLOCKED_MODULES = [
  'axios',
  'node-fetch',
  'cross-fetch',
  'isomorphic-fetch',
  'whatwg-fetch',
  'unfetch',
  'got',
  'request',
  'superagent',
  'needle',
];

// Block adapter-based HTTP clients
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const normalizedModuleName = moduleName.toLowerCase();
  
  for (const blockedModule of BLOCKED_MODULES) {
    if (normalizedModuleName === blockedModule || 
        normalizedModuleName.startsWith(`${blockedModule}/`) ||
        normalizedModuleName.includes(`/node_modules/${blockedModule}/`)) {
      throw new Error(
        `\n\n` +
        `╔════════════════════════════════════════════════════════════════╗\n` +
        `║  BLOCKED: "${moduleName}"                                      \n` +
        `║                                                                \n` +
        `║  This module uses adapters that cause errors in React Native. \n` +
        `║  Use native fetch instead.                                    \n` +
        `╚════════════════════════════════════════════════════════════════╝\n`
      );
    }
  }

  // Handle native-tabs.module.css
  if (moduleName.includes('native-tabs.module.css')) {
    return {
      filePath: path.resolve(__dirname, 'assets/native-tabs.module.css'),
      type: 'sourceFile',
    };
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
