const assert = require('assert')
const db = require('./db')
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
    let err
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
    assert(userDoc.created.getTime() + 20 * 1000 > new Date())
    assert(userDoc.created.getTime() - 20 * 1000 < new Date())
    assert(userDoc.balance === userData.balance)
    assert(userDoc.txs.length === 1)

    // verify tx in txs collection
    const tx = await db.getTx(userDoc.txs[0].id)
    assert(tx.from === 'majorna')
    assert(tx.to === uid)
    assert(tx.sent.getTime() === userDoc.created.getTime())
    assert(tx.amount === 500)
  })

  test('getTx', async () => {
    let err
    try { await db.getTx('sdaf089y097gs') } catch (e) { err = e }
    assert(err)
  })

  test('makeTx', async () => {
    // make a valid tx
    const now = new Date()
    const from = '1'
    const to = '2'
    const initBalance = 500
    const amount = 100
    const txId = await db.makeTx(from, to, now, amount)

    // validate tx in txs col
    const tx = await db.getTx(txId)
    assert(tx.from === from)
    assert(tx.to === to)
    assert(tx.sent.getTime() === now.getTime())
    assert(tx.amount === amount)

    // validate affected user docs
    const sender = await db.getUser(from)
    assert(sender.balance === initBalance - amount)
    const senderTx = sender.txs[0]
    assert(senderTx.to === to)
    assert(senderTx.sent.getTime() === now.getTime())
    assert(senderTx.amount === amount)

    const receiver = await db.getUser(to)
    assert(receiver.balance === initBalance + amount)
    const receiverTx = receiver.txs[0]
    assert(receiverTx.from === from)
    assert(receiverTx.sent.getTime() === now.getTime())
    assert(receiverTx.amount === amount)
  })

  test('makeTx: invalid', async () => {

  })
})
