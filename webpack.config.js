const webpack = require('webpack');

const BUILD_DIR = `${__dirname}/public/dist`;
const APP_DIR = `${__dirname}/client`;

const config = {
  entry: `${APP_DIR}/index.js`,
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: APP_DIR,
        loader: 'babel-loader'
      }
    ]
  }
};

module.exports = config;