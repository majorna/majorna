// const assert = require('assert')
const github = require('./github')

// todo: git reset --hard head~xxx after tests

suite('github', () => {
  test.only('upsertFile', async () => {
    await github.upsertFile('testfile', 'some-text' + Math.random())
  })
})
