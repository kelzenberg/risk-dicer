module.exports = {
  root: true,

  env: {
    browser: true,
    es6: true,
    node: true,
  },

  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
    // "eslint:recommended",
    // "prettier/vue",
    // "plugin:prettier/recommended"
  ],

  rules: {
    'vue/component-name-in-template-casing': ['error', 'PascalCase'],
    'vue/require-default-prop': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },

  globals: {
    $nuxt: true,
  },

  parserOptions: {
    parser: 'babel-eslint',
  },
};
