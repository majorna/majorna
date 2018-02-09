/**
 * GitHub Integration:
 * - API v3 ref: https://developer.github.com/v3/repos/contents/
 * - Node.js SDK: https://github.com/octokit/rest.js
 * - Node.js SDK ref: https://octokit.github.io/rest.js/#api-Repos-getContent
 */
const octokit = require('@octokit/rest')()
const config = require('../config/config')

// token auth (https://github.com/settings/tokens)
octokit.authenticate({
  type: 'token',
  token: config.github.token
})

// github api params
const owner = config.github.owner
const repo = config.github.repo
const message = 'tx' // commit msg

/**
 * Creates a file with given data if it does not exist.
 * Updates the file with the data if it exists.
 * @param path - Path of the file in git repo.
 * @param text - Text to be appended at the end of the file.
 */
exports.upsertFile = async (path, text) => {
  let res
  try {
    res = await octokit.repos.getContent({owner, repo, path})
    console.log('some res', res)
  } catch (e) {
    if (e.code !== 404) {
      throw e
    }

    // file does not exist so create it
    await octokit.repos.createFile(owner, repo, path, message, Buffer.from(text).toString('base64'))
    return
  }

  await octokit.repos.updateFile({
    owner,
    repo,
    path,
    message,
    content: Buffer.concat([Buffer.from(res.data.content, 'base64'), Buffer.from('\n' + text)]).toString('base64'),
    sha: res.data.sha
  })
}

/**
 * Inserts a transaction into a block.
 * @param tx - Transaction data.
 */
exports.insertTxInBlock = tx => {

}
