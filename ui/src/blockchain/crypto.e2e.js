import assert from './assert'
import config from '../data/config'
import { bufferToHex, hexToBuffer, signStr, verifyStr } from './crypto'

const buffer = new Uint8Array([0, 1, 2, 42, 100, 101, 102, 255]).buffer

export default {
  'init': config.initKeys,

  'hex': () => {
    const bufferParsed = hexToBuffer(bufferToHex(buffer))
    assert(bufferParsed instanceof ArrayBuffer)

    const bufferParsedUint8Array = new Uint8Array(bufferParsed)
    assert(new Uint8Array(buffer).every((v, i) => v === bufferParsedUint8Array[i]))
  },

  'sign and verify': async () => {
    const text = 'lorem ipsum dolor'
    const sig = await signStr(text)
    await verifyStr(sig, text)
    await assert.throws(() => verifyStr(sig + 'aa', text), 'invalid signature')
    await assert.throws(() => verifyStr(sig, text + 'a'), 'invalid signature')

    const text2 = 'asdf89u -098sd7fsadufih sadfh0isaudf09-2ui3/;sd3/.,mOI_(*YT*(^FTIDTXipf90as.sdafsdas djf-9i1j?KJPOih-9?oiuasdf83348'
    const sig2 = await signStr(text2)
    await verifyStr(sig2, text2)

    assert(sig2.length === 128)
  }
}
