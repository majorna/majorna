const assert = require('assert')
const config = require('../config/config')
const db = require('./db')
const txUtils = require('../blockchain/tx')
const blockUtils = require('../blockchain/block')
const testData = require('../config/test').data

suite('db', () => {
  test('firestore access rules', async () => {
    // todo: people can only read their user doc and cannot write to it
    // todo: people can't read others' transactions
    // todo: none of the collections/docs are writeable/deleteable/etc.

    const firestore = testData.users.u1FBClient.firestore()

    const userDoc = await firestore.collection('users').doc('1').get()
    assert(userDoc.exists)
    assert(userDoc.data().email = testData.users.u1Doc.email)

    // const querySnapshot = await firestore.collection('txs').get()
    // querySnapshot.forEach(txDoc => {
    //   const tx = txDoc.data()
    //   assert(tx.from === '1' || tx.to === '1')
    // })
  })

  test('firestoreTransaction', async () => {
    // todo: test that a transaction fails if an exception is thrown inside it and half committed data does not corrupt the database
  })

  test('init', async () => {
    await db.init()
    await db.init()
  })

  test('getMjMeta', async () => {
    const meta = await db.getMjMeta()
    assert(meta.marketCap >= 500)
    assert(meta.val >= 0)
    assert(meta.userCount >= 0)
  })

  test('updateMjMetaStatsIfRequired', async () => {
    // todo: add 5000+ txs and make sure that they are properly paginated and only 5000 reads occur (otherwise we can hit firestore limit)
    // todo: also make sure that startAt, stopBefore conditions are working correctly and it's not starting all the way back from 1st tx etc.
    const now = new Date()
    const metaBefore = await db.getMjMeta()
    assert(!metaBefore.monthly.txVolume)

    const updated = await db.updateMjMetaStatsIfRequired(now)
    assert(updated)

    const metaAfter = await db.getMjMeta()
    assert(metaAfter.monthly.txVolume)

    // no updates required
    const updated2 = await db.updateMjMetaStatsIfRequired(now)
    assert(!updated2)

    const metaAfter2 = await db.getMjMeta()
    assert(metaAfter2.monthly.updated.getTime() === metaAfter.monthly.updated.getTime())
    assert(metaAfter2.monthly.txVolume === metaAfter.monthly.txVolume)
  })

  test('getBlockInfo', async () => {
    const blockInfo = await db.getBlockInfo()
    assert(blockInfo.header)
    assert(blockInfo.miner)
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

    // verify market marketCap increase
    const metaAfter = await db.getMjMeta()
    assert(metaAfter.marketCap === meta.marketCap + starterBalance)
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
    const senderUser = await db.getUser(from)
    const receiverUser = await db.getUser(to)
    // const toName = receiverUser.name
    const senderInitBalance = senderUser.balance
    const receiverInitBalance = receiverUser.balance
    const amount = 100
    const newTx = await db.makeTx(from, to, amount)

    // validate tx in txs col
    const tx = await db.getTx(newTx.id)
    assert(txUtils.verify(tx))
    assert(tx.from.id === from)
    assert(!tx.from.name)
    assert(tx.to.id === to)
    assert(!tx.to.name)
    assert(tx.time.getTime() === newTx.time.getTime())
    assert(tx.amount === amount)

    // validate affected user docs
    const sender = await db.getUser(from)
    assert(sender.balance === senderInitBalance - amount)
    const senderTx = sender.txs[0]
    assert(senderTx.to === to)
    // todo: assert(senderTx.toName === toName) (only show if in user's contacts)
    assert(senderTx.time.getTime() === newTx.time.getTime())
    assert(senderTx.amount === amount)

    const receiver = await db.getUser(to)
    assert(receiver.balance === receiverInitBalance + amount)
    const receiverTx = receiver.txs[0]
    assert(receiverTx.from === from)
    assert(!receiverTx.fromName)
    assert(receiverTx.time.getTime() === newTx.time.getTime())
    assert(receiverTx.amount === amount)
  })

  test('makeTx: showName', async () => {
    const from = '1'
    const to = '2'
    const amount = 2
    const senderUser = await db.getUser(from)
    const fromName = senderUser.name
    const tx = await db.makeTx(from, to, amount, true)

    assert(!tx.from.name)

    // verify that sender name is not recorded in txs list of receiver user's doc
    const receiver = await db.getUser(to)
    const receiverTx = receiver.txs[0]
    assert(receiverTx.fromName === fromName)
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
    const initBlockInfo = await db.getBlockInfo()

    await db.insertBlock(testData.txs)
    const laterBlockInfo = await db.getBlockInfo()
    const lastBlock = await db.getBlock(laterBlockInfo.header.no)

    assert(laterBlockInfo.header.no !== initBlockInfo.no)
    blockUtils.verify(lastBlock, initBlockInfo.header)
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
    for (let i = 0; i < 4; i++) {
      const blockInfo = await db.getBlockInfo()
      assert(blockInfo.miner.targetDifficulty === lastDifficulty + config.blockchain.blockDifficultyIncrementStep)

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

      // verify market marketCap increase
      const metaAfter = await db.getMjMeta()
      assert(metaAfter.marketCap === initMeta.marketCap + totalReward)

      // verify last block update
      const lastBlock = await db.getBlock(blockToMine.header.no)
      assert(lastBlock.header.minDifficulty === blockInfo.miner.targetDifficulty)
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

  test('giveMiningReward, concurrently', async () => {
    const to = '1'
    const receiverInitBalance = (await db.getUser(to)).balance

    await db.insertBlock([])
    const blockInfo = await db.getBlockInfo()
    // choosing higher difficulty otherwise same nonce can fit into multiple difficulties at a very low difficulty
    const miningRes = blockUtils.mineHeaderStr(blockInfo.miner.headerStrWithoutNonce, blockInfo.miner.targetDifficulty + 10)

    let err
    try {
      await Promise.all([db.giveMiningReward(to, miningRes.nonce), db.giveMiningReward(to, miningRes.nonce)])
    } catch (e) { err = e }
    assert(err.message.includes('contention') || err.message.includes('nonce'))

    const receiverAfterBalance = (await db.getUser(to)).balance
    const miningReward = blockUtils.getBlockReward(miningRes.difficulty)
    assert(miningReward)
    assert(receiverAfterBalance === receiverInitBalance + miningReward)
  })

  test('giveMj', async () => {
    const from = 'majorna'
    const to = '1'
    const initMeta = await db.getMjMeta()
    const receiverInitBalance = (await db.getUser(to)).balance
    const amountUsd = 5
    const amountMj = amountUsd / initMeta.val

    const tx = await db.giveMj(to, amountUsd)

    // validate tx in txs col
    const retrievedTx = await db.getTx(tx.id)
    assert(txUtils.verify(retrievedTx))
    assert(retrievedTx.from.id === from)
    assert(retrievedTx.to.id === to)
    assert(retrievedTx.time.getTime() === tx.time.getTime())
    assert(retrievedTx.amount === amountMj)

    // validate user doc
    const receiver = await db.getUser(to)
    assert(receiver.balance === receiverInitBalance + retrievedTx.amount)
    const receiverTx = receiver.txs[0]
    assert(receiverTx.from === from)
    assert(receiverTx.time.getTime() === retrievedTx.time.getTime())
    assert(receiverTx.amount === retrievedTx.amount)

    // verify market marketCap increase
    const metaAfter = await db.getMjMeta()
    assert(metaAfter.marketCap === initMeta.marketCap + amountMj)
  })

  test('addNotification', async () => {
    const uid = '1'
    await db.addNotification(uid, { type: 'wow', data: { text: 'yeah' } })
    await db.addNotification(uid, { type: 'wow2', data: { text: 'yeah2' } })
  })
})
