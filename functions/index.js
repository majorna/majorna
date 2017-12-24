const functions = require('firebase-functions');

exports.ping = functions.https.onRequest((request, response) => response.send('pong'))

