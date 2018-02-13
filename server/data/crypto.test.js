const assert = require('assert')
const crypto = require('./crypto')

suite.only('crypto', () => {
  test('sign-verify', () => {
    const text = 'lorem ipsum dolor'
    const sig = crypto.sign(text)
    assert(crypto.verify(text, sig))

    const text2 = 'asdf89u -098sd7fsadufih sadfh0isaudf09-2ui3/;sdipf90as.sdajf-9i1j?KJPOih-9?oiuasdf83348'
    const sig2 = crypto.sign(text2)
    assert(crypto.verify(text2, sig2))

    assert(sig2.length < 100, `signature length was: ${sig2.length}`)
  })
})
