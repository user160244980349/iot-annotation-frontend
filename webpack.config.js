const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, 'js/index.js'),
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            Popper: ['popper.js', 'default']
        })
    ],
    module: {
        rules: [
            {
              test: /\.js$/,
              enforce: "pre",
              use: [{
                    loader: "source-map-loader"
                }]
            },
            {
                test: /\.(scss)$/,
                use: [{ 
                    loader: 'style-loader' 
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
            {
                test: /\.(woff|woff2|ttf|svg|eot)/,
                use: [{ 
                    loader: 'url-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: '../fonts/',  
                        publicPath: '../static/fonts'
                    }
                }]
            }
        ],
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/js'),
    },
};