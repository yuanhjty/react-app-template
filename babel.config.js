module.exports = function config(api) {
  api.cache.invalidate(() => process.env.NODE_ENV);

  return {
    plugins: ['@babel/plugin-proposal-class-properties'],
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: {
            version: 3,
          },
        },
      ],
      '@babel/preset-react',
    ],
  };
};
