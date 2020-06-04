/* eslint-disable no-undef */
const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptmizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDEV = process.env.NODE_ENV === 'development'
const isPROD = !isDEV

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  }
  if (isPROD) {
    config.minimizer = [
      new OptmizeCssAssetsPlugin(),
      new TerserWebpackPlugin(),
    ]
  }
  return config
}

const filename = (ext) => (isDEV ? `[name].${ext}` : `[name].[hash].${ext}`)

const cssLoaders = (extraLoader) => {
  const loaders = [
      {
        loader: MiniCssExtractPlugin.loader,
        options: {
          hmr: isDEV,
          reloadAll: true,
        },
      },
      'css-loader',
  ]
  if (extraLoader) {
    loaders.push(extraLoader)
  }
  return loaders
}

const babelOptions = (preset) => {
  const options = {
    presets: [
      '@babel/preset-env'],
    plugins: [
      '@babel/plugin-proposal-class-properties',
    ],
  }

  if (preset) {
    options.presets.push(preset)
  }

  return options
}

const jsLoaders = () => {
  const loaders = [{
    loader: 'babel-loader',
    options: babelOptions(),
  }]
  if (isDEV) {
    loaders.push('eslint-loader')
  }
  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './index.js',
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isDEV,
  },
  devtool: isDEV ? 'source-map' : '',
  plugins: [
    new HTMLWebpackPlugin({
      template: './index.html',
      minify: {
        collapseWhitespace: isPROD,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/favicon.ico'),
        to: path.resolve(__dirname, 'dist'),
      },
    ]),
    new MiniCssExtractPlugin({
      filename: filename('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.less$/,
        use: cssLoaders('less-loader'),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|wof|woff2|woff|eot)$/,
        use: ['file-loader'],
      },
      {
        test: /\.xml$/,
        use: ['xml-loader'],
      },
      {
        test: /\.csv$/,
        use: ['csv-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node-modules/,
        use: jsLoaders(),
      },
      {
        test: /\.ts$/,
        exclude: /node-modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-typescipt'),
        },
      },
      {
        test: /\.jsx$/,
        exclude: /node-modules/,
        loader: {
          loader: 'babel-loader',
          options: babelOptions('@babel/preset-react'),
        },
      },
    ],
  },
}