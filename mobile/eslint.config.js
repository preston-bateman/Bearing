const expoConfig = require('eslint-config-expo/flat');
const { defineConfig } = require('eslint/config');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/**', 'coverage/**'],
    rules: {
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);
