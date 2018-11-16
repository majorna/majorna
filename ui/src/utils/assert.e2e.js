import assert from './assert'

export default {
  'AssertionError': async () => {
    try {
      assert(2 === 4, 'lorem')
    } catch (e) {
      assert(e.type === 'AssertionError')
      assert(e.message === 'lorem')
    }
  },

  'throws': async () => {
    await assert.throws(async () => { throw new Error('wow') }, 'wow')
  }
}
