const route = require('koa-route')
const db = require('../data/db')

exports.clear = route.del('/notifications', async ctx => {
  await db.clearNotifications(ctx.state.user.uid)
  ctx.status = 200
})
