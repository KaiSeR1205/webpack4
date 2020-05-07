const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin") 
const assetsSubDirectory = 'public'
const port = '8087'

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

const assetsPath = function (_path) {
  return path.posix.join(assetsSubDirectory, _path)
}

console.log('context',path.resolve(__dirname, "../"))
console.log("evn",process.env.NODE_ENV)
const config = {
  context:path.resolve(__dirname, "../"),
  entry: {app: ['babel-polyfill', './src/main.js']},
  //entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, "../dist"), // 必须是绝对路径
    filename: "js/[name].[hash].js", // 「入口分块(entry chunk)」的文件名模板（出口分块？）
  },
  plugins: [ // 插件
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      minify: true, //压缩
      hash: true, //添加hash清除缓存
      inject: true
    }),
    new VueLoaderPlugin(),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`项目运行在: http://localhost:${port}`],
      }
    }),
    //并不好用 重名样式多处使用 会覆盖
    // new MiniCssExtractPlugin({
    // filename: "css/[name].[contenthash].css",
    //   chunkFilename: "css/[name].[contenthash].css",
    // })
  ],
  resolve: {
    extensions: ['.js', '.vue', '.json'], // 自动添加文件后缀
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': path.join(__dirname, '../src/components'), // 解析  src/components  => @
      'css':path.join(__dirname, '../src/assets/public/css'),  // 解析  assets/public/css  => css
      'js':path.join(__dirname, '../src/assets/public/js'),  // 解析  assets/public/js  => js
      'img':path.join(__dirname, '../src/assets/public/img'),  // 解析  assets/public/img  => img
    }
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
        //暴露$和jQuery到全局 webpack 4.0 无法使用 webpack.ProvidePlugin 引入全局包
        {
          test: require.resolve('jquery'), //require.resolve 用来获取模块的绝对路径
          use: [{
              loader: 'expose-loader',
              options: 'jQuery'
          }, {
              loader: 'expose-loader',
              options: '$'
          }]
      },
      {
        test: /\.css$/,
    　　 use: [
    //并不好用 重名样式多处使用 会覆盖
    // 　process.env.NODE_ENV!=="production"?"vue-style-loader":
    //   {
    //     loader: MiniCssExtractPlugin.loader,
    //     options: {
    //        publicPath: '../'
    //     }
    //   },
          "vue-style-loader",
  　　 　　 "css-loader"
      　]
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        exclude: path.resolve(__dirname, 'node_modules'), // 排除文件
        options: {
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
 // devtool: NODE_ENV === 'production' ? devObj.sourceMap ? '#source-map' : '' : '#eval-source-map', // 线上环境可以选择不生成map 文件
}
process.env.PORT  = port

module.exports = config
