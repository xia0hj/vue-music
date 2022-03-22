module.exports = {
  devServer: {
    before (app) {
      require('./backend/router')
    }
  }
}
