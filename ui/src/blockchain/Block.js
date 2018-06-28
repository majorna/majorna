import assert from './assert'
import { signStr, verifyStr } from './crypto'
import Merkle from './Merkle'

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
  verify = async () => {
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
      await prevBlock.getHeaderHash(),
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
  static getObj = bl => new Block(
    bl.sig,
    bl.header.no, bl.header.prevHash, bl.header.txCount, bl.header.merkleRoot, bl.header.time, bl.header.minDifficulty, bl.header.nonce,
    bl.txs
  )

  /**
   * Deserializes given tx json into a tx object with correct Date type.k
   */
  static getObjFromJson = blockJson => {
    const parsedBlock = JSON.parse(blockJson)
    parsedBlock.header.time = new Date(parsedBlock.header.time)
    return Block.getObj(parsedBlock)
  }

  /**
   * Serializes the block into JSON string.
   */
  toJson = () => JSON.stringify(this, null, 2)

  /**
   * Concatenates the the given block into a regular string, fit for signing.
   */
  toSigningString = () => '' + this.id + this.from.id + this.from.balance + this.to.id + this.to.balance + this.time.getTime() + this.amount

  /**
   * Concatenates the the given block into a regular string, fit for hashing.
   */
  toMiningString = () => '' + this.sig + this.toSigningString()

  /**
   * Signs the tx with majorna certificate, asynchronously.
   */
  sign = async () => {
    this.sig = await signStr(this.toSigningString())
  }

  /**
   * Verifies the tx's signature, asynchronously.
   */
  verifySig = async () => assert(await verifyStr(this.sig, this.toSigningString()), 'Invalid tx signature.')
}
