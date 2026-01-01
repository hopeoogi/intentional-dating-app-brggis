
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// REBUILD 144 - CLEAN METRO CONFIGURATION
// ============================================================================
// This is a completely fresh Metro configuration based on Expo best practices
// and the knowledge base documentation. Key principles:
// 1. Enable package exports for modern ES module resolution
// 2. Use stable, proven settings
// 3. No complex blocking - let Metro handle resolution naturally
// 4. Proper cache configuration
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

// Handle native-tabs.module.css
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.includes('native-tabs.module.css')) {
    return {
      filePath: path.resolve(__dirname, 'assets/native-tabs.module.css'),
      type: 'sourceFile',
    };
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
