const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const SRC_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'build');
const PUBLIC_DIR = path.resolve(__dirname, 'public');

module.exports = env => {
  const isProd = env.NODE_ENV === 'production';

  const outputJsName = isProd ? '[name]-[chunkhash:8].bundle.js' : '[name].bundle.js';
  const outputJsChunkName = isProd ? '[id]-[chunkhash:8].chunk.js' : '[id].chunk.js';
  const outputMediaName = isProd ? '[chunkhash:8].[ext]' : '[name].[ext]';
  const outputMediaChunkName = isProd ? '[id]-[chunkhash:8].[ext]' : '[name].[ext]';

  const styleLoader = isProd ? MiniCssExtractPlugin.loader : 'style-loader';

  const plugins = [
    new CleanWebpackPlugin(),
    isProd &&
      new MiniCssExtractPlugin({
        filename: 'static/css/[chunkhash:8].css',
        chunkFilename: 'static/css/[id]-[chunkhash:8].chunk.css',
      }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './public/index.html',
    }),
    new CopyPlugin([
      {
        from: PUBLIC_DIR,
        to: BUILD_DIR,
        toType: 'dir',
        ignore: [/\.html/],
      },
    ]),
  ].filter(Boolean);

  return {
    entry: './src/index.js',
    output: {
      filename: `static/js/${outputJsName}`,
      chunkFilename: `static/js/${outputJsChunkName}`,
      path: BUILD_DIR,
      publicPath: '/',
    },
    module: {
      rules: [
        { test: /\.js$/, include: SRC_DIR, use: ['babel-loader'] },
        {
          test: /\.scss$/,
          use: [
            styleLoader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isProd ? '[hash:8]' : '[path][name]__[local]',
                },
                importLoaders: 2,
                localsConvention: 'camelCase',
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                config: {
                  ctx: {
                    isProd,
                  },
                },
              },
            },
            'sass-loader',
          ],
          sideEffects: true,
        },
        {
          test: /\.css$/,
          use: [styleLoader, 'css-loader'],
          sideEffects: true,
        },
        {
          test: /\.less/,
          use: [
            styleLoader,
            'css-loader',
            {
              loader: 'less-loader',
              options: {
                javascriptEnabled: true,
              },
            },
          ],
          sideEffects: true,
        },
        {
          test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: `static/media/${outputMediaName}`,
                chunkFilename: `static/media/${outputMediaChunkName}`,
              },
            },
          ],
          sideEffects: false,
        },
      ],
    },
    resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'app': path.resolve(__dirname, 'src/app'),
        'features': path.resolve(__dirname, 'src/features'),
        'components': path.resolve(__dirname, 'src/components'),
        'utils': path.resolve(__dirname, 'src/utils'),
        'store': path.resolve(__dirname, 'src/store'),
      },
    },
    plugins,
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };
};
