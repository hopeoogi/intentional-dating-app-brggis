
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  sourceExts: ['jsx', 'js', 'ts', 'tsx', 'json', 'mjs', 'cjs'],
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
};

config.transformer = {
  ...config.transformer,
  minifierPath: require.resolve('metro-minify-terser'),
  minifierConfig: {
    compress: {
      drop_console: false,
    },
  },
};

module.exports = config;
