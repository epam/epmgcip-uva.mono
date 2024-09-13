module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json'],
    sourceType: 'module',
  },
  ignorePatterns: ['/build/**/*', '.eslint*'],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'import/no-unresolved': 'off',
    'object-curly-spacing': 'off',
    'new-cap': 'off',
    'max-len': ['warn', { code: 125 }],
    'comma-dangle': 'warn',
    indent: ['warn', 2],
    'arrow-parens': 'off',
    'require-jsdoc': 'off',
    camelcase: 'off',
  },
};
