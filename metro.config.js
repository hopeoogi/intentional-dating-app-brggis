
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package exports to resolve module issues
config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: true,
  sourceExts: [...(config.resolver?.sourceExts || []), 'jsx', 'js', 'ts', 'tsx', 'json'],
  assetExts: [...(config.resolver?.assetExts || []).filter(ext => ext !== 'svg')],
};

// Minimal transformer config
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Always reset cache to prevent adapter errors
config.resetCache = true;

module.exports = config;
