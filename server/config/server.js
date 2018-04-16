const fs = require('fs')
const bodyParser = require('koa-bodyparser')
const Koa = require('koa')
const logger = require('koa-logger')
const cors = require('kcors')
const config = require('./config')
const firebaseConfig = require('./firebase')
const db = require('../data/db')
const AssertionError = require('assert').AssertionError

function koaConfig () {
  const koaApp = new Koa()
  koaApp.use(logger())
  koaApp.use(cors())

  // middleware below this line is only reached if jwt token is valid
  koaApp.use(async (ctx, next) => {
    ctx.assert(ctx.headers.authorization, 401, 'Authorization header cannot be empty.')
    try {
      ctx.state.user = await firebaseConfig.verifyIdToken(ctx.headers.authorization.substring(7)/* strip 'Bearer ' prefix */)
    } catch (err) {
      config.app.debugMode && console.log(err)
      ctx.throw(401, 'Invalid authorization token.')
    }
    return next()
  })

  koaApp.use(bodyParser())

  // AssertionError, utils.UserVisibleError, and any error with Error.expose = true set are user visible and return status = 400 (bad request)
  // for these errors, error details are sent to the user and not logged to console (unless debug mode is on)
  koaApp.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      config.app.debugMode && (err instanceof AssertionError || err.expose) && console.log(err)
      err instanceof AssertionError && ctx.throw(400, err.message)
      throw err
    }
  })

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
