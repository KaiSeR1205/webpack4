let merge = require('webpack-merge');
let base = require('./webpack.base.conf');
//const SkeletonWebpackPlugin = require('vue-skeleton-webpack-plugin');  弃用
const path = require('path')

const devObj = {
  port: 8087,
  sourceMap: true,
  host: 'localhost',
  assetsRoot: path.resolve(__dirname, '/dist'),
  assetsSubDirectory: 'public',
  assetsPublicPath: '/', // 图片相对路径
  proxy:{ 
    "/api": "http://localhost:3000"
  }
}

module.exports = merge(base, {
  mode: 'development',
  devtool: '#eval-source-map',
  devServer: {
    proxy :devObj.proxy,
    disableHostCheck: false,
    contentBase: path.join(__dirname, "dist"),
    publicPath: devObj.assetsPublicPath,
    compress: true, // 压缩
    port: devObj.port,
    hot: true, // 热加载
    open: false, //自定打开默认浏览器
    host: devObj.host,
    quiet: true,
    overlay: { warnings: false, errors: true },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(devObj.assetsPublicPath, 'index.html') },
      ],
    },
  },
  plugins: [
    //弃用
    // new SkeletonWebpackPlugin({
    //   webpackConfig: require('./webpack.skeleton.conf'),
    //   quiet: true,
    //   minimize: true
    // })
  ]
})