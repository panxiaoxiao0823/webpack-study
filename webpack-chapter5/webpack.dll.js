
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    library: [
      'react',
      'react-dom'
    ]
  },
  output: {
    filename: '[name]_[chunkhash].dll.js', // 构建出的基础包文件名称
    path: path.join(__dirname, 'build/library'), // 构建的基础包输出地方
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_[hash]',
      path: path.join(__dirname, 'build/library/[name].json') // 生成的manifest.json文件位置
    })
  ]
}