const assert = require('assert')
const testData = require('./test').data
const firebaseConfig = require('./firebase')

suite('config: firebase', () => {
  test('firestore access rules', async () => {
    // todo: people can only read their user doc and cannot write to it
    // todo: people can't read others' transactions
    // todo: none of the collections are writeable

    const firestore = testData.users.u1FBClient.firestore()

    const userDoc = await firestore.collection('users').doc('1').get()
    assert(userDoc.exists)
    assert(userDoc.data().email = testData.users.u1Doc.email)

    // const querySnapshot = await firestore.collection('txs').get()
    // querySnapshot.forEach(txDoc => {
    //   const tx = txDoc.data()
    //   assert(tx.from === '1' || tx.to === '1')
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
