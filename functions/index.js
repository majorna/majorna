const functions = require('firebase-functions');
const firebase = require('firebase-admin');
firebase.initializeApp(functions.config().firebase);

exports.ping = functions.https.onRequest((request, response) => response.send('pong'))

exports.createUserDoc = functions.auth.user().onCreate(event => {
  const user = event.data
  const uid = user.uid
  const email = user.email
  const displayName = user.displayName

  console.log(`created user: ${uid} - ${email} - ${displayName}`)

  // create user doc
  // todo: all db operations below should be combined into one transaction so this functions will be idempotent
  const dbPromise = firebase.firestore().collection('users').doc(uid).set({
    email: email,
    displayName: displayName,
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
})

exports.updateUserDoc = functions.firestore.document('users/{userId}').onUpdate(event => {
  // const oldDoc = event.data.previous.data() // user doc before this update
  const doc = event.data.data() // user doc after update
  const tx = doc.pendingTransaction

  // send pending transaction
  if (tx) {
    // cancel invalid transaction
    if (tx.amount > doc.balance) {
      return event.data.ref.set({ // update sending user's doc
        pendingTransaction: firebase.firestore.FieldValue.delete()
      }, {merge: true})
    }

    return event.data.ref.set({ // update sending user's doc
      pendingTransaction: firebase.firestore.FieldValue.delete()
    }, {merge: true}).then(() => { // update receiving user's doc
    })
  }
});

// exports.deleteFirestoreUserDocuments = fbFunctions.auth.user().onDelete(event => {
// })

// taken from: https://github.com/firebase/functions-samples/tree/master/authenticated-json-api
// Express middleware that validates Firebase ID Tokens passed in the Authorization HTTP header.
// The Firebase ID token needs to be passed as a Bearer token in the Authorization HTTP header like this:
// `Authorization: Bearer <Firebase ID Token>`.
// when decoded successfully, the ID Token content will be added as `req.user`.
// const authenticate = (req, res, next) => {
//   if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
//     res.status(403).send('Unauthorized');
//     return;
//   }
//   const idToken = req.headers.authorization.split('Bearer ')[1];
//   fbAdmin.auth().verifyIdToken(idToken).then(decodedIdToken => {
//     req.user = decodedIdToken;
//     next();
//   }).catch(error => {
//     res.status(403).send('Unauthorized');
//   });
// };
//
// exports.send = fbFunctions.https.onRequest((request, response) => {
//   response.send('pong')
// })