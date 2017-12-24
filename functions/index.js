const functions = require('firebase-functions');

exports.ping = functions.https.onRequest((request, response) => response.send('pong'))

// exports.createFirestoreUserDocuments = functions.auth.user().onCreate(event => {
//   const user = event.data
//   const email = user.email
//   const displayName = user.displayName
// })
//
// exports.createFirestoreUserDocuments = functions.auth.user().onDelete(event => {
//   const user = event.data
//   const email = user.email
//   const displayName = user.displayName
// })