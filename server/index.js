const Koa = require('koa')
const app = new Koa()
const firebaseConfig = require('./config/firebase')
const db = require('./data/db')

app.use(firebaseConfig.verifyTokenMiddleware)

module.exports = async () => {
  await db.init()
  app.listen(3000)
}
