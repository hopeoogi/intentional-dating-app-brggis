
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

  const plugins = [
    [
      "module-resolver",
      {
        root: ["./"],
        extensions: [
          ".ios.ts",
          ".android.ts",
          ".ts",
          ".ios.tsx",
          ".android.tsx",
          ".tsx",
          ".jsx",
          ".js",
          ".json",
          ".cjs",
          ".mjs",
        ],
        alias: {
          "@": "./",
          "@components": "./components",
          "@style": "./style",
          "@hooks": "./hooks",
          "@types": "./types",
          "@contexts": "./contexts",
        },
      },
    ],
    ...EDITABLE_COMPONENTS,
    "@babel/plugin-proposal-export-namespace-from",
  ];

  // Only add worklets plugin in development or if explicitly needed
  if (process.env.NODE_ENV === 'development') {
    plugins.push("react-native-worklets/plugin");
  }

  return {
    presets: ["babel-preset-expo"],
    plugins,
  };
};
