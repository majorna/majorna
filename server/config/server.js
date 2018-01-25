const fs = require('fs')
const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const logger = require('koa-logger')
const config = require('./config')
const firebaseConfig = require('./firebase')
const db = require('../data/db')

function koaConfig () {
  const koaApp = new Koa()

  if (!config.app.isTest) {
    koaApp.use(logger())
  }

  // middleware below this line is only reached if jwt token is valid
  koaApp.use(async (ctx, next) => {
    // token is in: headers = {Authorization: 'Bearer ' + token}
    ctx.state.user = await firebaseConfig.verifyToken()
    return next() // necessary?
  })

  koaApp.use(bodyParser())

  // mount all the routes
  fs.readdirSync('../routes').forEach(file => {
    const route = require('../routes/' + file)
    Object.keys(route).forEach(key => koaApp.use(route[key]))
  })
}

module.exports = async () => {
  await db.init()
  const koaApp = koaConfig()
  koaApp.listen(config.app.port)
  if (!config.app.isTest) {
    console.log('server listening on port ' + config.app.port)
  }
}
