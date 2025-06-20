/* eslint-disable no-undef */

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require("path");
const webpack = require("webpack");
const packageJson = require("./package.json");

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  process.env.NODE_ENV = isProduction ? 'production' : 'development';
  const repoName = new URL(packageJson.homepage).pathname; // "/TextPerfect"
  const publicPath = isProduction ? '/' : '/';

  return {
    entry: {
      app: path.resolve(__dirname, 'src/index.js'),
      polyfill: ['core-js/stable', 'regenerator-runtime/runtime']
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
      publicPath: publicPath,
      clean: true
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.html', '.js', '.jsx'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        'react': path.resolve(__dirname, 'node_modules/react'),
        'react-dom': path.resolve(__dirname, 'node_modules/react-dom')
      }
    },
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
            enforce: true
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
            enforce: true
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true
          }
        }
      },
      runtimeChunk: {
        name: 'runtime'
      },
      ...(isProduction && {
        usedExports: true,
        sideEffects: false,
        providedExports: true,
        mangleExports: 'size'
      })
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
                ['@babel/preset-env', {
                  useBuiltIns: 'entry',
                  corejs: 3,
                  modules: false,
                  targets: {
                    browsers: [">0.2%", "not dead", "not op_mini all"]
                  }
                }],
                '@babel/preset-react',
                '@babel/preset-typescript'
              ],
              plugins: [
                ['@babel/plugin-transform-runtime', {
                  corejs: false,
                  helpers: true,
                  regenerator: true,
                  useESModules: false
                }],
                ...(isDevelopment ? [require.resolve('react-refresh/babel')] : [])
              ],
              cacheDirectory: true,
              cacheCompression: false
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: !isProduction
              }
            }, 
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    'tailwindcss',
                    'autoprefixer',
                  ],
                },
                sourceMap: !isProduction
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[hash][ext]'
          }
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
        chunks: ['app', 'polyfill'],
        minify: isProduction ? {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
        } : false
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
        'process.env.PUBLIC_URL': JSON.stringify(''),
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      }),
      ...(isProduction ? [
        new MiniCssExtractPlugin({ 
          filename: '[name].[contenthash].css',
          chunkFilename: '[name].[contenthash].css'
        }),
        new webpack.optimize.AggressiveMergingPlugin()
      ] : []),
      ...(isDevelopment ? [
        new ReactRefreshWebpackPlugin()
      ] : [])
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
    },
    stats: {
      children: false,
      modules: false,
    },
    performance: {
      hints: isProduction ? 'warning' : false,
    }
  };
};
