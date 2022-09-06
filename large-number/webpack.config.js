const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    'large-number': './src/index.js',
    'large-number.min': './src/index.js'
  },
  output: {
    filename: '[name].js',
    library: 'resLargeNumber', // 包名
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  mode: 'none', // 如果是production则默认压缩，这里改为none，手动控制打包不压缩
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        include: /\.min\.js$/, // 正则匹配以 .min.js 结尾的打包文件
      })
    ]
  }
}
