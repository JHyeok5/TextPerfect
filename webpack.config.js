/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const urlDev = "https://localhost:3000/";
const urlProd = "https://textperfect.space/";

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = {
  entry: {
    taskpane: "./src/taskpane/taskpane.ts",
    commands: "./src/commands/commands.ts"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript"
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|jpg|jpeg|gif|ico)$/,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext][query]"
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "taskpane.html",
      template: "./src/taskpane/taskpane.html",
      chunks: ["taskpane"]
    }),
    new HtmlWebpackPlugin({
      filename: "commands.html",
      template: "./src/commands/commands.html",
      chunks: ["commands"]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets/*",
          to: "assets/[name][ext][query]"
        },
        {
          from: "manifest.xml",
          to: "[name][ext]"
        }
      ]
    })
  ],
  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    server: {
      type: "https"
    },
    port: 3000
  }
};
