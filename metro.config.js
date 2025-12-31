
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable package exports resolution for modern ES modules
config.resolver.unstable_enablePackageExports = true;

// Add additional resolver settings
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'mjs'];

// Proper resolver main fields order for React Native
config.resolver.resolverMainFields = ['react-native', 'browser', 'main', 'module'];

// Ensure proper module resolution
config.resolver.unstable_enableSymlinks = false;

// Condition names for package exports
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'import',
];

// Use file-based cache
config.cacheStores = [
  new FileStore({ root: path.join(__dirname, 'node_modules', '.cache', 'metro') }),
];

// Update cache version to force clean build
config.cacheVersion = 'v3-supabase-fix';

module.exports = config;
