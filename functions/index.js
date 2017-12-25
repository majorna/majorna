const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.ping = functions.https.onRequest((request, response) => response.send('pong'))

exports.createFirestoreUserDocument = functions.auth.user().onCreate(event => {
  const user = event.data
  const id = user.uid
  const email = user.email
  const displayName = user.displayName

  return admin.firestore().collection('users').doc(id).add({
    email: email,
    displayName: displayName,
    created: new Date(),
    balance: 500
  })
})

// exports.createFirestoreUserDocuments = functions.auth.user().onDelete(event => {
//   const user = event.data
//   const email = user.email
//   const displayName = user.displayName
// })