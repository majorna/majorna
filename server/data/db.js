const assert = require('assert')
const tx = require('../blockchain/tx')
const utils = require('./utils')
const firebaseConfig = require('../config/firebase')
const firestore = firebaseConfig.firestore

// collection and doc refs
const txsColRef = firestore.collection('txs')
const usersColRef = firestore.collection('users')
const metaDocRef = firestore.collection('mj').doc('meta')

const maxTxInUserDoc = 15

/**
 * Initializes database collections if database is empty, asynchronously.
 */
exports.init = async () => {
  const metaDoc = await metaDocRef.get()
  if (metaDoc.exists) {
    return
  }

  const batch = firestore.batch()
  batch.create(metaDocRef, {val: 0.01, cap: 0, userCount: 0})
  batch.create(usersColRef.doc('majorna'), {email: 'majorna@majorna', name: 'Majorna', created: new Date(), balance: 0, txs: []})
  await batch.commit()
}

/**
 * Get majorna metadata document asynchronously.
 */
exports.getMeta = async () => (await metaDocRef.get()).data()

/**
 * Get a user by id, asynchronously.
 */
exports.getUser = async id => {
  assert(id, 'user ID parameters is required')
  const userDoc = await usersColRef.doc(id).get()
  if (!userDoc.exists) {
    throw new utils.UserVisibleError(`user ID:${id} does not exist`, 404)
  }
  return userDoc.data()
}

/**
 * Create user doc and push first bonus transaction, asynchronously.
 * Can be used as a firestore cloud function trigger.
 * Returns newly created user data.
 */
exports.createUserDoc = (user, uid) => firestore.runTransaction(async t => {
  assert(user, 'user parameters is required')
  uid = uid || user.uid
  assert(uid, 'user.uid or user ID parameter is required')
  const email = user.email
  const name = user.name || user.displayName // decoded firebase auth token || cloud functions firestore event data

  const time = new Date()
  const initBalance = 500

  console.log(`creating user: ${uid} - ${email} - ${name}`)

  // increase market cap
  const metaDoc = await t.get(metaDocRef)
  const meta = metaDoc.data()
  t.update(metaDocRef, {cap: meta.cap + initBalance, userCount: meta.userCount + 1})

  // create the first transaction for the user
  const txRef = txsColRef.doc()
  const signedTx = tx.sign({id: txRef.id, from: {id: 'majorna', balance: 0}, to: {id: uid, balance: 0}, time, amount: initBalance})
  t.create(txRef, signedTx)

  // create user doc
  const userData = {
    email: email,
    name: name,
    created: time,
    balance: initBalance,
    txs: [
      {
        id: txRef.id,
        from: 'majorna',
        time,
        amount: initBalance
      }
    ]
  }

  t.create(usersColRef.doc(uid), userData)
  return userData
})

/**
 * Get a transaction from transactions collection by ID, asynchronously.
 */
exports.getTx = async id => {
  assert(id, 'tx ID parameters is required')
  const txDoc = await txsColRef.doc(id).get()
  if (!txDoc.exists) {
    throw new utils.UserVisibleError(`transaction ID:${id} does not exist`, 404)
  }
  return txDoc.data()
}

/**
 * Queries the txs by given date objects range: start time (inclusive), end time (exclusive).
 */
exports.getTxsByTimeRange = async (startTime, endTime) => {
  const txsSnap = await txsColRef.where('time', '>=', startTime).where('time', '<', endTime).get()
  return txsSnap.docs.map(doc => doc.data())
}

/**
 * Performs a financial transaction from person A to B asynchronously.
 * Both user documents and transactions collection is updated with the transaction data and results.
 * Returned promise resolves to completed transaction data -or- to an error if transaction fails.
 * @param from - Sender ID.
 * @param to - Receiver ID.
 * @param amount - Transaction amount as integer.
 */
