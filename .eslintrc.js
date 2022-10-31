module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.json', './migrations/tsconfig.json'],
  },
  plugins: ['@typescript-eslint', 'neverthrow'],
  root: true,
  rules: {
    'indent': ['error', 2],
    'quotes': ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    'max-len': 'error',
    'neverthrow/must-use-result': 'error',
    'semi': 'error',
  },
};