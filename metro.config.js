
const { getDefaultConfig } = require('expo/metro-config');
const { FileStore } = require('metro-cache');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Enable package exports for better-auth
config.resolver.unstable_enablePackageExports = true;

// Ensure proper resolution of better-auth modules
config.resolver.sourceExts = ['js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'];

// Add resolveRequest to handle better-auth module resolution
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle better-auth/react imports
  if (moduleName === 'better-auth/react') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/better-auth/dist/client/react/index.js'),
      type: 'sourceFile',
    };
  }
  
  // Handle @better-auth/expo/client imports
  if (moduleName === '@better-auth/expo/client') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/@better-auth/expo/dist/client.js'),
      type: 'sourceFile',
    };
  }

  // Default resolver
  return context.resolveRequest(context, moduleName, platform);
};

// Use file cache for better performance
config.cacheStores = [
  new FileStore({ root: path.join(__dirname, 'node_modules', '.cache', 'metro') }),
];

module.exports = config;
