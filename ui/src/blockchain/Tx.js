import assert from './assert'

export default class Tx {
  // todo: verify that this does not end up in json text after JSON.stringify()
  static schema = {
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

    // todo: verify the Tx so that each field is non-null and non-empty (with verifyTx?)
  }

  /**
   * Concatenates the the given tx into a regular string, fit for hashing.
   */
  getStr = () => '' + this.id + this.from.id + this.from.balance + this.to.id + this.to.balance + this.time.getTime() + this.amount

  /**
   * Creates a valid tx object out of a given object. Extra fields will not be used.
   */
  static getObj = tx => new Tx(tx.sig, tx.id, tx.from.id, tx.from.balance, tx.to.id, tx.to.balance, tx.time, tx.amount)

  /**
   * Signs the tx with majorna certificate.
   */
  sign = () => { this.sig = crypto.signText(this.getStr()) }

  /**
   * Verifies the tx's signature.
   */
  verifySig = () => crypto.verifyText(this.sig, this.getStr())

  /**
   * Verifies the tx.
   * Returns true if tx is valid. Throws an AssertionError with a relevant message, if the verification fails.
   */
  verify = () => {
    // verify schema
    assert(this.sig && typeof this.sig === 'string', 'Signature must be a non-empty string.')
    assert(this.id && typeof this.id, 'string', 'ID must be a string.')
    assert(typeof this.fromId, 'string', 'From ID must be a string.')
    assert(typeof this.fromBalance, 'number', '"From Balance" must be a number.')
    assert(typeof this.toId, 'string', 'To ID must be a string.')
    assert(typeof this.toBalance, 'number', '"To Balance" must be a number.')
    assert(this.time instanceof Date, 'Time must be a Date object.')
    assert(typeof this.amount, 'number', 'Amount must be a number.')

    // verify contents
    this.verifySig()
  }
}
