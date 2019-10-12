const presetEnv = require('postcss-preset-env');
const cssnano = require('cssnano');

module.exports = ({ isProd }) => {
  return {
    plugins: isProd ? [presetEnv(), cssnano()] : [presetEnv()],
  };
};
