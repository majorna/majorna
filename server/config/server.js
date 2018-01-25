const db = require('../data/db')
const config = require('./config')
const koaConfig = require('./koa')

module.exports = async () => {
  await db.init()
  const koaApp = koaConfig()
  koaApp.listen(config.app.port)
  if (!config.app.isTest) {
    console.log('server listening on port ' + config.app.port)
  }
}