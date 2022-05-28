/*
 * @Description  :
 * @Author       : ch1lam
 * @Date         : 2022-05-28 17:45:29
 * @LastEditTime : 2022-05-28 19:41:36
 * @LastEditors  : chilam
 * @FilePath     : \github-hyper\webpack.config.js
 */
const { resolve } = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const tsRule = {
  test: /\.ts(x?)$/,
  exclude: /node_modules/,
  use: "ts-loader",
};

const plugins = [
  new HTMLWebpackPlugin({
    template: "src/popup-page/popup.html",
    filename: "popup.html",
    chunks: ["popup"],
  }),
  new CopyWebpackPlugin({
    patterns: [{ from: "public", to: "." }],
  }),
  new CleanWebpackPlugin(),
];

module.exports = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: {
    popup: "./src/popup-page/popup.tsx",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "dist"),
  },
  module: {
    rules: [tsRule],
  },
  plugins,
};
