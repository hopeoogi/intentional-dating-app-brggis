
module.exports = function (api) {
  api.cache(true);

  const EDITABLE_COMPONENTS =
    process.env.EXPO_PUBLIC_ENABLE_EDIT_MODE === "TRUE" &&
    process.env.NODE_ENV === "development"
      ? [
          ["./babel-plugins/editable-elements.js", {}],
          ["./babel-plugins/inject-source-location.js", {}],
        ]
      : [];

  return {
    presets: ["babel-preset-expo"],
    plugins: [
      ...EDITABLE_COMPONENTS,
      "@babel/plugin-proposal-export-namespace-from",
      "react-native-worklets/plugin", // Must be last
    ],
    // ============================================================================
    // PERMANENT FIX FOR ADAPTER ERROR - BABEL CONFIGURATION
    // ============================================================================
    // We rely EXCLUSIVELY on Metro's unstable_enablePackageExports for module resolution.
    // 
    // CRITICAL: DO NOT ADD ANY MODULE RESOLUTION PLUGINS HERE!
    // 
    // Adding babel-plugin-module-resolver or any other module resolution plugin
    // will cause conflicts with Supabase's conditional exports and lead to the
    // "(h.adapter || o.adapter) is not a function" error.
    //
    // The error occurs because:
    // 1. Babel tries to resolve modules before Metro
    // 2. This causes incorrect resolution of Supabase's internal HTTP adapter
    // 3. The adapter ends up being undefined, causing the error
    //
    // Solution: Let Metro handle ALL module resolution via unstable_enablePackageExports
    // ============================================================================
  };
};
