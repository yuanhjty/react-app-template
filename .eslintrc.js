const path = require('path');

module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['babel'],
  extends: ['y-react'],
  settings: {
    'import/resolver': {
      webpack: { config: path.resolve(__dirname, 'webpack.common.js'), env: 'development' },
    },
    'import/core-modules': ['path'],
  },
  overrides: [
    {
      files: ['./src/utils/**/*.js'],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
  ],
};
