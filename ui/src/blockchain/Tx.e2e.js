import assert from './assert'
import Tx from './Tx'

const getSampleTx = () => new Tx(null, 'tx-123', '1', 500, '2', 500, new Date(), 25)

export default {
  'json stringify': async () => {
    const tx = getSampleTx()
    await tx.sign()
    const jsonStr = tx.toJson()
    assert(jsonStr.split('\n')[0] === '{', 'tx json should be indented')
    const txObj = Tx.getObjFromJson(jsonStr)
    await txObj.verify()
  },

  'verify': async () => {
    // valid sig
    const signedTx = getSampleTx()
    await signedTx.sign()
    await signedTx.verify()

    // empty sig
    const unsignedTx = getSampleTx()
    await assert.throws(() => unsignedTx.verify(), 'signature must be a non-empty string')
    try {
      await unsignedTx.verify()
    } catch (e) {
      assert.equal(e.type, 'AssertionError')
    }

    // invalid sig
    const invalidSigTx = getSampleTx()
    await invalidSigTx.sign()
    invalidSigTx.id = '123456789'
    await assert.throws(() => invalidSigTx.verify(), 'invalid tx sig')

    // invalid id
    const invalidIdTx = getSampleTx()
    await invalidIdTx.sign()
    invalidIdTx.id = 123
    await assert.throws(() => invalidIdTx.verify(), 'id must be')

    // invalid from
    const invalidFromTx = getSampleTx()
    await invalidFromTx.sign()
    invalidFromTx.from = {}
    await assert.throws(() => invalidFromTx.verify(), 'from id')
    invalidFromTx.from = {id: 'abc123'}
    await assert.throws(() => invalidFromTx.verify(), 'from balance')
    invalidFromTx.from = {id: 'abc123', balance: 0}
    await assert.throws(() => invalidFromTx.verify(), 'from balance')

    // invalid to
    const invalidToTx = getSampleTx()
    await invalidToTx.sign()
    invalidToTx.to = {}
    await assert.throws(() => invalidToTx.verify(), 'to id')
    invalidToTx.to = {id: 'abc123'}
    await assert.throws(() => invalidToTx.verify(), 'to balance')
    invalidToTx.to = {id: 'abc123', balance: -1}
    await assert.throws(() => invalidToTx.verify(), 'to balance')

    // same to and from
    const sameToAndFromTx = getSampleTx()
    await sameToAndFromTx.sign()
    sameToAndFromTx.from = sameToAndFromTx.to
    await assert.throws(() => sameToAndFromTx.verify(), 'to and from')

    // invalid time
    const invalidTimeTx = getSampleTx()
    await invalidTimeTx.sign()
    await invalidTimeTx.sign()
    invalidTimeTx.time = '01 Jan 2010 00:00:00 UTC'
    await assert.throws(() => invalidTimeTx.verify(), 'time object')

    // invalid amount
    const invalidAmountTx = getSampleTx()
    await invalidAmountTx.sign()
    await invalidAmountTx.sign()
    invalidAmountTx.amount = '123'
    await assert.throws(() => invalidAmountTx.verify(), 'amount must be')
    invalidAmountTx.amount = 0
    await assert.throws(() => invalidAmountTx.verify(), 'amount must be')
  }
}
