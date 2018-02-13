const assert = require('assert')
const crypto = require('./crypto')

suite('crypto', () => {
  test('sign-verify', () => {
    const text = 'lorem ipsum dolor'
    const sig = crypto.sign(text)
    assert(crypto.verify(text, sig))
  })
})
