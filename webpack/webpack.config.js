const path = require('path');
const fs = require('fs');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const precss = require('precss');
const postcssNested = require('postcss-nested');
const postcssCalc = require('postcss-calc');
const postcssImport = require('postcss-import');
const cssnano = require('cssnano');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const srcPath = resolveApp('src');
const distPath = resolveApp('dist');
const publicPath = resolveApp('src/public');
const indexPath = resolveApp('src/public/index.html');

exports.srcPath = srcPath;
exports.distPath = distPath;
exports.publicPath = publicPath;
exports.indexPath = indexPath;

exports.defaultConfig = {
    entry: './src/app/index.ts',
    output: {
        path: distPath,
        filename: '[name].[hash:8].js',
        chunkFilename: '[name].[hash:8].chunk.js',
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|mjs)$/,
                loader: require.resolve('source-map-loader'),
                enforce: 'pre',
                include: srcPath,
            },
            {
                oneOf: [
                    {
                        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                        loader: require.resolve('url-loader'),
                        options: {
                            limit: 10000,
                            name: '[name].[hash:8].[ext]',
                        },
                    },
                    {
                        test: /\.(js|jsx|mjs)$/,
                        include: [srcPath, resolveApp('node_modules/knowledgeworker-embedded-asset-api')],
                        loader: require.resolve('babel-loader'),
                        options: {
                            compact: true,
                            presets: [require.resolve('babel-preset-latest')]
                        },
                    },
                    {
                        test: /\.(ts|tsx)$/,
                        include: [srcPath, resolveApp('node_modules/knowledgeworker-embedded-asset-api')],
                        use: [
                            {
                                loader: require.resolve('ts-loader'),
                            },
                        ],
                    },
                    {
                        test: /\.(css|scss)/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: require.resolve('css-loader'),
                                options: {
                                    importLoaders: 1,
                                    modules: false,
                                    sourceMap: true,
                                    localIdentName: "[name]__[local]___[hash:base64:5]",
                                },
                            },
                            {
                                loader: require.resolve('postcss-loader'),
                                options: {
                                    // Necessary for external CSS imports to work
                                    // https://github.com/facebookincubator/create-react-app/issues/2677
                                    ident: 'postcss',
                                    plugins: () => [
                                        postcssImport(),
                                        require('postcss-flexbugs-fixes'),
                                        autoprefixer({
                                            browsers: [
                                                '>1%',
                                                'last 4 versions',
                                                'Firefox ESR',
                                                'not ie < 9', // React doesn't support IE8 anyway
                                            ],
                                            flexbox: 'no-2009',
                                        }),
                                        precss(),
                                        postcssNested(),
                                        postcssCalc({
                                            mediaQueries: true,
                                            selectors: true
                                        }),
                                        cssnano()
                                    ],
                                },
                            },
                        ]
                    },
                    {
                        loader: require.resolve('file-loader'),
                        exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
                        options: {
                            name: '[name].[hash:8].[ext]',
                            limit: 10000,
                        },
                    }
                ],
            }
        ]
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
};