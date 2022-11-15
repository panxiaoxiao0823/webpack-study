

const merge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const prodConfig = {
  plugins: [
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    // new HtmlWebpackPlugin({
    //   title: "ceshi document title",
    //   filename: "index.html",
    //   template: path.join(__dirname, "src/index.html"),
    // templateParameters: {
    //   foo: "bar",
    // },
    //   chunks: ["app"],
    //   inject: true,
    //   base: "https://example.com/path/page.html",
    //   minify: {
    //     html5: true,
    //     collapseWhitespace: true,
    //     preserveLineBreaks: false,
    //     minifyCSS: true,
    //     minifyJS: true,
    //     removeComments: false,
    //   },
    // }),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://cdn.staticfile.org/react/16.4.0/umd/react.development.js',
    //       global: 'React',
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://cdn.staticfile.org/react-dom/16.4.0/umd/react-dom.development.js',
    //       global: 'ReactDOM',
    //     },
    //   ]
    // }),
    new webpack.optimize.ModuleConcatenationPlugin(),
  ],
  mode: 'production',
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },
  optimization: {
    splitChunks: {
      minSize: 1000,
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};
module.exports = merge(baseConfig, prodConfig);
