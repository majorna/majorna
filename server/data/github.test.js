const assert = require('assert')
const testData = require('../config/test').data
const github = require('./github')
const utils = require('./utils')

const testFilePath = 'testfile'
const readmePath = 'README.md'

// todo: cleanup repo to 1st commit in 'suiteSetup in test.js'
// todo: do 50 upserts at the same time and see if auto merge conflict resolution works (test 2: create file and update at the same time)
// make sure that no data is lost (overwritten by old ones) and file has 50 lines total

suite('github', () => {
  test('getFileContent', async () => {
    const readme = await github.getFileContent(readmePath)
    assert(readme.includes('test-blockchain'))
  })

  test('createFile', async () => {
    const path = 'testfiles/testfile-' + Math.random()
    const text = 'some-text-' + Math.random()
    await github.createFile(text, path)
    const file = await github.getFileContent(path)
    console.log(file)
    assert(file === text)

    // verify that it is not overwritten by calling create again
  })

  test('upsertFile', async () => {
    const appendText = 'some-text-' + Math.random()
    await github.upsertFile(appendText, testFilePath)
    const updatedFile = await github.getFileContent(testFilePath)
    assert(updatedFile.endsWith(updatedFile))
  })

  test('insertTxInBlock', async () => {
    await github.insertTxInBlock(testData.txs[utils.getRandomInt(testData.txs.length)])
    // todo: assert file content
  })
})
