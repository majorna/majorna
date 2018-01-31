/**
 * Firebase:
 * - API ref: https://firebase.google.com/docs/reference/admin/node/
 *
 * Firestore:
 * - Src: https://github.com/googleapis/nodejs-firestore
 * - API ref: https://cloud.google.com/nodejs/docs/reference/firestore/latest/
 */
const firebaseAdmin = require('firebase-admin')
const config = require('./config')

// module exports
exports.app = firebaseAdmin.initializeApp(config.firebase.config)
exports.auth = exports.app.auth()
exports.firestore = exports.app.firestore()

/**
 * Verify a given Firebase Authentication ID token and return the decoded user object, asynchronously.
 */
exports.verifyIdToken = token => exports.auth.verifyIdToken(token)
