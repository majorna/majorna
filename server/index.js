const Koa = require('koa')
const app = new Koa()
const fbConf = require('./fb-conf')

app.use(fbConf.verifyTokenMiddleware);

app.listen(3000);