const fs = require('fs')
const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const logger = require('koa-logger')
const config = require('./config')
const firebaseConfig = require('./config/firebase')

module.exports = () => {
  const koaApp = new Koa()

  if (!config.app.isTest) {
    koaApp.use(logger())
  }

  koaApp.use(bodyParser())

  // middleware below this line is only reached if jwt token is valid
  koaApp.use(async (ctx, next) => {
    // token is in: headers = {Authorization: 'Bearer ' + token}
    await firebaseConfig.verifyToken()
    return next() // necessary?
  })

  // mount all the routes
  fs.readdirSync('../routes').forEach(file => require('../routes/' + file).init(koaApp))
}
