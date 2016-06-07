'use strict';

const NODE_ENV = process.env.NODE_ENV || 'development';
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  context: __dirname + '/frontend',

  entry: {  // for liveReload: webpack-dev-server --inline --hot
    app: './app'
  },

  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename:   '[name].js'
  },

  watch: NODE_ENV == 'development',

  watchOptions: {
    aggregateTimeout: 100
  },

  devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null,

  resolve: {
    extensions: ['', '.js']
  },

  module: {

    loaders: [
    {
      loader:  "babel",
      test: /\.jsx?$/,
      include: __dirname + '/frontend',
      query: {
        presets: ['es2016']
      }
    },
    {
      test: /\.less$/,
      loader: "style!css!less"
    },
    {
      test:   /\.jade$/,
      loader: "jade"
    },
    {
      test:   /\.styl$/,
      loader: ExtractTextPlugin.extract('style', 'css!stylus?resolve url')
    }, {
      test:   /\.(png|jpg|svg|ttf|eot|woff|woff2)$/,
      loader: 'file?name=[path][name].[ext]?[hash]'
    }],

    noParse:  wrapRegexp(/\/node_modules\/(angular\/angular)/, 'noParse')
  },

  plugins: [
  new webpack.ProvidePlugin({
    lodash_: 'lodash',
    angular_: 'angular',
    angular_material: 'angular-material' // => modules/js/button
  }),
  new webpack.optimize.CommonsChunkPlugin({name: "common"}),
  new ExtractTextPlugin('[name].css', {allChunks: true, disable: process.env.NODE_ENV=='development'})
  ],

  devServer: {
    host: 'localhost',
    port: 8092,
    contentBase: __dirname + '/backend',
    hot: true
  }
};

function wrapRegexp(regexp, label) {
  regexp.test = function(path) {
    console.log(label, path);
    return RegExp.prototype.test.call(this, path);
  };
  return regexp;
}