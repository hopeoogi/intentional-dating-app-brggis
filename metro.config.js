
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable package exports resolution for modern ES modules
// This is critical for resolving @supabase/supabase-js and other modern packages
config.resolver.unstable_enablePackageExports = true;

// Ensure proper source extensions order with platform-specific files
config.resolver.sourceExts = [
  'web.tsx',
  'web.ts',
  'web.jsx',
  'web.js',
  'native.tsx',
  'native.ts',
  'ios.tsx',
  'ios.ts',
  'android.tsx',
  'android.ts',
  'tsx',
  'ts',
  'jsx',
  'js',
  'json',
  'cjs',
  'mjs'
];

// Add node_modules to the watch folders
config.watchFolders = [path.resolve(__dirname)];

// Configure resolver to handle package.json exports field
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Use turborepo to restore the cache when possible
config.cacheStores = [
  new FileStore({ root: path.join(__dirname, 'node_modules', '.cache', 'metro') }),
];

// Ensure we're using the correct transformer
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

module.exports = config;
