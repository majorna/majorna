const route = require('koa-route')
const db = require('../data/db')
const AssertionError = require('assert').AssertionError
const PublicError = require('../data/utils').PublicError

/**
 * Create user doc and return a blank response (204).
 */
exports.init = route.get('/users/init', async ctx => {
  try {
    await db.createUserDoc(ctx.state.user)
  } catch (e) {
    console.error(e)
    if (e instanceof PublicError || e instanceof AssertionError) {
      ctx.throw(400, e.message)
    }
    ctx.throw(400, 'User initialization failed.')
  }
  ctx.status = 204
})

exports.get = route.get('/users/:id', async (ctx, id) => {
  try {
    const user = await db.getUser(id)
    ctx.body = {
      name: user.name
    }
  } catch (e) {
    console.error(e)
    ctx.throw(404, 'User not found.')
  }
})
