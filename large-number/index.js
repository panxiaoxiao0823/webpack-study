if(process.env.NODE_ENV === 'production') {
  // 线上环境 使用压缩包
  module.exports = require('./dist/large-number.min.js')
} else {
  // 开发环境 使用未压缩包
  module.exports = require('./dist/large-number.js')
}