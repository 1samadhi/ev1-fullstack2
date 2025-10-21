const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  return {
    mode: isProd ? 'production' : 'development',
    entry: path.resolve(__dirname, 'src', 'main.jsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProd ? 'assets/[name].[contenthash].js' : 'assets/[name].js',
      assetModuleFilename: 'assets/[hash][ext][query]',
      publicPath: '/',
      clean: true,
    },
    devtool: isProd ? 'source-map' : 'eval-cheap-module-source-map',
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }],
              ],
            },
          },
        },
        {
          test: /\.css$/i,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('@tailwindcss/postcss'),
                    require('autoprefixer'),
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
        inject: 'body',
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: path.resolve(__dirname, 'public'), to: path.resolve(__dirname, 'dist') }],
      }),
    ],
    devServer: {
      static: {
        directory: path.resolve(__dirname, 'public'),
      },
      port: 5173,
      open: true,
      hot: true,
      historyApiFallback: true,
    },
  };
};