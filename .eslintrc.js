module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    jest: true,
  },
  rules: {
    'max-len': [2, { code: 200, tabWidth: 4, ignoreUrls: true }],
    'no-use-before-define': 'off',
    'global-require': 0,
    'new-cap': 0,
    'consistent-return': 0,
    'import/prefer-default-export': 0,
    'react/static-property-placement': 0,
    semi: ['error', 'always'],
    'class-methods-use-this': 0,
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    'comma-dangle': 'off',
    'react/destructuring-assignment': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-props-no-spreading': 'off',
    'no-restricted-syntax': 'off',
    'guard-for-in': 'off',
    'object-curly-newline': 'off',
    'implicit-arrow-linebreak': 'off'
  },
  globals: {
    fetch: false,
  },
};
