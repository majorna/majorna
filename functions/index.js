const fbFunctions = require('firebase-functions');
const fbAdmin = require('firebase-admin');
fbAdmin.initializeApp(fbFunctions.config().firebase);

exports.ping = fbFunctions.https.onRequest((request, response) => response.send('pong'))

exports.createFirestoreUserDocument = fbFunctions.auth.user().onCreate(event => {
  const user = event.data
  const id = user.uid
  const email = user.email
  const displayName = user.displayName

  console.log(`created user: ${id} - ${email} - ${displayName}`)

  return fbAdmin.firestore().collection('users').doc(id).set({
    email: email,
    displayName: displayName,
    created: fbAdmin.firestore.FieldValue.serverTimestamp(),
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
})

// exports.createFirestoreUserDocuments = fbFunctions.auth.user().onDelete(event => {
//   const user = event.data
//   const email = user.email
//   const displayName = user.displayName
// })