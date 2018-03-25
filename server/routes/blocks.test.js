const assert = require('assert')
const block = require('../blockchain/block')
const db = require('../data/db')
const testData = require('../config/test').data

suite('route: blocks', () => {
  test.only('post', async () => {
    // prepare fresh block to mine
    await db.insertBlock([])
    const blockInfo = await db.getBlockInfo()

    // mine the block
    const miningRes = block.mineHeaderStr(blockInfo.miner.headerStrWithoutNonce, blockInfo.miner.targetDifficulty)

    // collect reward
    const resReward = await testData.users.u1Request.post('/blocks', {nonce: miningRes.nonce})
    assert(resReward.status === 201)
    assert(resReward.data.reward > 0)
  })
})
