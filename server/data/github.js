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

/**
 * Creates a file with given data if it does not exist.
 * Updates the file with the data if it exists.
 * @param path - Path of the file in git repo.
 * @param data - Data to be appended at the end of the file.
 */
exports.upsertFile = async (path, data) => {
  const res = await octokit.repos.getContent({owner, repo, path})
  console.log(res)
  return res
}

/**
 * Inserts a transaction into a block.
 * @param tx - Transaction data.
 */
exports.insertTxInBlock = tx => {

}