const registerRouter = require('./backend/router')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  devServer: {
    before (app) {
      registerRouter(app)
    }
  },
  configureWebpack: (config) => {
    config.devtool = 'source-map'
    if (process.env.npm_config_report) {
      const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
      config.plugins.push(new BundleAnalyzerPlugin())
    }

    config.plugins.push(new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css)$/g,
      // threshold: 10240, // 对超过10k的数据进行压缩
      minRatio: 0.8 // 压缩比例，值为0 ~ 1,
    }))

    // 以下插件由 CDN 引入
    config.externals = {
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      axios: 'axios'
    }
  },
  productionSourceMap: false,
  // 生产环境中路径为 /ip:port/vue-music ，开发环境中路径为 /ip:port/
  publicPath: process.env.NODE_ENV === 'production' ? '/vue-music/' : '/'
}
