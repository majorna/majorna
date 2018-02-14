const db = require('../data/db')
const github = require('../data/github')
const crypto = require('./crypto')

/**
 * Strips majorna:/mj: prefixes from a string, if any.
 */
exports.stripPrefix = str => str.startsWith('mj:') ? str.substring(3) : str.startsWith('majorna:') ? str.substring(8) : str

/**
 * Inserts a tx in database and then github.
 * If database step fails, transaction fails.
 * todo: If github step fails, it is retried until success.
 */
exports.makeTx = async (from, to, amount) => {
  from = exports.stripPrefix(from)
  to = exports.stripPrefix(to)

  const txData = await db.makeTx(from, to, amount)
  const signedTx = crypto.signTx(txData)
  await github.insertTxInBlock(signedTx)
}
