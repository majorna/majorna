const Koa = require('koa')
const app = new Koa()
const firebaseConf = require('./conf/firebase-conf')

app.use(firebaseConf.verifyTokenMiddleware)

app.listen(3000)
