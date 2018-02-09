// const assert = require('assert')
const github = require('./github')

suite('github', () => {
  test.only('upsertFile', async () => {
    await github.upsertFile('testfile', 'some-text' + Math.random())
  })
})
