const db = require('./data/db')
const config = require('./config/config')
const koaConfig = require('./config/koa')

module.exports = async () => {
  await db.init()
  const koaApp = koaConfig()
  koaApp.listen(config.app.port)
  if (!config.app.isTest) {
    console.log('server listening on port ' + config.app.port)
  }
}

module.exports()
