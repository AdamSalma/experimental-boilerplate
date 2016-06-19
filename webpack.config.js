var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

var PATH = {
    dev:  __dirname + "/builds/development",
    prod:  __dirname + "/builds/production"
}

module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : null,
  entry: "./app/js/scripts.js",
  output: {
    path: debug ? PATH.dev : PATH.prod,
    filename: "bundle.js"
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
  ],
};