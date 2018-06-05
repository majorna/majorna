const route = require('koa-route')
const grpc = require('grpc')
const db = require('../data/db')

/**
 * Create user doc and return a blank response (204).
 */
exports.init = route.get('/users/init', async ctx => {
  try {
    await db.createUserDoc(ctx.state.user)
  } catch (e) {
    if (parseInt(e.code) === grpc.status.ALREADY_EXISTS) {
      console.error(`user init was called for an pre-existing user: ${ctx.state.user.uid}`)
      ctx.status = 200
      return
    } else {
      throw e
    }
  }
  ctx.status = 204
})

/**
 * Retrieves a user's full name given the exact user ID.
 */
exports.getName = route.get('/users/:id', async (ctx, id) => {
  const user = await db.getUser(id)
  ctx.body = {name: user.name}
})
