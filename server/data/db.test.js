const assert = require('assert')
const db = require('./db')
const txUtils = require('../blockchain/tx')
const blockUtils = require('../blockchain/block')
const blockchainUtils = require('../blockchain/blockchain')
const testData = require('../config/test').data

suite('db', () => {
  test('init', async () => {
    await db.init()
    await db.init()
  })

  test('getMjMeta', async () => {
    const meta = await db.getMjMeta()
    assert(meta.cap >= 500)
    assert(meta.val >= 0)
    assert(meta.userCount >= 0)
  })

  test('setBlockInfo, getBlockInfo', async () => {
    const initBlockInfo = await db.getBlockInfo()
    await db.setBlockInfo({randomField: 'yeah'})
    const laterBlockInfo = await db.getBlockInfo()

    assert(!initBlockInfo.randomField)
    assert(laterBlockInfo.randomField === 'yeah')
  })

  test('getUser', async () => {
    const user = await db.getUser('1')
    assert(user.name)

    let err = null
    try { await db.getUser('98u23hkasd8') } catch (e) { err = e }
    assert(err)
  })

  test('createUserDoc', async () => {
    const uid = '3'
    const starterBalance = 500
    const testUserData = testData.users.u3Doc
    const meta = await db.getMjMeta()

    const newUserData = await db.createUserDoc(testUserData, uid)

    // verify market cap increase
    const metaAfter = await db.getMjMeta()
    assert(metaAfter.cap === meta.cap + starterBalance)
    assert(metaAfter.userCount === meta.userCount + 1)

    // verify user doc fields
    const userDoc = await db.getUser(uid)
    assert(userDoc.email === testUserData.email)
    assert(userDoc.name === testUserData.name)
    assert(userDoc.created.getTime() === newUserData.created.getTime())
    assert(userDoc.balance === testUserData.balance)
    assert(userDoc.txs.length === 1)

    // verify tx in txs collection
    const tx = await db.getTx(userDoc.txs[0].id)
    assert(txUtils.verify(tx))
    assert(tx.from.id === 'majorna')
    assert(tx.to.id === uid)
    assert(tx.time.getTime() === userDoc.created.getTime())
    assert(tx.amount === starterBalance)

    // try to create user again and verify error
    let err = null
    try { await db.createUserDoc(testUserData, uid) } catch (e) { err = e }
    assert(err)
  })

  test('getTx', async () => {
    const tx0 = testData.txs[0]
    const tx = await db.getTx('0')
    assert(txUtils.verify(tx))
    assert(tx.id === tx0.id)
    assert(tx.from.id === tx0.from.id)

    // inexisting tx
    let err = null
    try { await db.getTx('sdaf089y097gs') } catch (e) { err = e }
    assert(err.status === 404)
  })

  test('getTxsByTimeRange', async () => {
    const now = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const txs = await db.getTxsByTimeRange(yesterday, now)

    // verify individual txs
    assert(txs.length >= testData.txs.length)
    assert(txs[0].from.id === testData.txs[0].from.id)
    txs.forEach(tx => assert(txUtils.verify(tx)))
    // note: assumes no txs happened between this test and testdata
    txs.forEach(tx => assert(tx.time.getTime() > yesterday.getTime() && tx.time.getTime() < now.getTime()))

    // todo: create several close txs and do precise time range get and make sure that we only get the right one
  })

  test('makeTx', async () => {
    // make a valid tx
    const from = '1'
    const to = '2'
    const senderInitBalance = (await db.getUser(from)).balance
    const receiverInitBalance = (await db.getUser(to)).balance
    const amount = 100
    const newTx = await db.makeTx(from, to, amount)

    // validate tx in txs col
    const tx = await db.getTx(newTx.id)
    assert(txUtils.verify(tx))
    assert(tx.from.id === from)
    assert(tx.to.id === to)
    assert(tx.time.getTime() === newTx.time.getTime())
    assert(tx.amount === amount)

    // validate affected user docs
    const sender = await db.getUser(from)
    assert(sender.balance === senderInitBalance - amount)
    const senderTx = sender.txs[0]
    assert(senderTx.to === to)
    assert(senderTx.time.getTime() === newTx.time.getTime())
    assert(senderTx.amount === amount)

    const receiver = await db.getUser(to)
    assert(receiver.balance === receiverInitBalance + amount)
    const receiverTx = receiver.txs[0]
    assert(receiverTx.from === from)
    assert(receiverTx.time.getTime() === newTx.time.getTime())
    assert(receiverTx.amount === amount)
  })

  test('makeTx: invalid', async () => {
    let err = null // insufficient funds
    try { await db.makeTx('1', '2', 500 * 1000) } catch (e) { err = e }
    assert(err)

    err = null // missing args
    try { await db.makeTx() } catch (e) { err = e }
    assert(err)

    err = null // inexistent sender
    try { await db.makeTx('asdf98709ysadgfg', '2', 10) } catch (e) { err = e }
    assert(err)

    err = null // inexistent receiver
    try { await db.makeTx('1', '129807aysdfiopohasdf', 10) } catch (e) { err = e }
    assert(err)

    err = null // amount should be integer
    try { await db.makeTx('1', '1', 5.1) } catch (e) { err = e }
    assert(err)

    err = null // tx to self is not allowed
    try { await db.makeTx('1', '1', 10) } catch (e) { err = e }
    assert(err)
  })

  test('insertBlock', async () => {
    const someBlock = {header: {no: 1234}}
    const initBlockInfo = await db.getBlockInfo()

    await db.insertBlock(someBlock, {no: someBlock.header.no})
    const laterBlockInfo = await db.getBlockInfo()

    assert(initBlockInfo.no !== someBlock.header.no)
    assert(laterBlockInfo.no === someBlock.header.no)
  })

  test('giveMiningReward', async () => {
    const from = 'majorna'
    const to = '1'
    let receiverInitBalance = (await db.getUser(to)).balance
    const initMeta = await db.getMjMeta()

    // create fresh new block to mine
    const previousBlockHeader = (await db.getBlockInfo()).header
    const blockToMine = await db.insertBlock([])

    // mine->reward->mine->reward loop
    let lastDifficulty = 0
    let totalReward = 0
    for (let i = 0; i < 7; i++) {
      const blockInfo = await db.getBlockInfo()
      assert(blockInfo.miner.targetDifficulty === lastDifficulty + blockchainUtils.blockDifficultyIncrementStep)

      // mine the block
      const miningRes = blockUtils.mineHeaderStr(blockInfo.miner.headerStrWithoutNonce, blockInfo.miner.targetDifficulty)
      assert(miningRes.difficulty > lastDifficulty)
      lastDifficulty = miningRes.difficulty

      // collect reward
      const rewardTx = await db.giveMiningReward(to, miningRes.nonce)

      // validate tx in txs col
      const retrievedRewardTx = await db.getTx(rewardTx.id)
      assert(txUtils.verify(retrievedRewardTx))
      assert(retrievedRewardTx.from.id === from)
      assert(retrievedRewardTx.to.id === to)
      assert(retrievedRewardTx.time.getTime() === rewardTx.time.getTime())
      assert(retrievedRewardTx.amount === blockUtils.getBlockReward(miningRes.difficulty))

      // validate affected user doc
      const receiver = await db.getUser(to)
      assert(receiver.balance === receiverInitBalance + retrievedRewardTx.amount)
      receiverInitBalance = receiver.balance
      const receiverTx = receiver.txs[0]
      assert(receiverTx.from === from)
      assert(receiverTx.time.getTime() === retrievedRewardTx.time.getTime())
      assert(receiverTx.amount === retrievedRewardTx.amount)
      totalReward += retrievedRewardTx.amount

      // verify market cap increase
      const metaAfter = await db.getMjMeta()
      assert(metaAfter.cap === initMeta.cap + totalReward)

      // verify last block update
      const lastBlock = await db.getBlock(blockToMine.header.no)
      assert(lastBlock.header.difficulty === blockInfo.miner.targetDifficulty)
      assert(lastBlock.header.nonce === miningRes.nonce)
      blockUtils.verify(lastBlock, previousBlockHeader)

      // verify block info update
      const updatedBlockInfo = await db.getBlockInfo()
      lastBlock.header = updatedBlockInfo.header
      blockUtils.verify(lastBlock, previousBlockHeader)
      assert(updatedBlockInfo.miner.targetDifficulty > blockInfo.miner.targetDifficulty)
      assert(updatedBlockInfo.miner.reward > blockInfo.miner.reward)
      assert(updatedBlockInfo.miner.headerStrWithoutNonce !== blockInfo.miner.headerStrWithoutNonce)
    }
  })
})
