

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const webpack = require('webpack');
const glob = require('glob');
const cssnano = require('cssnano');

// 设置多页面打包方案
const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(__dirname, './src/views/*/index-server.js'));

  Object.keys(entryFiles).forEach((index) => {
    const entryFile = entryFiles[index];
    // '/Users/cpselvis/my-project/src/index/index.js'

    const match = entryFile.match(/src\/views\/(.*)\/index-server\.js/);
    const pageName = match && match[1];

    entry[pageName] = entryFile;
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        inlineSource: '.css$',
        template: path.join(__dirname, `src/views/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['vendors', pageName],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: false,
          minifyCSS: true,
          minifyJS: true,
          removeComments: false,
        },
      }),
    );
  });

  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(__dirname, 'dist'),
    // filename: "[name]_[chunkhash:8].js",
    filename: '[name]-server.js',
    libraryTarget: 'umd', // 注意，ssr这里需要指定libraryTarget
  },
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
  ].concat(htmlWebpackPlugins),
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
