
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// BUILD 146 - ENHANCED ADAPTER ERROR FIX
// ============================================================================
// This configuration aggressively blocks ALL HTTP libraries except native fetch
// We also add better error reporting to identify what's trying to import axios
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
// CRITICAL: Enhanced blocking of axios and related HTTP libraries
// ============================================================================
const blockedModules = [
  'axios',
  'node-fetch',
  'cross-fetch',
  'isomorphic-fetch',
  'whatwg-fetch',
  'got',
  'request',
  'superagent',
  'needle',
  'bent',
  'ky',
  'wretch',
];

// Track what's trying to import blocked modules for debugging
const importAttempts = new Map();

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block axios and related libraries with detailed logging
  for (const blocked of blockedModules) {
    if (moduleName === blocked || moduleName.startsWith(`${blocked}/`)) {
      const caller = context.originModulePath || 'unknown';
      
      // Track import attempts for debugging
      if (!importAttempts.has(blocked)) {
        importAttempts.set(blocked, new Set());
      }
      importAttempts.get(blocked).add(caller);
      
      console.warn(`[Metro] ⛔ BLOCKED: "${moduleName}" attempted by: ${caller}`);
      console.warn(`[Metro] 💡 Use native fetch instead`);
      
      return {
        type: 'empty',
      };
    }
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

// Log blocked import attempts on exit
process.on('SIGINT', () => {
  if (importAttempts.size > 0) {
    console.log('\n' + '='.repeat(80));
    console.log('[Metro] Blocked Import Summary:');
    importAttempts.forEach((callers, module) => {
      console.log(`\n  ${module}:`);
      callers.forEach(caller => {
        console.log(`    - ${caller}`);
      });
    });
    console.log('='.repeat(80) + '\n');
  }
  process.exit();
});

module.exports = config;
