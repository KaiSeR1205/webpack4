const path = require('path') 
const merge = require('webpack-merge') 
const base = require('./webpack.base.conf') 
const nodeExternals = require('webpack-node-externals')

function resolve(dir) {
  return path.join(__dirname, dir)
}

let skeletonWebpackConfig = merge(base, {
  target: 'node',
  devtool: false,
  entry: {
    app: resolve('../src/entry-skeleton.js')
  },
  output: Object.assign({}, base.output, {
    libraryTarget: 'commonjs2'
  }),
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  plugins: []
})

module.exports = skeletonWebpackConfig
