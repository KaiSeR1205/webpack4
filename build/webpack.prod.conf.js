let merge = require('webpack-merge');
let base = require('./webpack.base.conf');
//const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin'); 弃用
module.exports = merge(base, {
    mode: 'production',
    // devtool: 'cheap-module-source-map',
    devtool:false,
    plugins: [
        //弃用
        //  new SkeletonWebpackPlugin({
        //   webpackConfig: require('./webpack.skeleton.conf'),
        //   quiet: true,
        //   minimize: true
        // })
        
      ]
})