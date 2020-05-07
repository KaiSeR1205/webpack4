let merge = require('webpack-merge');
let base = require('./webpack.base.conf');
const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');
module.exports = merge(base, {
    mode: 'production',
    // devtool: 'cheap-module-source-map',
    devtool:false,
    plugins: [
         new SkeletonWebpackPlugin({
          webpackConfig: require('./webpack.skeleton.conf'),
          quiet: true,
          minimize: true
        })
        
      ]
})