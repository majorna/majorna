const assert = require('assert')
const crypto = require('./crypto')

suite('crypto', () => {
  test('sign-verify', () => {
    const text = 'lorem ipsum dolor'
    const sig = crypto.signTextOrBuffer(text)
    assert(crypto.verifyTextOrBuffer(sig, text))

    const text2 = 'asdf89u -098sd7fsadufih sadfh0isaudf09-2ui3/;sd3/.,mOI_(*YT*(^FTIDTXipf90as.sdafsdas djf-9i1j?KJPOih-9?oiuasdf83348'
    const sig2 = crypto.signTextOrBuffer(text2)
    assert(crypto.verifyTextOrBuffer(sig2, text2))

    assert(sig2.length === 92 || sig2.length === 96)
  })

  test('hash', () => {
    const obj = {stuff: 'loremipsum'}
    const text = JSON.stringify(obj)
    const hash = 'dIg1zb/3Caq5LJnoBnKprd19JRYylKg/CMAB09nPFXA=' // calculated with another tool

    const calcHash = crypto.hashTextOrBuffer(text)
    assert(calcHash === hash)
    assert(calcHash.length === 44)
  })
})
