"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const glob = require("glob");
const HtmlWebpackExternalsPlugin = require("html-webpack-externals-plugin");
// const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
// const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin'); // 分析构建速度插件
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// const smp = new SpeedMeasureWebpackPlugin();
const TerserPlugin = require('terser-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')

// 设置多页面打包方案
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, "./src/views/*/index.js"));
  const dllFiles = glob.sync(path.join(__dirname, "./build/library/*.js"));
  const dllFilesName = dllFiles.map(dllFile => '../build/library/' + dllFile.split('/').slice(-1)); // ["./build/library/library_[hash].dll.js"]

  Object.keys(entryFiles).map((index) => {
    const entryFile = entryFiles[index];
    // '/Users/cpselvis/my-project/src/index/index.js'

    const match = entryFile.match(/src\/views\/(.*)\/index\.js/);
    const pageName = match && match[1];

    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        inlineSource: ".css$",
        template: path.join(__dirname, `src/views/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ["vendors", pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
        dlls: dllFilesName
      })
    );
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry: entry,
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name]_[chunkhash:8].js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name]_[contenthash:8].css",
    }),
    new OptimizeCSSAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require("cssnano"),
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
    new CleanWebpackPlugin(),
    // new FriendlyErrorsWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require('./build/library/library.json')
    }), // 预编译分包
    new HardSourceWebpackPlugin(),
  ].concat(htmlWebpackPlugins),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'thread-loader', // 并行构建
            options: {
                workers: 3 // 开启3个worker进行打terser-webpack-plugin包
            }
          },
          'babel-loader?cacheDirectory=true',
          // 'eslint-loader'
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("autoprefixer")({
                  browsers: ["last 2 version", ">1%", "ios 7"],
                }),
              ],
            },
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75, // 1rem = 75px，则750px等于10rem，可根据设计稿灵活设置
              remPrecision: 8, // px转换为rem单位时保留的小数位数
            },
          },
        ],
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: () => [
                require("autoprefixer")({
                  browsers: ["last 2 version", ">1%", "ios 7"],
                }),
              ],
            },
          },
          {
            loader: "px2rem-loader",
            options: {
              remUnit: 75, // 1rem = 75px，则750px等于10rem，可根据设计稿灵活设置
              remPrecision: 8, // px转换为rem单位时保留的小数位数
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name]_[hash:8].[ext]",
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
              name: "[name]_[hash:8].[ext]",
            },
          },
        ],
      },
    ],
  },
  mode: "production",
  devtool: "cheap-module-source-map",
  // externals: {
  //   react: 'React',
  //   'react-dom': 'ReactDOM',
  // },
  // optimization: {
  //   splitChunks: {
  //     minSize: 1000,
  //     cacheGroups: {
  //       commons: {
  //         name: "commons",
  //         chunks: "all",
  //         minChunks: 2,
  //       },
  //     },
  //   },
  // },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        cache: true
      }) // 并行压缩
    ]
  },
  resolve: {
    alias: {
      'react': path.resolve(__dirname, './node_modules/react/umd/react.production.min.js'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom/umd/react-dom.production.min.js'),
    }, // 减少业务组件中import react 的查询，直接到指定位置查询，减少文件搜索范围
    extensions: ['.js'], // 业务中引入模块时不带扩展时，尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件并跳过其余的后缀，减少文件搜索范围；适用于ts文件 extensions: ['.ts', '...'] ，优先查找ts文件，没有ts文件则按照默认数组查询(...)
    mainFields: ['main'], // 指定不同环境下都适用package.json中的main字段作为入口文件
  }
  // stats: 'errors-only'
};
