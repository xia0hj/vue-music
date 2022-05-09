const registerRouter = require('./backend/router')

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
  }
}
