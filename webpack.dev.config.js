/* 这是用于开发环境的webpack配置文件 */
const path = require('path'); // 获取绝对路径用
const webpack = require('webpack');       // webpack核心var HtmlWebpackPlugin = require('html-webpack-plugin');             // 动态生成html插件
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var HtmlWebpackPlugin = require('html-webpack-plugin');             // 生成html

module.exports = {
    //mode:'development',
    mode:'development',
    entry: {
        app: [
            "webpack-hot-middleware/client?reload=true&path=/__webpack_hmr", // webpack热更新插件，就这么写
            "babel-polyfill",       // babel垫片库
            "./src/index.js"        // 项目入口
        ],
    },
    output: {
        path: path.resolve(__dirname, 'build'),    // 将文件打包到此目录下
        publicPath: '/',                           // 在生成的html中，文件的引入路径会相对于此地址，生成的css中，以及各类图片的URL都会相对于此地址
        filename: '[name].[hash:6].js',
        chunkFilename: '[name].[hash:6].chunk.js',
    },
    //devtool: '#source-map',         // 报错的时候正确的输出哪一行报错
    //devtool:false,         // 报错的时候正确的输出哪一行报错

    module: {
        rules: [
            {   // .js .jsx用babel解析
                test: /\.js?$/,
                include: path.resolve(__dirname, "src"),
                loader: 'babel-loader'
            },
            {   // .css 解析
                test: /\.css$/,
                loaders: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]'
                        }
                    },
                    'postcss-loader'
                ]
            },
            {   // .less 解析 (用于解析antd的LESS文件)
                test: /\.less$/,
                loaders: ['style-loader', 'css-loader', 'postcss-loader', `less-loader`],
            },
            {   // .scss 解析
                test: /\.scss$/,
                loaders: [
                    'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            modules: true,
                            localIdentName: '[local]_[hash:base64:5]'
                        }
                    },
                    'postcss-loader',
                    'sass-loader'
                ]
            },
            {   // 文件解析
                test: /\.(eot|woff|svg|ttf|woff2|appcache|mp3|mp4|pdf)(\?|$)/,
                include: path.resolve(__dirname, "src"),
                loader: 'file-loader?name=assets/[name].[ext]'
            },
            {   // 图片解析
                test: /\.(png|jpg|gif)$/,
                include: path.resolve(__dirname, "src"),
                loader: 'url-loader?limit=8192&name=assets/[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({                     //根据模板插入css/js等生成最终HTML
            filename: 'index.html',                 //生成的html存放路径，相对于 output.path
            template: './src/index.html',           //html模板路径
            inject: true,                           // 是否将js放在body的末尾
        }),
        new webpack.HotModuleReplacementPlugin(),               // 热更新插件
        new webpack.NoEmitOnErrorsPlugin(),  // 在编译出现错误时，自动跳过输出阶段。这样可以确保编译出的资源中不会包含错误。
        new BundleAnalyzerPlugin({analyzerPort:8889}),
        new webpack.ContextReplacementPlugin(
            /moment[\\\/]locale$/,
            /^\.\/(zh-cn)$/
        ),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.less', '.css', '.scss'] //后缀名自动补全
    },
    optimization: {
        runtimeChunk:true,
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                libs: {
                    name: "chunk-libs",
                    test: /[\/]node_modules[\/]/,
                    priority: 10,
                    chunks: "initial" // 只打包初始时依赖的第三方
                },
                antd: {
                    name: "chunk-antd", // 单独将 elementUI 拆包
                    priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                    test: /[\/]node_modules[\/](antd|@ant-design)[\/]/
                },
                echarts: {
                    name: "chunk-echarts", // 单独将 elementUI 拆包
                    priority: 20, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                    test: /[\/]node_modules[\/]echarts[\/]/
                },
                moment: {
                    name: "chunk-moment", // 单独将 elementUI 拆包
                    priority: 25, // 权重要大于 libs 和 app 不然会被打包进 libs 或者 app
                    test: /[\/]node_modules[\/]moment[\/]/
                },
                commons: {
                  name: "chunk-comomns",
                  // test: resolve("src/components"), // 可自定义拓展你的规则
                  minChunks: 2, // 最小共用次数
                  priority: 5,
                  reuseExistingChunk: true
                }
            },
        },
    }
};