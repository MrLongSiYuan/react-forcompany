var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
// var EncodingPlugin = require('webpack-encoding-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var NODE_ENV = process.env.NODE_ENV;

module.exports = {
    //页面入口文件配置
    entry: {
        main: path.resolve(__dirname, './src/main.js'),
        react: ['react', 'react-dom', 'react-router'],
        moment: ['moment']
    },
    //入口文件输出配置
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: 'dist/',
        filename: '[name].js'
    },
    module: {
        //加载器配置
        loaders: [
            {
                test: /\.jsx?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
                loader: 'babel-loader', // 加载模块 "babel" 是 "babel-loader" 的缩写
                exclude: /node_modules/,
                query: {
                    presets: ['react']
                }
            },
            {
                test: /\.css$/,
                exclude: /^node_modules$/,
                // loader: 'style-loader!css-loader'
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 1000,
                    name: '[name].[ext]?[hash:7]'
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 1000,
                    name: '[name].[hash:7].[ext]'
                }
            }
        ]
    },
    //插件项
    plugins: [
        // 分析 打包后bundle的 内容
        // new BundleAnalyzerPlugin(),

        // 移除打包后的警告
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify("production")
            }
        }),

        // 生成index.html
        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            cache: true,
            filename: NODE_ENV === 'dev' ? './index.html' : path.resolve(__dirname, './index.html'),
            template: './index.html.tpl'
        }),

        // 提取较大的依赖库
        new webpack.optimize.CommonsChunkPlugin({
            names: ['react', 'moment'],
            minChunks: 2
        }),

        // 提取样式
        new ExtractTextPlugin('main.css')
    ]
};


if (NODE_ENV === 'production') {
    // 生产环境打包
    
    // module.exports.devtool = '#source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            },
            output: {
                comments: false,
            }
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]);
} else if (NODE_ENV === 'dev') {
    // 开发环境
    
    module.exports.devtool = '#cheap-module-source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.HotModuleReplacementPlugin()
    ]);
    
    // webpack-dev-server
    module.exports.devServer = {
        // host: '192.168.1.180',
        historyApiFallback: true,
        hot: true,
        inline: true,
        open: true,
        noInfo: true,
        color: true,
        port: 8088,
        proxy: {
            '/vpn': {
                target: 'http://120.25.99.94',
                changeOrigin: true,
                pathRewrite: { '^/vpn': '' }
            }
        }
    };
}