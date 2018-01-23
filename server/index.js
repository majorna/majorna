const db = require('./data/db')
const config = require('./config/config')
const koaConfig = require('./config/koa')

module.exports = async () => {
  await db.init()
  const koaApp = koaConfig()
  koaApp.listen(3000)
  if (!config.app.isTest) {
    console.log('server listening on port ' + 300)
  }
}

module.exports()
