import assert from './assert'
import config from '../data/config'
import { bufferToBase64, base64ToArrayBuffer, bufferToHex, hexToBuffer, signText, verifyText } from './crypto'

const buffer = new Uint8Array([0, 1, 2, 42, 100, 101, 102, 255])

export default {
  'init': config.initKeys,

  'base64': () => {
    const bufferParsed = base64ToArrayBuffer(bufferToBase64(buffer))
    assert(buffer.every((v, i) => v === bufferParsed[i]))
  },

  'hex': () => {
    const bufferParsed = hexToBuffer(bufferToHex(buffer))
    assert(buffer.every((v, i) => v === bufferParsed[i]))
  },

  'sign and verify': async () => {
    const text = 'lorem ipsum dolor'
    const sig = await signText(text)
    assert(await verifyText(sig, text))

    const text2 = 'asdf89u -098sd7fsadufih sadfh0isaudf09-2ui3/;sd3/.,mOI_(*YT*(^FTIDTXipf90as.sdafsdas djf-9i1j?KJPOih-9?oiuasdf83348'
    const sig2 = await signText(text2)
    assert(await verifyText(sig2, text2))

    assert(sig2.length === 88)
  }
}
