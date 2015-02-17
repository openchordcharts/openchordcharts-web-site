var webpack = require('webpack');


var indexFile = __dirname + '/js/index.jsx';


module.exports = function(options) {
  return {
    debug: options.devServer,
    devtool: options.devServer ? 'source-map' : null,
    entry: options.devServer ? [
      'webpack-dev-server/client?http://localhost:3002',
      'webpack/hot/only-dev-server',
      indexFile,
    ] : indexFile,
    module: {
      loaders: [
        {
          exclude: /node_modules/,
          loaders: options.devServer ? ['react-hot', '6to5-loader'] : ['6to5-loader'],
          test: /\.jsx?$/,
        },
        {
          exclude: /node_modules/,
          loader: 'json-loader',
          test: /\.json$/,
        },
      ]
    },
    output: {
      filename: 'bundle.js',
      path: __dirname + '/dist',
      publicPath: options.devServer ? 'http://localhost:3002/dist/' : null,
    },
    plugins: options.devServer ? [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    ] : null,
    resolve: {
      extensions: ['', '.js', '.jsx']
    }
  };
};