const testData = require('../config/test').data
const github = require('./github')
const utils = require('./utils')

// todo: git reset --hard head~xxx after tests / or just repo.deleteFile/updateFile
// todo: do 50 upserts at the same time and see if auto merge conflict resolution works (test 2: create file and update at the same time)
// todo: assert the changes with getContent

suite('github', () => {
  test('upsertFile', async () => {
    await github.upsertFile('testfile', 'some-text' + Math.random())
  })

  test('insertTxInBlock', async () => {
    await github.insertTxInBlock(testData.txs[utils.getRandomInt(testData.txs.length)])
  })
})
