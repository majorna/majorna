// const assert = require('assert')
const github = require('./github')

// todo: git reset --hard head~xxx after tests
// todo: do 50 upserts at the same time and see if auto merge conflict resolution works (test 2: create file and update at the same time)

suite('github', () => {
  test.only('upsertFile', async () => {
    await github.upsertFile('testfile', 'some-text' + Math.random())
  })
})
