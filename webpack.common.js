const { resolve } = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const tsRule = {
  test: /\.ts$/,
  exclude: /node_modules/,
  use: {
    loader: "ts-loader",
    options: {
      onlyCompileBundledFiles: true,
    },
  },
};

const scssRule = {
  test: /\.s[ac]ss$/i,
  exclude: /node_modules/,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: "css-loader",
      options: {
        modules: {
          namedExport: false,
        },
      },
    },
    "sass-loader",
  ],
};

const plugins = [
  new CopyWebpackPlugin({
    patterns: [{ from: "public", to: "." }],
  }),
  new MiniCssExtractPlugin({ filename: "[name].css" }),
];

module.exports = {
  entry: {
    contentScript: "./src/ContentScript/index.ts",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "dist"),
    clean: true,
  },
  target: ["web", "es2022"],
  module: {
    rules: [tsRule, scssRule],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
  plugins,
};
