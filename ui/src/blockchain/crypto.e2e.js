import assert from './assert'
import config from '../data/config'
import {
  convertBufferToHexStr, convertHexStrToBuffer, getBlockHashPalette, hashStrToHexStr, signStrToHexStr,
  verifyStrWithHexStrSig
} from './crypto'

const buffer = new Uint8Array([0, 1, 2, 42, 100, 101, 102, 255]).buffer

export default {
  'init': config.initKeys,

  'hex': () => {
    const bufferParsed = convertHexStrToBuffer(convertBufferToHexStr(buffer))
    assert(bufferParsed instanceof ArrayBuffer)

    const bufferParsedUint8Array = new Uint8Array(bufferParsed)
    assert(new Uint8Array(buffer).every((v, i) => v === bufferParsedUint8Array[i]))
  },

  'hash': async () => {
    const str = 'piasdf098usdahofiusd-9fihbosduafhoisadufh-oihweew34dsaffdsaf'
    const sha256Hex = 'C810A71CBCBE7458DBF371590AA76395033347558CA8583F540B381E612FE2A7'

    const computedSha256Hex = await hashStrToHexStr(str)
    assert.equal(sha256Hex, computedSha256Hex.toUpperCase())
  },

  'sign and verify': async () => {
    const text = 'lorem ipsum dolor'
    const sig = await signStrToHexStr(text)
    await verifyStrWithHexStrSig(sig, text)
    await assert.throws(() => verifyStrWithHexStrSig(sig + 'aa', text), 'invalid signature')
    await assert.throws(() => verifyStrWithHexStrSig(sig, text + 'a'), 'invalid signature')

    const text2 = 'asdf89u -098sd7fsadufih sadfh0isaudf09-2ui3/;sd3/.,mOI_(*YT*(^FTIDTXipf90as.sdafsdas djf-9i1j?KJPOih-9?oiuasdf83348'
    const sig2 = await signStrToHexStr(text2)
    await verifyStrWithHexStrSig(sig2, text2)

    assert(sig2.length === 128)
  },

  'getBlockHashPalette': () => {
    const tNominal = 15 // ms
    const t0 = performance.now()
    const p = getBlockHashPalette()
    const t1 = performance.now()
    const td = t1 - t0
    assert(p)
    assert(td > (tNominal - 5) && td < (tNominal * 5))
    // console.log(`block hash palette was generated in: ${td}ms, expected nominal: ${tNominal}ms`)
  }
}
