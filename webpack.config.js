const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: '/src/js/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'img/[name][ext]',
        clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'PinGo | Pin workout and Go',
        template: path.resolve(__dirname, 'src/html/index.html'),
        favicon: path.resolve(__dirname, 'src/img/icon.ico')
      }),
      new MiniCssExtractPlugin(),
    ],
    module: {
        rules: [
          {
            test: /\.html$/i,
            use: 'html-loader'
          },
          {
            test: /\.(s[ac]|c)ss$/i,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              {
                loader:'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: ['postcss-preset-env']
                  }
                }
              },
              'sass-loader',
            ],
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
            generator: {
              filename: 'img/[name][ext]',
            }
          },
        ]
    },
    mode: 'production',
}
