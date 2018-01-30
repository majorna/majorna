const assert = require('assert')
const fs = require('fs')
const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const logger = require('koa-logger')
const config = require('./config')
const firebaseConfig = require('./firebase')
const db = require('../data/db')

function koaConfig () {
  const koaApp = new Koa()
  koaApp.use(logger())

  // middleware below this line is only reached if jwt token is valid
  koaApp.use(async (ctx, next) => {
    assert(ctx.headers.Authorization, 'authorization header cannot be empty')
    ctx.state.user = await firebaseConfig.verifyIdToken(ctx.headers.Authorization)
    return next() // todo: necessary?
  })

  koaApp.use(bodyParser())

  // mount all the routes
  fs.readdirSync('routes').forEach(file => {
    if (file.endsWith('.test.js')) return
    const route = require('../routes/' + file)
    Object.keys(route).forEach(key => koaApp.use(route[key]))
  })

  return koaApp
}

module.exports = async () => {
  await db.init()
  console.log('server listening on port ' + config.app.port)
  return koaConfig().listen(config.app.port)
}
