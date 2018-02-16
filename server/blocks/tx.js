const db = require('../data/db')
const github = require('../data/github')
const crypto = require('./crypto')

/**
 * Strips majorna:/mj: prefixes from a string, if any.
 */
exports.stripPrefix = str => str.startsWith('mj:') ? str.substring(3) : str.startsWith('majorna:') ? str.substring(8) : str

/**
 * Inserts a tx in database.
 */
exports.makeTx = async (from, to, amount) => {
  from = exports.stripPrefix(from)
  to = exports.stripPrefix(to)

  await db.makeTx(from, to, amount)
}

exports.makeBlock = async () => {
  // get last block header

  // get all txs since last block interval + 1 hours (not to allow any conflicts)

  const signedBlock = crypto.signObj()
  await github.insertTxInBlock(signedBlock)
}

exports.blockPeriodCheck = async () => {
  // check if it is time to create a block
}
