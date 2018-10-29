const assert = require('assert')
const testConfig = require('../config/test')
const github = require('./github')

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
    const path = testConfig.getGitHubTestFilePath()
    const text = 'some-text-' + new Date().getTime()
    await github.createFile(text, path)
    const file = await github.getFileContent(path)
    assert(file === text)

    // verify that it is not overwritten by calling create again
    await assert.rejects(() => github.createFile(text, path))
  })

  test('upsertFile', async () => {
    const testFilePath = testConfig.getGitHubTestFilePath()
    const appendText = 'some-text-' + new Date().getTime()
    await github.upsertFile(appendText, testFilePath)
    const updatedFile = await github.getFileContent(testFilePath)
    assert(updatedFile.endsWith(updatedFile))
  })
})
