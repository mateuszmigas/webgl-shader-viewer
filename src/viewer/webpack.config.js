const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'index.ts'),
  devtool: 'inline-source-map',
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../../media/'),
  },
};