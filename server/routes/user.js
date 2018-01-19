const FieldValue = require("firebase-admin").firestore.FieldValue

/**
 * Create user doc and push first bonus transaction.
 * Can be used as a firestore cloud function trigger.
 */
exports.createUserDoc = async (firestore, user) => {
  const uid = user.uid
  const email = user.email
  const name = user.name || user.displayName // firebase auth token || firestore event

  const time = FieldValue.serverTimestamp()
  const initBalance = 500

  // create the first transaction for the user
  const txDoc = await firestore.collection('txs').add({
    from: 'majorna',
    to: uid,
    sent: time,
    amount: initBalance
  })

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
  await exports.updateMarketCap(firestore, initBalance)

  console.log(`created user: ${uid} - ${email} - ${name}`)
}

/**
 * Updates market cap metadata with given amount.
 */
exports.updateMarketCap = async (firestore, amount) => {
  firebase.runTransaction(async t => {
    const metaRef = firebase.collection('mj').doc('meta')
    const metaDoc = await t.get(metaRef)
    await t.update(metaRef, {cap: metaDoc.data().cap + amount})
  })
}