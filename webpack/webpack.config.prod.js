const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const { defaultConfig, indexPath, distPath } = require('./webpack.config');

module.exports = {
    ...defaultConfig,
    mode: 'production',
    devtool: 'source-map',
    plugins: [
        new CleanWebpackPlugin(
            [distPath],
            {
                root: process.cwd()
            }
        ),
        new HtmlWebpackPlugin({
            template: indexPath,
            inject: true,
            minify: {
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
            },
        }),
        new UglifyJsPlugin({
            uglifyOptions: {
                parse: {
                    ecma: 8,
                },
                compress: {
                    ecma: 5,
                    warnings: false,
                    comparisons: false,
                },
                mangle: {
                    safari10: true,
                },
                output: {
                    ecma: 5,
                    comments: false,
                    ascii_only: true,
                },
            },
            parallel: true,
            cache: true,
            sourceMap: true,
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[hash:8].css',
            chunkFilename: '[id].[hash:8].css',
        })
    ]
};