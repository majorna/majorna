const fbFunctions = require('firebase-functions');
const fbAdmin = require('firebase-admin');
fbAdmin.initializeApp(fbFunctions.config().firebase);

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

// exports.deleteFirestoreUserDocuments = fbFunctions.auth.user().onDelete(event => {
// })

exports.ping = fbFunctions.https.onRequest((request, response) => response.send('pong'))

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