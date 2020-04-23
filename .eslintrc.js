// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
  // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
  extends: ['plugin:vue/essential'],
  // required to lint *.vue files
  plugins: [ 'vue', 'prettier' ],
  // add your custom rules here
  rules: {
    'generator-star-spacing': 0,
    'consistent-return': 0,
    'import/no-unresolved': 0,
    'global-require': 1,
    'import/prefer-default-export': 0,
    'no-else-return': 0,
    'no-restricted-syntax': 0,
    'import/no-extraneous-dependencies': 0,
    'no-use-before-define': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'no-nested-ternary': 0,
    'arrow-body-style': 0,
    'linebreak-style': 0,
    'import/extensions': 0,
    'no-bitwise': 0,
    'no-cond-assign': 0,
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'ignore',
      },
    ],
    'object-curly-newline': [0],
    'function-paren-newline': [0],
    'no-restricted-globals': [0],
    'require-yield': [1],
    "prettier/prettier": "error",
  },
}
