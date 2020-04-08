const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
    
    let prod = env !== undefined && env.production === true;

    return {

        devtool: prod ? 'source-map' : 'eval-cheap-module-source-map',
        
        entry: {
            'app': './src/js/app.js',
            'sign-up': './src/js/sign-up.js'   
        },
        
        devServer: {
            contentBase: './dist',
            index: 'register.html'
        },
        
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: prod ? 'css/[name].[hash].css' : 'css/[name].css' 
            }),
            new HtmlWebpackPlugin({
                filename: 'login.html',
                template: './src/templates/login.html',
                chunks: ['app']
            }),
            new HtmlWebpackPlugin({
                filename: 'register.html',
                template: './src/templates/register.html',
                chunks: ['app', 'sign-up']
            }),
        ],
        
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        prod ? { loader: MiniCssExtractPlugin.loader, options: { publicPath: '../' } } : { loader: 'style-loader' },
                        { loader: 'css-loader',  options: { sourceMap: true } },
                        { loader: 'postcss-loader',  options: { sourceMap: true } },
                        { loader: 'sass-loader', options: { sourceMap: true } }
                    ],
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 1000,
                            name: '[name].[ext]',
                            outputPath: 'assets/fonts',
                            publicPath: '../assets/fonts',
                        }
                    },
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 1000,
                            name: '[name].[ext]',
                            outputPath: 'assets/images',
                            esModule: false,
                        }
                    },
                },
            ]
        },

        output: {
            path: path.resolve(__dirname, 'dist/'), 
            filename: prod ? "js/[name].[chunkhash].js" : "js/[name].js"
        },

    }
}