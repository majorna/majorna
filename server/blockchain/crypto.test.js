const assert = require('assert')
const crypto = require('./crypto')

suite('crypto', () => {
  test('sign-verify', () => {
    const text = 'lorem ipsum dolor'
    const sig = crypto.signText(text)
    assert(crypto.verifyText(text, sig))

    const text2 = 'asdf89u -098sd7fsadufih sadfh0isaudf09-2ui3/;sd3/.,mOI_(*YT*(^FTIDTXipf90as.sdafsdas djf-9i1j?KJPOih-9?oiuasdf83348'
    const sig2 = crypto.signText(text2)
    assert(crypto.verifyText(text2, sig2))

    assert(sig2.length < 100, `signature length was: ${sig2.length}`)
  })

  test('signObj', () => {
    const obj = {wow: 'yeah'}
    const sigObj = crypto.signObj(obj)
    assert(sigObj.sig)
    assert(sigObj.sig.length > 50)
    assert(sigObj.data.wow === 'yeah')
  })

  test('hash', () => {
    const obj = {stuff: 'loremipsum'}
    const text = JSON.stringify(obj)
    const hash = 'dIg1zb/3Caq5LJnoBnKprd19JRYylKg/CMAB09nPFXA=' // calculated with another tool

    const calcHash = crypto.hashText(text)
    assert(calcHash === hash)

    const calcHash2 = crypto.hashObj(obj)
    assert(calcHash2 === hash)
  })
})