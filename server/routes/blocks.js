const route = require('koa-route')
const blockchain = require('../blockchain/blockchain')
const block = require('../blockchain/block')

/**
 * Get last block's header as a hashable string along with mining parameters
 * so clients can start mining the latest block immediately.
 */
exports.mine = route.get('/blocks/mine', async ctx => {
  const lastBlockHeader = await blockchain.getLastBlockHeader()
  const str = block.getHeaderStr(lastBlockHeader)

  ctx.body = {str, difficulty: 5}
})
