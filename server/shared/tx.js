const assert = require('assert')
const crypto = require('./crypto')

assert({
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
})

module.exports = class Tx {
  constructor (sig, id, fromId, fromBalance, toId, toBalance, time, amount) {
    this.sig = sig
    this.id = id
    this.from = {
      id: fromId,
      balance: fromBalance
    }
    this.to = {
      id: toId,
      balance: toBalance
    }
    this.time = time
    this.amount = amount
  }

  /**
   * Concatenates the the given tx into a regular string, fit for hashing.
   */
  getStr () {
    return '' + this.id + this.from.id + this.from.balance + this.to.id + this.to.balance + this.time.getTime() + this.amount
  }

  /**
   * Creates a valid tx object out of a given object. Extra fields will not be used.
   */
  static getObj (tx) {
    return new Tx(tx.sig, tx.id, tx.from.id, tx.from.balance, tx.to.id, tx.to.balance, tx.time, tx.amount)
  }

  /**
   * Signs the tx with majorna certificate.
   */
  sign () {
    this.sig = crypto.signText(this.getStr())
  }

  /**
   * Verifies the tx's signature.
   */
  verifySig () {
    return crypto.verifyText(this.sig, this.getStr())
  }

  /**
   * Verifies the tx.
   * Returns true if tx is valid. Throws an assert.AssertionError with a relevant message, if the verification fails.
   */
  verify () {
    // todo: verify schema & contents too (as we do with block.verify)
    return this.verifySig()
  }
}
