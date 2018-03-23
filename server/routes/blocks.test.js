const assert = require('assert')
const block = require('../blockchain/block')
const db = require('../data/db')
const testData = require('../config/test').data

suite('route: blocks', () => {
  test('post', async () => {
    // setup block info meta doc
    const initDifficulty = 1
    const genesisBlock = block.getGenesisBlock()
    genesisBlock.header.no = 234
    const newBlock = block.sign(block.create([], genesisBlock.header))
    const blockInfo = {
      header: newBlock.header,
      miner: {
        headerStrWithoutNonce: block.getHeaderStr(newBlock.header, true, initDifficulty),
        targetDifficulty: initDifficulty,
        reward: block.getBlockReward(initDifficulty)
      }
    }
    await db.insertBlock(newBlock, blockInfo)

    // mine the block
    const miningRes = block.mineHeaderStr(blockInfo.miner.headerStrWithoutNonce, blockInfo.miner.targetDifficulty)

    // collect reward
    const resReward = await testData.users.u1Request.post('/blocks', {nonce: miningRes.nonce})
    assert(resReward.status === 201)
    assert(resReward.data.reward > 0)
  })
})
