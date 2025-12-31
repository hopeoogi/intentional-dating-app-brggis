
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Use file-based cache for better performance
config.cacheStores = [
  new FileStore({ 
    root: path.join(__dirname, 'node_modules', '.cache', 'metro') 
  }),
];

// CRITICAL: Enable package exports for proper ES module resolution
// This fixes the adapter error by allowing Metro to correctly resolve
// @supabase/supabase-js's conditional exports
config.resolver.unstable_enablePackageExports = true;

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

// Add asset extensions
config.resolver.assetExts = [
  ...config.resolver.assetExts,
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

// Enable symlinks resolution
config.resolver.resolveRequest = null;

module.exports = config;
