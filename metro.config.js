
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ============================================================================
// BUILD 173 - ULTRA-SIMPLIFIED EDGE FUNCTIONS
// ============================================================================
// Permanent fix for API sync errors through radical simplification
// Edge Functions reduced by 65-75% in code size
// Following Supabase and Deno best practices
// ============================================================================

console.log('[Metro] Starting Metro bundler - BUILD 173');

config.resolver.unstable_enablePackageExports = true;
config.resolver.unstable_enableSymlinks = false;

config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
];

config.cacheStores = [
  new FileStore({ 
    root: path.join(__dirname, 'node_modules', '.cache', 'metro') 
  }),
];

config.resolver.sourceExts = [
  'tsx',
  'ts',
  'jsx',
  'js',
  'json',
  'mjs',
  'cjs',
];

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
  'undici',
  'node-http',
  'http-client',
];

const importAttempts = new Map();

config.resolver.resolveRequest = (context, moduleName, platform) => {
  for (const blocked of blockedModules) {
    if (moduleName === blocked || moduleName.startsWith(`${blocked}/`)) {
      const caller = context.originModulePath || 'unknown';
      
      if (!importAttempts.has(blocked)) {
        importAttempts.set(blocked, new Set());
      }
      importAttempts.get(blocked).add(caller);
      
      console.warn(`[Metro] ⛔ BLOCKED: "${moduleName}" attempted by: ${caller}`);
      
      return {
        type: 'empty',
      };
    }
  }

  if (moduleName.includes('native-tabs.module.css')) {
    return {
      filePath: path.resolve(__dirname, 'assets/native-tabs.module.css'),
      type: 'sourceFile',
    };
  }
  
  return context.resolveRequest(context, moduleName, platform);
};

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

console.log('[Metro] Configuration complete - BUILD 173');

module.exports = config;
