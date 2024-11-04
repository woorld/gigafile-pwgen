const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup.ts',
    content: './src/content.ts',
    'service-worker': './src/service-worker.ts',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
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
    path: __dirname + '/../dist',
    clean: true,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: './src/assets',
        },
      ],
    }),
  ],
  // ソース内のライセンスを別ファイルに展開しない
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  },
};
