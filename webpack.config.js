const path = require('path');

module.exports = {
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, 'js/index.js'),
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [{ 
                    loader: 'style-loader' 
                }, {
                    loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                    loader: 'sass-loader' // compiles Sass to CSS
                }]
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '../php-engine/public/js'),
    },
};