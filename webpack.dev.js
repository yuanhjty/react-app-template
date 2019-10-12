const merge = require('webpack-merge');
const common = require('./webpack.common');

module.exports = env =>
  merge(common(env), {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
      contentBase: './build',
      host: '0.0.0.0',
      port: 3000,
      open: true,
      historyApiFallback: true,
    },
  });
