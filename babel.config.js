
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
    // STABLE BABEL CONFIGURATION - UPDATE 117 APPROACH
    // ============================================================================
    // Clean, minimal Babel configuration that relies on Metro for module
    // resolution. This is the proven stable approach from Update 117.
    //
    // CRITICAL: NO MODULE RESOLUTION PLUGINS
    // Adding babel-plugin-module-resolver or similar plugins will cause
    // conflicts with Metro's package exports feature.
    // ============================================================================
  };
};
