"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const glob = require('glob');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

// 设置多页面打包方案
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/views/*/index.js'));

  Object.keys(entryFiles)
      .map((index) => {
          const entryFile = entryFiles[index];
          // '/Users/cpselvis/my-project/src/index/index.js'

          const match = entryFile.match(/src\/views\/(.*)\/index\.js/);
          const pageName = match && match[1];

          entry[pageName] = entryFile;
          htmlWebpackPlugins.push(
              new HtmlWebpackPlugin({
                  inlineSource: '.css$',
                  template: path.join(__dirname, `src/views/${pageName}/index.html`),
                  filename: `${pageName}.html`,
                  chunks: [pageName],
                  inject: true,
                  minify: {
                      html5: true,
                      collapseWhitespace: true,
                      preserveLineBreaks: false,
                      minifyCSS: true,
                      minifyJS: true,
                      removeComments: false
                  }
              })
          );
      });

  return {
      entry,
      htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
    }),
    // new OptimizeCSSAssetsPlugin({
    //   assetNameRegExp: /\.css$/g,
    //   cssProcessor: require('cssnano')
    // }),
    // new HtmlWebpackPlugin({
    //   title: "ceshi document title",
    //   filename: "index.html",
    //   template: "./src/index.html",
    //   templateParameters: {
    //     foo: "bar",
    //   },
    //   base: "https://example.com/path/page.html",
    // }),
    new CleanWebpackPlugin(),
    new FriendlyErrorsWebpackPlugin(),
  ].concat(htmlWebpackPlugins),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240, // 30KB 之内默认打包成base64
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8][ext]",
            },
          },
        ],
      },
    ],
  },
  // devtool: "source-map", // 输出 source-map 方便直接调试 ES6 源码
  mode: "development",
  devServer: {
    contentBase: "./dist",
    hot: true,
    stats: 'errors-only'
  },
};
