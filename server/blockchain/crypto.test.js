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

    assert(sig2.length === 140 || sig2.length === 142 || sig2.length === 144)
  })

  test('hash', () => {
    const jsonText = '{"stuff":"loremipsum"}'
    const hash = '748835cdbff709aab92c99e80672a9addd7d25163294a83f08c001d3d9cf1570' // calculated with another tool

    const calcHash = crypto.hashTextOrBuffer(jsonText)
    assert(calcHash === hash)
    assert(calcHash.length === 64)
  })
})
