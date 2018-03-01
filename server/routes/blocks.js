const route = require('koa-route')
const blockchain = require('../blockchain/blockchain')
const block = require('../blockchain/block')

/**
 * Get last block's header as a hashable string along with mining parameters
 * so clients can start mining the latest block immediately.
 */
exports.mine = route.get('/blocks/mine', async ctx => {
  const lastBlockHeader = await blockchain.getLastBlockHeader()
  const str = block.getHeaderStr(lastBlockHeader, true)

  // todo: difficulty & reward must be calculated by block.js to have it centrally
  ctx.body = {
    no: lastBlockHeader.no,
    str,
    reward: lastBlockHeader.difficulty * 10,
    difficulty: lastBlockHeader.difficulty + 1
  }
})

exports.create = route.post('/blocks', async ctx => {
  const minedBlock = ctx.request.body
  ctx.assert(minedBlock.no, 400, '"no" field is required.')
  ctx.assert(minedBlock.hash, 400, '"hash" field is required.')

  // todo: get reward from block.js (see above todo)
  // replace existing block with this one if hash is valid and is bigger
  // if hash is smaller, still give reward based on difficulty (minedBlock.difficulty * 10)
  await db.makeTx('majorna', ctx.state.user.uid, 10)

  ctx.status = 201
})