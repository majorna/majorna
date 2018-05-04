const route = require('koa-route')

exports.init = route.get('/ping', async ctx => { ctx.body = 'pong' })
