const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.ts',
    content: './src/content.ts',
    service_worker: './src/service_worker.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      }
    ],
  },
  // import文で拡張子を省略していても解決できるようにする
  resolve: {
    extensions: [
      '.ts',
      '.js',
    ],
  },
  output: {
    path: __dirname + '/dist',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './src/public',
        },
      ],
    }),
  ],
};
