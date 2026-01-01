
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// ADAPTER ERROR ELIMINATION - BUILD 142
// ============================================================================
// This configuration completely eliminates the (h.adapter || o.adapter) error
// by ensuring no axios or similar HTTP libraries can be bundled.
//
// The error occurs when axios (or similar libraries) try to detect which
// "adapter" to use for HTTP requests. In React Native, neither browser
// XMLHttpRequest nor Node.js http module are available, causing the error.
//
// Solution: Block ALL potential sources of adapter-based HTTP clients
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

// Enhanced custom resolver to block adapter-based HTTP clients
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block axios and other adapter-based HTTP clients
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
        `║  This module uses adapters that cause the                     \n` +
        `║  "(h.adapter || o.adapter) is not a function" error           \n` +
        `║  in React Native builds.                                      \n` +
        `║                                                                \n` +
        `║  ✅ Solution: Use native fetch instead                        \n` +
        `║                                                                \n` +
        `║  Example:                                                     \n` +
        `║    const response = await fetch(url, {                        \n` +
        `║      method: 'POST',                                          \n` +
        `║      headers: { 'Content-Type': 'application/json' },         \n` +
        `║      body: JSON.stringify(data)                               \n` +
        `║    });                                                         \n` +
        `║    const result = await response.json();                      \n` +
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
  
  // Use default resolver for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
