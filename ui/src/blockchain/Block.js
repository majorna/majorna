import assert from './assert'
import { hashStr, signStr, verifyStr } from './crypto'
import Merkle from './Merkle'
import Tx from './Tx'

export default class Block {
  constructor (sig, no, prevHash, txCount, merkleRoot, time, minDifficulty, nonce, txs) {
    this.sig = sig // optional: if given, difficulty and nonce are not obligatory
    this.header = {
      no,
      prevHash,
      txCount,
      merkleRoot,
      time,
      minDifficulty, // optional: if sig is not present, should be > 0
      nonce // optional: if sig is not present, should be > 0
    }
    this.txs = txs
  }

  /**
   * Verifies the block, asynchronously.
   * Returns true if block is valid. Throws an AssertionError with a relevant message, if the verification fails.
   */
  verify = async prevBlock => {
    // verify schema
    assert(typeof this.sig === 'string', 'Signature must be a non-empty string.')
    assert(this.sig.length === 128, `Signature length is invalid. Expected ${128}, got ${this.sig.length}.`)
    assert(typeof this.id === 'string' && this.id.length > 0, 'ID must be a non-empty string.')
    assert(typeof this.from.id === 'string' && this.from.id.length > 0, 'From ID must be a non-empty string.')
    assert(typeof this.from.balance === 'number' && this.from.balance >= this.amount, '"From Balance" must be a number that is greater than or equal to the amount being sent.')
    assert(typeof this.to.id === 'string' && this.to.id.length > 0, 'To ID must be a non-empty string.')
    assert(typeof this.to.balance === 'number' && this.to.balance >= 0, '"To Balance" must be a number that is greater than or equal to 0.')
    assert(this.time instanceof Date, 'Time object must be an instance of Date class.')
    assert(typeof this.amount === 'number' && this.amount > 0, 'Amount must be a number that is greater than 0.')

    // verify contents
    assert(this.from.id !== this.to.id, 'To and From IDs cannot be the same.')
    await this.verifySig()
  }

  /**
   * Very first block ever.
   */
  static getGenesis = () => new Block('', 1, '', 0, '', new Date('01 Jan 2018 00:00:00 UTC'), 0, 0, [])

  /**
   * Creates a block with given txs and previous block, asynchronously.
   */
  static create = async (txs, prevBlock, now = new Date()) => {
    txs = txs.map(tx => Tx.getObj(tx))
    return new Block(
      '',
      prevBlock.no + 1,
      await prevBlock.hash(),
      txs.length,
      (txs.length && Merkle.create(txs).root) || '', // block are allowed to have no txs in them
      now,
      0,
      0,
      txs
    )
  }

  /**
   * Creates a block object out of a given plain object.
   */
  static getObj = bo => new Block(
    bo.sig,
      bo.header.no, bo.header.prevHash, bo.header.txCount, bo.header.merkleRoot,
      bo.header.time instanceof Date ? bo.header.time : new Date(bo.header.time), bo.header.minDifficulty, bo.header.nonce,
    bo.txs.map(tx => Tx.getObj(tx))
  )

  /**
   * Deserializes given tx json into a tx object with correct Date type.
   */
  static getObjFromJson = blockJson => Block.getObj(JSON.parse(blockJson))

  /**
   * Serializes the block into JSON string.
   */
  toJson = () => JSON.stringify(this, null, 2)

  /**
   * Concatenates the the given block into a regular string, fit for signing.
   * Nonce as the first item to be consistent with mining string.
   */
  toSigningString = () => '' + this.header.nonce + this.header.no + this.header.prevHash + this.header.txCount +
    this.header.merkleRoot + this.header.time.getTime() + this.header.minDifficulty

  /**
   * Concatenates the the given block into a regular string, fit for hashing.
   * Puts the nonce first to prevent internal hash state from being reused. In future we can add more memory intensive prefixes.
   * @param difficulty - If specified, this difficulty will be used instead of the one in header.
   */
  toMiningString = difficulty => '' + this.header.no + this.header.prevHash + this.header.txCount +
    this.header.merkleRoot + this.header.time.getTime() + (difficulty || this.header.minDifficulty)

  /**
   * Returns the hash of the block, asynchronously.
   */
  hash = () => hashStr('' + this.sig + this.toSigningString())

  /**
   * Signs the block with majorna certificate, asynchronously.
   */
  sign = async () => {
    this.sig = await signStr(this.toSigningString())
  }

  /**
   * Verifies the block's signature, asynchronously.
   */
  verifySig = async () => assert(await verifyStr(this.sig, this.toSigningString()), 'Invalid block signature.')
}
