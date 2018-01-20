const firebaseAdmin = require('firebase-admin')
const FieldValue = firebaseAdmin.firestore.FieldValue
const firebaseConf = require('../conf/firebase-conf')
const firestore = firebaseConf.firestore

exports.getMeta = async () => (await firestore.collection('mj').doc('meta').get()).data()

exports.updateMarketCap = async (amount) => {
  await firestore.runTransaction(async t => {
    const metaRef = firestore.collection('mj').doc('meta')
    const metaDoc = await t.get(metaRef)
    await t.update(metaRef, {cap: metaDoc.data().cap + amount})
  })
}

exports.addTransaction = async (from, to, sent, amount) => firestore.collection('txs').add({from, to, sent, amount})

/**
 * Create user doc and push first bonus transaction.
 * Can be used as a firestore cloud function trigger.
 */
exports.createUserDoc = async (user) => {
  const uid = user.uid
  const email = user.email
  const name = user.name || user.displayName // firebase auth token || firestore event

  const time = FieldValue.serverTimestamp()
  const initBalance = 500

  // create the first transaction for the user
  const txDoc = exports.addTransaction('majorna', uid, time, initBalance)

  // create user doc
  await firestore.collection('users').doc(uid).set({
    email: email,
    name: name,
    created: time,
    balance: initBalance,
    transactions: [
      {
        id: txDoc.id,
        from: 'majorna',
        sent: txDoc.sent,
        amount: initBalance
      }
    ]
  })

  // increase market cap
  await exports.updateMarketCap(initBalance)

  console.log(`created user: ${uid} - ${email} - ${name}`)
}
