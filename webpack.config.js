let webpack = require('webpack');
let path = require('path');

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const extractSass = new ExtractTextPlugin({
  filename: "css/styles.css",
  disable: process.env.NODE_ENV === "development"
});

// const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {

  entry: {
    app: path.resolve(__dirname, 'src/index.js')
  },
  watchOptions: { aggregateTimeout: 100, poll: 100 },
  output: {
    path: path.resolve(__dirname, 'public'),
    publicPath: './',
    filename: 'js/bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, loader: 'imports-loader?define=>false'},
      { 
        test: /\.pug$/, 
        use: [
          {
            loader: 'html-loader'
          }, {
            loader: 'pug-html-loader'
          }
        ]
      },
      {
        test: /\.sass$/,
        use: extractSass.extract({
          fallback: "style-loader",
          use: [{
            loader: "css-loader"
          }, {
            loader: "sass-loader"
          }]
        })
      },
      { 
        test: /\.(png|jpe?g|gif|svg)$/, 
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              publicPath: '',
              outputPath: '/img/'
            }
          },
          {
            loader: 'image-webpack-loader'
          }
        ]
      },  
      
      { test: /\.(woff|woff2|ttf|eot)/, loader: 'url-loader?limit=1' },
      { 
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
          }
        },
        exclude: [/node_modules/, /public/] 
      },
      { test: /\.jsx$/, loader: 'babel-loader', exclude: [/node_modules/, /public/] }
    ]
  },
  plugins: [
     extractSass,
     new HtmlWebpackPlugin({
       hash: true,
       filename: 'index.html',
       template: './src/template/index.pug'
     })
  ]
};
