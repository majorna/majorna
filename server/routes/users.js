const route = require('koa-route')
const db = require('../data/db')

exports.init = route.get('/users/init', ctx => db.createUserDoc(ctx.state.user))
