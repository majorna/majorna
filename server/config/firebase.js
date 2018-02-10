/**
 * Firebase:
 * - API ref: https://firebase.google.com/docs/reference/admin/node/
 *
 * Firestore:
 *  * - API ref: https://cloud.google.com/nodejs/docs/reference/firestore/latest/
 * - Src: https://github.com/googleapis/nodejs-firestore
 *
 * gRPC:
 * - Status Ref: https://grpc.io/grpc/node/grpc.html#.status__anchor
 * - Src: https://github.com/grpc/grpc-node/blob/master/packages/grpc-native-core/src/constants.js
 *
 * Firestore calls gRPC errors in the format {code: nodejs grpc.status.ALREADY_EXISTS (6), message: ..., details: ...}
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
