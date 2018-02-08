const assert = require('assert')
const db = require('./db')
const utils = require('./utils')
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
    const userData = testData.users.u3Doc
    const meta = await db.getMeta()

    await db.createUserDoc(userData, uid)

    // verify market cap increase
    const metaAfter = await db.getMeta()
    assert(metaAfter.cap === meta.cap + 500)

    // verify user doc fields
    const userDoc = await db.getUser(uid)
    assert(userDoc.email === userData.email)
    assert(userDoc.name === userData.name)
    assert(utils.isCloseToDate(userDoc.created))
    assert(userDoc.balance === userData.balance)
    assert(userDoc.txs.length === 1)

    // verify tx in txs collection
    const tx = await db.getTx(userDoc.txs[0].id)
    assert(tx.from === 'majorna')
    assert(tx.to === uid)
    assert(tx.sent.getTime() === userDoc.created.getTime())
    assert(tx.amount === 500)

    // try to create user again and verify error
    let err = null
    try { await db.createUserDoc(userData, uid) } catch (e) { err = e }
    assert(err)
  })

  test('getTx', async () => {
    let err = null
    try { await db.getTx('sdaf089y097gs') } catch (e) { err = e }
    assert(err)
  })

  test('makeTx', async () => {
    // make a valid tx
    const from = '1'
    const to = '2'
    const initBalance = testData.users.u1Doc.balance
    const amount = 100
    const txId = await db.makeTx(from, to, amount)

    // validate tx in txs col
    const tx = await db.getTx(txId)
    assert(tx.from === from)
    assert(tx.to === to)
    assert(utils.isCloseToDate(tx.sent))
    assert(tx.amount === amount)

    // validate affected user docs
    const sender = await db.getUser(from)
    assert(sender.balance === initBalance - amount)
    const senderTx = sender.txs[0]
    assert(senderTx.to === to)
    assert(utils.isCloseToDate(senderTx.sent))
    assert(senderTx.amount === amount)

    const receiver = await db.getUser(to)
    assert(receiver.balance === initBalance + amount)
    const receiverTx = receiver.txs[0]
    assert(receiverTx.from === from)
    assert(utils.isCloseToDate(receiverTx.sent))
    assert(receiverTx.amount === amount)
  })

  test('makeTx: invalid', async () => {
    let err = null // missing args
    try { await db.makeTx() } catch (e) { err = e }
    assert(err)

    err = null // inexistent sender
    try { await db.makeTx('asdf98709ysadgfg', '2', 10) } catch (e) { err = e }
    assert(err)

    err = null // inexistent receiver
    try { await db.makeTx('1', '129807aysdfiopohasdf', 10) } catch (e) { err = e }
    assert(err)

    err = null // can't send more than what is in user balance
    try { await db.makeTx('1', '2', 6000) } catch (e) { err = e }
    assert(err)

    err = null // amount should be integer
    try { await db.makeTx('1', '1', 5.1) } catch (e) { err = e }
    assert(err)

    err = null // tx to self is not allowed
    try { await db.makeTx('1', '1', 10) } catch (e) { err = e }
    assert(err)
  })
})
