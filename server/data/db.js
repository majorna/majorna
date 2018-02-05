const assert = require('assert')
const firebaseConfig = require('../config/firebase')
const firestore = firebaseConfig.firestore

// collection and doc refs
const txsColRef = firestore.collection('txs')
const usersColRef = firestore.collection('users')
const metaDocRef = firestore.collection('mj').doc('meta')

/**
 * Initializes database collections if database is empty, asynchronously.
 */
exports.init = async () => {
  const metaDoc = await metaDocRef.get()
  if (metaDoc.exists) {
    return
  }

  const batch = firestore.batch()
  batch.create(metaDocRef, {val: 0.01, cap: 0})
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
    throw new Error(`user ID:${id} does not exist`)
  }
  return userDoc.data()
}

/**
 * Create user doc and push first bonus transaction, asynchronously.
 * Can be used as a firestore cloud function trigger.
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
  t.update(metaDocRef, {cap: metaDoc.data().cap + initBalance})

  // create the first transaction for the user
  const txRef = txsColRef.doc()
  t.create(txRef, {from: 'majorna', to: uid, sent: time, amount: initBalance})

  // create user doc
  t.create(usersColRef.doc(uid), {
    email: email,
    name: name,
    created: time,
    balance: initBalance,
    txs: [
      {
        id: txRef.id,
        from: 'majorna',
        sent: time,
        amount: initBalance
      }
    ]
  })
})

/**
 * Get a transaction from transactions collection by ID, asynchronously.
 */
exports.getTx = async id => {
  assert(id, 'tx ID parameters is required')
  const txDoc = await txsColRef.doc(id).get()
  if (!txDoc.exists) {
    throw new Error(`transaction ID:${id} does not exist`)
  }
  return txDoc.data()
}

/**
 * Performs a financial transaction from person A to B asynchronously.
 * Both user documents and transactions collection is updated with the transaction data and results.
 * Returned promise resolves to transaction ID -or- to an error if transaction fails.
 */
exports.makeTx = (from, to, amount) => firestore.runTransaction(async t => {
  assert(from, 'from parameters is required')
  assert(to, 'to parameters is required')
  assert(from !== to, 'from and to parameters cannot be same')
  assert(amount, 'amount ID parameters is required')
  assert(Number.isInteger(amount))
  assert(amount > 0, 'amount should be > 0')

  // verify sender's funds
  const senderDocRef = usersColRef.doc(from)
  const senderDoc = await t.get(senderDocRef)
  if (!senderDoc.exists) {
    throw new Error(`sender ID:${from} does not exist`)
  }
  const sender = senderDoc.data()
  if (sender.balance < amount) {
    throw new Error(`sender ID:${from} has insufficient funds`)
  }

  const sent = new Date()

  // check if receiver exists
  const receiverDocRef = usersColRef.doc(to)
  const receiverDoc = await t.get(receiverDocRef)
  const receiver = receiverDoc.data()
  if (!receiverDoc.exists) {
    throw new Error(`receiver ID:${to} does not exist`)
  }

  // add tx to txs collection
  const txRef = txsColRef.doc()
  t.create(txRef, {from, to, sent, amount})

  // update user docs with tx and updated balances
  sender.txs.unshift({id: txRef.id, to, sent, amount})
  t.update(senderDocRef, {balance: sender.balance - amount, txs: sender.txs})
  receiver.txs.unshift({id: txRef.id, from, sent, amount})
  t.update(receiverDocRef, {balance: receiver.balance + amount, txs: receiver.txs})

  return txRef.id
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

  await batch.commit()
}
