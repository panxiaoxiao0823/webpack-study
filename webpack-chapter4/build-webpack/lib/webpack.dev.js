

const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base');

const devConfig = {
  mode: 'development',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  devtool: 'source-map', // 输出 source-map 方便直接调试 ES6 源码
  devServer: {
    contentBase: './dist',
    hot: true,
    stats: 'errors-only',
  },
};

module.exports = merge(baseConfig, devConfig);
