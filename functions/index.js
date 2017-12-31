const fbFunctions = require('firebase-functions');
const fbAdmin = require('firebase-admin');
fbAdmin.initializeApp(fbFunctions.config().firebase);

exports.ping = fbFunctions.https.onRequest((request, response) => response.send('pong'))

exports.createFirestoreUserDocument = fbFunctions.auth.user().onCreate(event => {
  const time = fbAdmin.firestore.FieldValue.serverTimestamp();
  const user = event.data
  const id = user.uid
  const email = user.email
  const displayName = user.displayName

  return fbAdmin.firestore().collection('users').doc(id).set({
    email: email,
    displayName: displayName,
    created: time,
    balance: 500,
    transactions: [
      {
        sent: time,
        from: 'majorna',
        amount: 500
      }
    ]
  })
})

// exports.createFirestoreUserDocuments = fbFunctions.auth.user().onDelete(event => {
//   const user = event.data
//   const email = user.email
//   const displayName = user.displayName
// })