module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest', // Use the latest ECMAScript features
    sourceType: 'module', // Enable ES module support (import/export)
  },
  extends: [
    'eslint:recommended', // Base ESLint rules
    'plugin:@typescript-eslint/recommended', // TypeScript-specific linting rules
    'plugin:prettier/recommended', // Integrate Prettier for formatting
  ],
  rules: {
    // Your custom rules
  },
};
