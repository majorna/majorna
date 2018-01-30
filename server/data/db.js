const firebaseConfig = require('../config/firebase')
const firestore = firebaseConfig.firestore

// collection and doc refs
const txsRef = firestore.collection('txs')
const usersRef = firestore.collection('users')
const metaRef = firestore.collection('mj').doc('meta')

/**
 * Initializes database collections if database is empty, asynchronously.
 */
exports.init = async () => {
  const metaDoc = await metaRef.get()
  if (metaDoc.exists) {
    return
  }

  const batch = firestore.batch()
  batch.create(metaRef, {val: 0.01, cap: 0})
  await batch.commit()
}

/**
 * Get majorna metadata document asynchronously.
 */
exports.getMeta = async () => (await metaRef.get()).data()

/**
 * Update market capitalization field in majorna metadata document asynchronously.
 */
exports.updateMarketCap = amount => firestore.runTransaction(async t => {
  const metaDoc = await t.get(metaRef)
  await t.update(metaRef, {cap: metaDoc.data().cap + amount})
})

/**
 * Create user doc and push first bonus transaction, asynchronously.
 * Can be used as a firestore cloud function trigger.
 */
exports.createUserDoc = async user => {
  const uid = user.uid
  const email = user.email
  const name = user.name || user.displayName // firebase auth token || firestore event

  const time = new Date()
  const initBalance = 500

  // create the first transaction for the user
  const txRef = await txsRef.add({from: 'majorna', to: uid, sent: time, amount: initBalance})

  // create user doc
  await usersRef.doc(uid).create({
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

  // increase market cap
  await exports.updateMarketCap(initBalance)
  console.log(`created user: ${uid} - ${email} - ${name}`)
}

/**
 * Get a transaction from transactions collection by ID, asynchronously.
 */
exports.getTx = async id => {
  const tx = await txsRef.doc(id).get()
  return tx.exists ? tx.data() : null
}

/**
 * Performs a financial transaction from person A to B asynchronously.
 * Both user documents and transactions collection is updated with the transaction data and results.
 * Returned promise resolves to an error if transaction fails.
 */
exports.makeTx = (from, to, sent, amount) => firestore.runTransaction(async t => {
  // verify sender's funds
  const senderDoc = await t.get(usersRef.doc(from))
  const sender = senderDoc.data()
  if (!senderDoc.exists || sender.balance < amount) {
    throw new Error('insufficient funds')
  }

  // check if receiver exists
  const receiverDoc = await t.get(usersRef.doc(from))
  const receiver = receiverDoc.data()
  if (!receiverDoc.exists) {
    throw new Error('receiver does not exist')
  }

  // add tx to txs collection
  const txRef = txsRef.doc()
  await t.create(txRef, {from, to, sent, amount})

  // update user docs with tx and updated balances
  sender.txs.unshift({id: txRef.id, to, sent, amount})
  await t.update(senderDoc, {balance: sender.balance - amount, txs: sender.txs})
  receiver.txs.unshift({id: txRef.id, from, sent, amount})
  await t.update(receiverDoc, {balance: receiver.balance + amount, txs: receiver.txs})
})

/**
 * Deletes all the data and seeds the database with dummy data for testing, asynchronously.
 */
exports.testSeed = async () => {
  // delete all data
  const batch = firestore.batch()
  const txsSnap = await txsRef.get()
  txsSnap.forEach(txSnap => batch.delete(txSnap.ref))
  const usersSnap = await usersRef.get()
  usersSnap.forEach(userSnap => batch.delete(userSnap.ref))
  batch.delete(metaRef)

  // add seed data
  batch.create(metaRef, testData.mj.meta)
  batch.create(usersRef.doc('1'), testData.users.id1)
  batch.create(usersRef.doc('2'), testData.users.id2)

  await batch.commit()
}

const time = new Date()
const testData = exports.testData = {
  mj: {
    meta: {val: 0.01, cap: 500}
  },
  users: {
    id1: {
      email: 'chuck.norris@majorna.mj',
      name: 'Chuck Norris',
      created: time,
      balance: 0,
      txs: []
    },
    id2: {
      email: 'morgan.almighty@majorna.mj',
      name: 'Morgan Almighty',
      created: time,
      balance: 0,
      txs: []
    }
  },
  // Firebase authentication ID token (JWT) content when decoded
  decodedIdToken: {
    iss: 'https://securetoken.google.com/majorna-fire',
    name: 'Chuck Norris',
    picture: 'https://lh3.googleusercontent.com/abc/def/photo.jpg',
    aud: 'majorna-fire',
    auth_time: 1516094974,
    user_id: 'dsafasdgasfgsadsdafdsfa',
    sub: '234sdfsgasdfsadf',
    iat: 1516191924,
    exp: 1516195524,
    email: 'chuck.norris@gmail.com',
    email_verified: true,
    firebase: {
      identities: {
        'google.com': ['1232343453464654'],
        email: ['chuck.norris@gmail.com']
      },
      sign_in_provider: 'google.com'
    },
    uid: 'dsafasdgasfgsadsdafdsfa'
  }
}
