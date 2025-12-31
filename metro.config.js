
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Enable package exports - this is the KEY setting for Supabase
config.resolver.unstable_enablePackageExports = true;

module.exports = config;
