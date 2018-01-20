const Koa = require('koa')
const app = new Koa()
const firebaseConfig = require('./config/firebase-config')

app.use(firebaseConfig.verifyTokenMiddleware)

app.listen(3000)
