const assert = require('assert')
const db = require('./db')
const txUtils = require('../blockchain/tx')
const testData = require('../config/test').data

suite('db', () => {
  test('init', async () => {
    await db.init()
    await db.init()
  })

  test('getMeta', async () => {
    const meta = await db.getMeta()
    assert(meta.cap >= 500)
    assert(meta.val >= 0)
    assert(meta.userCount >= 0)
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
    const meta = await db.getMeta()

    const newUserData = await db.createUserDoc(testUserData, uid)

    // verify market cap increase
    const metaAfter = await db.getMeta()
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
    assert(err)
    console.log(err.status === 404)
  })

  test('getTxsByTimeRange', async () => {
    const now = new Date()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const txs = await db.getTxsByTimeRange(yesterday, now)
    assert(txs.length >= testData.txs.length)
    assert(txs[0].from.id === testData.txs[0].from.id)
    txs.forEach(tx => assert(txUtils.verify(tx)))

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

  test.only('signThenInsertBlock, getLastBlock', async () => {
    const someBlock = {header: {no: 1234, time: new Date()}}
    await db.signThenInsertBlock(someBlock)
    const lastBlock = await db.getLastBlock()
    assert(lastBlock.header.no === someBlock.header.no)
  })

  test('giveMiningReward', async () => {
    const from = 'majorna'
    const to = '1'
    const receiverInitBalance = (await db.getUser(to)).balance
    const initMeta = await db.getMeta()
    const amount = 100
    const lastBlockHeader = {no: 60, difficulty: 90}
    const majornaTx = await db.giveMiningReward(to, amount, lastBlockHeader)

    // validate tx in txs col
    const tx = await db.getTx(majornaTx.id)
    assert(txUtils.verify(tx))
    assert(tx.from.id === from)
    assert(tx.to.id === to)
    assert(tx.time.getTime() === majornaTx.time.getTime())
    assert(tx.amount === amount)

    // validate affected user doc
    const receiver = await db.getUser(to)
    assert(receiver.balance === receiverInitBalance + amount)
    const receiverTx = receiver.txs[0]
    assert(receiverTx.from === from)
    assert(receiverTx.time.getTime() === majornaTx.time.getTime())
    assert(receiverTx.amount === amount)

    // verify market cap increase
    const metaAfter = await db.getMeta()
    assert(metaAfter.cap === initMeta.cap + amount)

    // verify last block update
  })
})
