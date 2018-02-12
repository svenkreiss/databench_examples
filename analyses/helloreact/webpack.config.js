module.exports = {
  context: __dirname,
  entry: './js/main.js',
  output: {
    path: __dirname,
    filename: './analysis.js',
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.json']
  },

  module: {
    rules: [
      { test: /\.jsx?$/, loader: 'babel-loader' },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' }
    ]
  },
}
