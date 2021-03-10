const path = require('path');

module.exports = {
  entry: path.resolve(__dirname, 'src/index.tsx'),
  devtool: 'inline-source-map',
  mode: "production",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, '../../media/'),
  },
  performance: {
    // todo
    maxEntrypointSize: 2024000,
    maxAssetSize: 2024000
  }
};