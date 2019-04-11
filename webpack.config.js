const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const project = require('./aurelia_project/aurelia.json');
const { AureliaPlugin, ModuleDependenciesPlugin } = require('aurelia-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const ensureArray = (config) => config && (Array.isArray(config) ? config : [config]) || [];
const when = (condition, config, negativeConfig) =>
  condition ? ensureArray(config) : ensureArray(negativeConfig);

const title = 'Steem Engine';
const outDir = path.resolve(__dirname, project.platform.output);
const srcDir = path.resolve(__dirname, 'src');
const nodeModulesDir = path.resolve(__dirname, 'node_modules');
const baseUrl = '/';

const cssRules = [
  { loader: 'css-loader' },
  {
    loader: 'postcss-loader',
    options: { plugins: () => [
      require('autoprefixer')({ browsers: ['last 2 versions'] }),
      require('cssnano')()
    ] }
  }
];

module.exports = ({ production, server, extractCss, coverage, analyze, karma } = {}) => ({
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [srcDir, 'node_modules'],
    alias: { 
        'aurelia-binding': path.resolve(__dirname, 'node_modules/aurelia-binding'),
        'base-environment': path.resolve(__dirname, 'aurelia_project/environments/base') 
    }
  },
  entry: {
    app: ['aurelia-bootstrapper']
  },
  mode: production ? 'production' : 'development',
  output: {
    path: outDir,
    publicPath: baseUrl,
    filename: production ? '[name].[chunkhash].bundle.js' : '[name].[hash].bundle.js',
    sourceMapFilename: production ? '[name].[chunkhash].bundle.map' : '[name].[hash].bundle.map',
    chunkFilename: production ? '[name].[chunkhash].chunk.js' : '[name].[hash].chunk.js'
  },
  optimization: {
    concatenateModules: false,
    runtimeChunk: true,
    moduleIds: 'hashed',
    concatenateModules: false,
    splitChunks: {
      hidePathInfo: true,
      chunks: "initial",
      maxSize: 200000,
      cacheGroups: {
        default: false,
        fontawesome: {
          name: 'vendor.font-awesome',
          test:  /[\\/]node_modules[\\/]font-awesome[\\/]/,
          priority: 100,
          enforce: true
        },
        bootstrap: {
          name: 'vendor.bootstrap',
          test:  /[\\/]node_modules[\\/]bootstrap[\\/]/,
          priority: 90,
          enforce: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 19,
          enforce: true,
          minSize: 30000
        },
        vendorsAsync: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors.async',
          chunks: 'async',
          priority: 9,
          reuseExistingChunk: true,
          enforce: true,
          minSize: 10000
        },
        commonsAsync: {
          name: 'commons.async',
          minChunks: 2,
          chunks: 'async',
          priority: 0,
          reuseExistingChunk: true,
          enforce: true,
          minSize: 10000
        }
      }
    }
  },
  performance: { hints: false },
  devServer: {
    contentBase: outDir,
    historyApiFallback: true
  },
  devtool: production ? 'nosources-source-map' : 'cheap-module-eval-source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: extractCss ? [{
          loader: MiniCssExtractPlugin.loader
        },
        'css-loader'
        ] : ['style-loader', ...cssRules]
      },
      {
        test: /\.css$/i,
        issuer: [{ test: /\.html$/i }],
        use: cssRules
      },
      { test: /\.html$/i, loader: 'html-loader' },
      { test: /\.ts$/, loader: "ts-loader" },
      { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
      ...when(coverage, {
        test: /\.[jt]s$/i, loader: 'istanbul-instrumenter-loader',
        include: srcDir, exclude: [/\.(spec|test)\.[jt]s$/i],
        enforce: 'post', options: { esModules: true },
      })
    ]
  },
  plugins: [
    ...when(!karma, new DuplicatePackageCheckerPlugin()),
    new AureliaPlugin(),
    new ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new ModuleDependenciesPlugin({
      'aurelia-testing': ['./compile-spy', './view-spy']
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      metadata: {
        title, server, baseUrl
      }
    }),
    ...when(extractCss, new MiniCssExtractPlugin({
      filename: production ? 'css/[name].[contenthash].bundle.css' : 'css/[name].[hash].bundle.css',
      chunkFilename: production ? 'css/[name].[contenthash].chunk.css' : 'css/[name].[hash].chunk.css'
    })),
    ...when(production || server, new CopyWebpackPlugin([
      { from: 'static', to: outDir, ignore: ['.*'] }
    ])),
    new CopyWebpackPlugin([
        { from: 'src/locales/', to: 'locales/' }
    ]),
    ...when(analyze, new BundleAnalyzerPlugin())
  ]
});
