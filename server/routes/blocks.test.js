const assert = require('assert')
const block = require('../blockchain/block')
const testData = require('../config/test').data

suite('route: blocks', () => {
  test('post', async () => {
    const res = await testData.users.u1Request.get('/blocks')
    assert(res.status === 200)
    const mineableBlockHeader = res.data
    const lastBlockHeader = mineableBlockHeader.headerObject
    lastBlockHeader.time = new Date(lastBlockHeader.time)
    lastBlockHeader.difficulty = mineableBlockHeader.targetDifficulty
    block.mineBlock(lastBlockHeader)

    const resReward = await testData.users.u1Request.post('/blocks', {no: lastBlockHeader.no, nonce: lastBlockHeader.nonce})
    assert(resReward.status === 201)
    assert(resReward.data.reward > 0)
  })
})
