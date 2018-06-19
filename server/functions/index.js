// todo: needs update based on: https://firebase.google.com/docs/functions/beta-v1-diff
// or just use app engine standard with node.js 10+ support, which is new

// const functions = require('firebase-functions');
// const firebase = require('firebase-admin');
// firebase.initializeApp(functions.config().firebase);
//
// exports.ping = functions.https.onRequest((request, response) => response.send('pong'))
//
// exports.createUserDoc = functions.auth.user().onCreate(event => {
//   const user = event.data
//   const uid = user.uid
//   const email = user.email
//   const displayName = user.displayName
//
//   console.log(`created user: ${uid} - ${email} - ${displayName}`)
//
//   // create user doc
//   return firebase.firestore().collection('users').doc(uid).set({
//     email: email,
//     displayName: displayName,
//     created: firebase.firestore.FieldValue.serverTimestamp(),
//     balance: 500,
//     transactions: [
//       {
//         id: event.eventId,
//         time: new Date(event.timestamp),
//         from: 'majorna',
//         amount: 500
//       }
//     ]
//   })
// })
//
// exports.deleteFirestoreUserDocuments = functions.auth.user().onDelete(event => {
// })
