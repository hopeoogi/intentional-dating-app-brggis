
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable package exports resolution for modern ES modules
config.resolver.unstable_enablePackageExports = true;

// Add additional resolver settings to prevent adapter errors
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs', 'mjs'];
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Ensure proper module resolution
config.resolver.unstable_enableSymlinks = false;
config.resolver.unstable_conditionNames = [
  'react-native',
  'browser',
  'require',
  'import',
];

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({ root: path.join(__dirname, 'node_modules', '.cache', 'metro') }),
];

// Reset cache version to force clean build
config.cacheVersion = 'v2-production-ready';

module.exports = config;
