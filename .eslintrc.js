module.exports = {
    'extends': 'airbnb',
    'parser': 'babel-eslint',
    'env': {
      'jest': true,
    },
    'rules': {
      'max-len': 150,
      'no-use-before-define': 'off',
      'react/jsx-filename-extension': 'off',
      'react/prop-types': 'off',
      'comma-dangle': 'off',
      'react/destructuring-assignment': 'off',
      'react/jsx-one-expression-per-line': 'off',
    },
    'globals': {
      "fetch": false
    }
  }