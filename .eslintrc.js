
module.exports = {
  extends: ['expo', 'eslint:recommended'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'import'],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/array-type': ['warn', { default: 'array' }],
    'import/no-unresolved': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'react/prop-types': 'off',
    'no-unused-vars': 'off',
  },
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
