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
  koaApp.use(bodyParser())

  // mount public routes
  mountRoutes('pubroutes', koaApp)

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
  mountRoutes('routes', koaApp)

  return koaApp
}

function mountRoutes (dir, koaApp) {
  fs.readdirSync(dir).forEach(file => {
    if (file.endsWith('.test.js')) return
    const route = require(`../${dir}/` + file)
    Object.keys(route).forEach(key => koaApp.use(route[key]))
  })
}

module.exports = async () => {
  await db.init()
  console.log('server listening on port ' + config.app.port)
  return koaConfig().listen(config.app.port)
}
