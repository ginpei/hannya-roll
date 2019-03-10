const path = require('path');
/** @type any */ const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction ? '/hannya-roll' : '';

module.exports = {
  mode: isProduction ? 'production' : 'development',
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    publicPath,
  },
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: 'public',
        ignore: ['index.html'],
      },
    ]),
    new HtmlWebpackPlugin({
      minify: isProduction && {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      template: './public/index.html',
    }),
    new InterpolateHtmlPlugin({
      NODE_ENV: process.env.NODE_ENV || 'development',
      PUBLIC_URL: publicPath,
    }),
  ],
  optimization: {
    minimize: isProduction,
  },
};
