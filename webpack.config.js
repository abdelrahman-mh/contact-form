const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isDevelopment = argv.mode === 'development';

  return {
    entry: './src/index.ts',
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true, // Enable built-in output cleaning
    },
    devtool: isDevelopment ? 'source-map' : false, // Enable source maps in development
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          include: path.resolve(__dirname, 'src'),
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
      new CleanWebpackPlugin(), // Automatically clean output directory
      new HtmlWebpackPlugin({
        title: 'Our Project',
        template: 'src/index.html',
      }),
      // new CopyPlugin({
      //   patterns: [
      //     { from: 'src/assets', to: 'assets/img' }, // Simplified to avoid leading slash
      //   ],
      // }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode), // Add environment variables
      }),
    ],
    devServer: {
      static: path.join(__dirname, 'dist'),
      compress: true,
      port: 4000,
      hot: true, // Enable Hot Module Replacement
      open: true, // Automatically open the browser
    },
  };
};
