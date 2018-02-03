const assert = require('assert')
const testData = require('./test').data
const firebaseConfig = require('./firebase')

suite('firebase-config', () => {
  test('firestore access rules', async () => {
    // todo: people can only read their user doc and cannot write to it
    // todo: people can't read others' transactions
    // todo: none of the collections are writeable

    // todo: u1FBClient needs to be firebaseApp (== firebaseClientSdk.initializeApp())
    // const querySnapshot = await testData.users.u1FBClient.firestore().collection('txs').get()
    // querySnapshot.forEach(txDoc => {
    //   const tx = txDoc.data()
    //   assert(tx.from === uid || tx.to === uid)
    // })
  })

  test('verifyIdToken', async () => {
    const u1 = testData.users.u1Auth
    const decodedToken = await firebaseConfig.verifyIdToken(testData.users.u1Token)
    assert(decodedToken.uid === u1.uid)
    assert(decodedToken.email === u1.email)
    assert(decodedToken.name === u1.displayName)
  })
})
