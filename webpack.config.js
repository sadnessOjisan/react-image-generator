const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: 'development',
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: 'index.html',
        }),
    ],
    module: {
        rules: [{
            test: /\.js/,
            exclude: /node_modules/,
            use: 'babel-loader',
        }, {
            test: /\.css/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        url: false
                    }
                },
            ],
        }, ]
    },
    devServer: {
        contentBase: path.resolve(__dirname, 'dist'),
        historyApiFallback: true,
    },
    resolve: {
        extensions: [
            '.js'
        ],
    }
};