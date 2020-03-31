let { smart } = require('webpack-merge');
let base = require('./webpack.base.conf');

module.exports = smart(base, {
    mode: 'production',
    devtool: 'source-map',
})