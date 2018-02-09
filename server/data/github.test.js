const assert = require('assert')
const github = require('./github')

suite('github', () => {
  test.only('upsertFile', async () => {
    const res = await github.upsertFile('testfile', 'some-text' + Math.random())
    assert(res)
  })
})
