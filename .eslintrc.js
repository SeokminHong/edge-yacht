module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['typescript', 'prettier'],
  plugins: ['@typescript-eslint'],
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: ['dist', 'node_modules'],
  rules: {
    '@typescript-eslint/no-empty-function': 'off',
  },
};
