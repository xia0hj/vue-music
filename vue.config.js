const registerRouter = require('./backend/router')

module.exports = {
  devServer: {
    before (app) {
      registerRouter(app)
    }
  }
}
