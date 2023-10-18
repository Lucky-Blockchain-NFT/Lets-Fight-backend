const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './index.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    plugins: [
        new webpack.IgnorePlugin({ resourceRegExp: /^pg-native$/ })
    ],
}