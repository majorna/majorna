const route = require('koa-route')
// const db = require('../data/db')

/**
 * Send majorna to another user.
 */
exports.send = route.get('/users/send', async ctx => {
  ctx.status = 501
})
