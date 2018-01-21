const Koa = require('koa')
const app = new Koa()
const firebaseConfig = require('./config/firebase')

app.use(firebaseConfig.verifyTokenMiddleware)

app.listen(3000)
