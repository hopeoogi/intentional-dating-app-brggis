
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
      [
        "module-resolver",
        {
          alias: {
            "better-auth/react": "./node_modules/better-auth/dist/client/react/index.cjs",
            "better-auth/client/plugins": "./node_modules/better-auth/dist/client/plugins/index.cjs",
            "@better-auth/expo/client": "./node_modules/@better-auth/expo/dist/client.cjs",
          },
        },
      ],
      "react-native-worklets/plugin", // Must be last
    ],
  };
};
