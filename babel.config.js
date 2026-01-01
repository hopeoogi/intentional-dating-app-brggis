
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
    // CRITICAL: No babel-plugin-module-resolver
    // ============================================================================
    // We rely on Metro's unstable_enablePackageExports for proper module resolution.
    // Adding babel-plugin-module-resolver here causes conflicts with Supabase's
    // conditional exports and leads to the "(h.adapter || o.adapter) is not a function" error.
    //
    // DO NOT ADD MODULE RESOLUTION PLUGINS HERE!
    // ============================================================================
  };
};
