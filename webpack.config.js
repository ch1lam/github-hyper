/*
 * @Description  :
 * @Author       : ch1lam
 * @Date         : 2022-05-28 17:45:29
 * @LastEditTime : 2022-05-28 19:56:22
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
    template: "src/views/popup.html",
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
    popup: "./src/Popup/index.tsx",
    contentScript: "./src/ContentScript/index.ts",
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
