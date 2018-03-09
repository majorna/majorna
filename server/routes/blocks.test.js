const assert = require('assert')
const block = require('../blockchain/block')
const testData = require('../config/test').data

suite('route: blocks', () => {
  test('get', async () => {
    const res = await testData.users.u1Request.get('/blocks')
    assert(res.status === 200)
    assert(res.data.targetDifficulty > 0)
    assert(res.data.headerString.length > 10)
  })

  test('post', async () => {
    const res = await testData.users.u1Request.get('/blocks')
    assert(res.status === 200)
    const mineableBlockHeader = res.data
    const lastBlockHeader = mineableBlockHeader.headerObject
    lastBlockHeader.time = new Date(lastBlockHeader.time)
    block.mineBlock(lastBlockHeader, mineableBlockHeader.targetDifficulty)

    const resReward = await testData.users.u1Request.post('/blocks', {no: lastBlockHeader.no, nonce: lastBlockHeader.nonce})
    assert(resReward.status === 201)
    assert(resReward.data.reward > 0)
  })
})
