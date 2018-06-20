import assert from './assert'
import crypto from './crypto'

export default {
  'sign and verify': async () => {
    const text = 'lorem ipsum dolor'
    const sig = crypto.signText(text)
    assert(crypto.verifyText(sig, text))

    const text2 = 'asdf89u -098sd7fsadufih sadfh0isaudf09-2ui3/;sd3/.,mOI_(*YT*(^FTIDTXipf90as.sdafsdas djf-9i1j?KJPOih-9?oiuasdf83348'
    const sig2 = crypto.signText(text2)
    assert(crypto.verifyText(sig2, text2))

    assert(sig2.length === 92 || sig2.length === 96)
  }
}