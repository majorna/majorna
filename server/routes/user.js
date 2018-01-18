/**
 * Create user doc and push first bonus transaction.
 */
exports.createUserDoc = async (firestore, user) => {
  const uid = user.uid
  const email = user.email
  const name = user.name || user.displayName // firebase auth token || firestore event

  console.log(`created user: ${uid} - ${email} - ${displayName}`)

  // create user doc
  // todo: all db operations below should be combined into one transaction so this functions will be idempotent
  const dbPromise = firestore.collection('users').doc(uid).set({
    email: email,
    name: name,
    created: firebase.firestore.FieldValue.serverTimestamp(),
    balance: 500,
    transactions: [
      {
        id: event.eventId,
        sent: new Date(event.timestamp),
        from: 'majorna',
        amount: 500
      }
    ]
  })

  // append the tx to tx collection
  // dbPromise.then(() => {
  //   return firebase.firestore().collection('txs').doc(event.eventId).set({
  //
  //   })
  // })

  // update market cap (create necessary fields if they don't exist)
  return dbPromise
}