const route = require('koa-route')
const blockchain = require('../blockchain/blockchain')

/**
 * Get last block's header as a hashable string along with mining parameters so clients can start mining the latest block immediately.
 */
exports.mine = route.get('/blocks/mine', async ctx => {
  ctx.body = await blockchain.getMineableBlock()
})

/**
 * Creates a new block (or updates existing one) with discovered nonce that is fit for the required difficulty.
 */
exports.create = route.post('/blocks', async ctx => {
  const minedBlock = ctx.request.body
  ctx.assert(minedBlock.no, 400, '"no" field is required.')
  ctx.assert(minedBlock.nonce, 400, '"nonce" field is required.')

  const reward = await blockchain.collectMiningReward(minedBlock.no, minedBlock.nonce, ctx.state.user.uid)

  ctx.body = {reward}
  ctx.status = 201
})
