const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const tsRule = {
  test: /\.ts(x?)$/,
  exclude: /node_modules/,
  use: "ts-loader",
};

const scssRule = {
  test: /\.s[ac]ss$/i,
  exclude: /node_modules/,
  use: [
    "style-loader",
    {
      loader: "css-loader",
      options: {
        modules: true,
      },
    },
    "sass-loader",
  ],
};

const plugins = [
  new CopyWebpackPlugin({
    patterns: [{ from: "public", to: "." }],
  }),
  new CleanWebpackPlugin(),
];

module.exports = {
  entry: {
    contentScript: "./src/ContentScript/index.ts",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "dist"),
  },
  module: {
    rules: [tsRule, scssRule],
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  plugins,
};
