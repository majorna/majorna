const assert = require('assert')
const github = require('./github')

suite('github', () => {
  test('upsertFile', async () => {
    const res = github.upsertFile('README.md', null)
  })
})
