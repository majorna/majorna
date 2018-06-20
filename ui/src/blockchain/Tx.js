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
   * Verifies the tx's signature, asynchronously.
   */
  verifySig = async () => crypto.verifyText(this.sig, this.getStr()) // todo: this should throw

  /**
   * Verifies the tx, asynchronously.
   * Returns true if tx is valid. Throws an AssertionError with a relevant message, if the verification fails.
   */
  verify = async () => {
    // verify schema
    assert(typeof this.sig === 'string', 'Signature must be a non-empty string.')
    assert(this.sig.length === 92 || this.sig.length === 96, `Signature length is invalid. Expected ${92} or ${96}, got ${this.sig.length}.`)
    assert(typeof this.id === 'string' && this.id.length > 0, 'ID must be a non-empty string.')
    assert(typeof this.from.id === 'string' && this.from.id.length > 0, 'From ID must be a non-empty string.')
    assert(typeof this.from.balance === 'number' && this.from.balance >= 0, '"From Balance" must be a number that is greater than or equal to 0.')
    assert(typeof this.to.id === 'string' && this.to.id.length > 0, 'To ID must be a non-empty string.')
    assert(typeof this.to.balance === 'number' && this.to.balance >= 0, '"To Balance" must be a number that is greater than or equal to 0.')
    assert(this.time instanceof Date, 'Time object must be an instance of Date class.')
    assert(typeof this.amount === 'number' && this.amount > 0, 'Amount must be a number that is greater than 0.')

    // verify contents
    assert(this.from.id !== this.to.id, 'To and From IDs cannot be the same.')
    await this.verifySig()
  }
}