exports.makeTx = (from, to, amount) => firestore.runTransaction(async t => {
  assert(from, 'from parameters is required')
  assert(to, 'to parameters is required')
  assert(from !== to, 'from and to parameters cannot be same')
  assert(amount, 'amount ID parameters is required')
  assert(Number.isInteger(amount), 'amount must be an integer')
  assert(amount > 0, 'amount should be > 0')

  // check if sender exists
  const senderDocRef = usersColRef.doc(from)
  const senderDoc = await t.get(senderDocRef)
  if (!senderDoc.exists) {
    throw new utils.UserVisibleError(`sender ID:${from} does not exist`)
  }
  const sender = senderDoc.data()
  const fromName = sender.name

  // verify sender's funds
  if (sender.balance < amount) {
    throw new utils.UserVisibleError(`sender ID:${from} has insufficient funds`)
  }

  const time = new Date()

  // check if receiver exists
  const receiverDocRef = usersColRef.doc(to)
  const receiverDoc = await t.get(receiverDocRef)
  if (!receiverDoc.exists) {
    throw new utils.UserVisibleError(`receiver ID:${to} does not exist`)
  }
  const receiver = receiverDoc.data()
  const toName = receiver.name

  // add tx to txs collection
  const txRef = txsColRef.doc()
  const signedTx = tx.sign({id: txRef.id, from: {id: from, balance: sender.balance}, to: {id: to, balance: receiver.balance}, time, amount})
  t.create(txRef, signedTx)

  // update user docs with tx and updated balances
  sender.txs.unshift({id: txRef.id, to, toName, time, amount})
  sender.txs.length > maxTxInUserDoc && (sender.txs.length = maxTxInUserDoc)
  t.update(senderDocRef, {balance: sender.balance - amount, txs: sender.txs})
  receiver.txs.unshift({id: txRef.id, from, fromName, time, amount})
  receiver.txs.length > maxTxInUserDoc && (receiver.txs.length = maxTxInUserDoc)
  t.update(receiverDocRef, {balance: receiver.balance + amount, txs: receiver.txs})

  return signedTx
})

/**
 * Sends funds to given user from majorna, asynchronously.
 * Returned promise resolves to completed transaction data -or- to an error if transaction fails.
 * @param to - Receiver ID.
 * @param amount - Transaction amount as integer.
 */
exports.makeMajornaTx = (to, amount) => firestore.runTransaction(async t => {
  assert(to, 'to parameters is required')
  assert(amount, 'amount ID parameters is required')
  assert(Number.isInteger(amount), 'amount must be an integer')
  assert(amount > 0, 'amount should be > 0')

  const time = new Date()

  // sender is majorna
  const from = 'majorna'
  const fromName = 'Majorna'

  // check if receiver exists
  const receiverDocRef = usersColRef.doc(to)
  const receiverDoc = await t.get(receiverDocRef)
  if (!receiverDoc.exists) {
    throw new utils.UserVisibleError(`receiver ID:${to} does not exist`)
  }
  const receiver = receiverDoc.data()

  // add tx to txs collection
  const txRef = txsColRef.doc()
  const signedTx = tx.sign({id: txRef.id, from: {id: from, balance: 0}, to: {id: to, balance: receiver.balance}, time, amount})
  t.create(txRef, signedTx)

  // update user docs with tx and updated balances
  receiver.txs.unshift({id: txRef.id, from: from, fromName, time, amount})
  receiver.txs.length > maxTxInUserDoc && (receiver.txs.length = maxTxInUserDoc)
  t.update(receiverDocRef, {balance: receiver.balance + amount, txs: receiver.txs})

  return signedTx
})

/**
 * Deletes all the data and seeds the database with dummy data for testing, asynchronously.
 */
exports.initTest = async () => {
  const testData = require('../config/test').data
  const batch = firestore.batch()

  // delete all data
  const txsSnap = await txsColRef.get()
  txsSnap.forEach(txSnap => batch.delete(txSnap.ref))
  const usersSnap = await usersColRef.get()
  usersSnap.forEach(userSnap => batch.delete(userSnap.ref))
  batch.delete(metaDocRef)

  // add seed data
  batch.create(metaDocRef, testData.mj.meta)
  batch.create(usersColRef.doc('1'), testData.users.u1Doc)
  batch.create(usersColRef.doc('2'), testData.users.u2Doc)
  testData.txs.forEach((tx, i) => batch.create(txsColRef.doc(i.toString()), tx))

  await batch.commit()
}
