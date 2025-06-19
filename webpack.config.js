/* eslint-disable no-undef */

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const packageJson = require("./package.json");

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const repoName = new URL(packageJson.homepage).pathname; // "/TextPerfect"

  return {
    entry: {
      app: path.resolve(__dirname, 'src/index.js'),
      polyfill: ['core-js/stable', 'regenerator-runtime/runtime']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      publicPath: '/',
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.html', '.js', '.jsx']
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
                '@babel/preset-typescript'
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            'style-loader', 
            'css-loader', 
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    'tailwindcss',
                    'autoprefixer',
                  ],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: 'asset/resource'
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: 'html-loader'
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
        filename: 'index.html',
        chunks: ['app', 'polyfill']
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            globOptions: {
              ignore: ['**/index.html']
            }
          }
        ]
      }),
      new webpack.DefinePlugin({
        'process.env.PUBLIC_URL': JSON.stringify('')
      })
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      server: {
        type: 'https'
      },
      port: 3002,
      historyApiFallback: true,
      hot: true,
      static: {
        directory: path.join(__dirname, 'public')
      }
    }
  };
};
