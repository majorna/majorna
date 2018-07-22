const crypto = require('./crypto')

/**
 * Transaction schema. All fields are mandatory.
 */
exports.txSchema = {
  sig: '', // signature of the tx, signed by the sender (or majorna on behalf of sender)
  id: '', // ID of the transaction
  from: {
    id: '', // ID of the sender
    balance: 0 // balance of sender before transaction
  },
  to: {
    id: '', // ID of the receiver
    balance: 0 // balance of receiver before transaction
  },
  time: new Date(), // time of the transaction
  amount: 0 // amount being sent
}

/**
 * Concatenates the the given tx into a regular string, fit for hashing.
 *  * todo: include sig if available??
 */
exports.getStr = tx =>
  '' + tx.id + tx.from.id + tx.from.balance + tx.to.id + tx.to.balance + tx.time.getTime() + tx.amount

/**
 * Creates a valid tx object out of a given object. Extra fields will not be used.
 */
exports.getObj = tx => ({
  sig: tx.sig,
  id: tx.id,
  from: {id: tx.from.id, balance: tx.from.balance},
  to: {id: tx.to.id, balance: tx.to.balance},
  time: new Date(tx.time.getTime()),
  amount: tx.amount
})

/**
 * Signs a tx with majorna certificate.
 */
exports.sign = tx => {
  const sigTx = exports.getObj(tx)
  sigTx.sig = crypto.signTextOrBuffer(exports.getStr(sigTx))
  return sigTx
}

/**
 * Verifies a given tx's signature.
 */
exports.verifySig = tx => crypto.verifyTextOrBuffer(tx.sig, exports.getStr(tx))

/**
 * Verifies the given tx.
 * Returns true if tx is valid. Throws an assert.AssertionError with a relevant message, if the verification fails.
 * todo: verify schema & contents too (as we do with block.verify)
 */
exports.verify = tx => exports.verifySig(tx)
