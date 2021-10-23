module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'typescript',
    'prettier',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
    'react/prop-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
