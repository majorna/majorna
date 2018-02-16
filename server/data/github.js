/**
 * GitHub Integration:
 * - API v3 ref: https://developer.github.com/v3/repos/contents/
 * - Node.js SDK: https://github.com/octokit/rest.js
 * - Node.js SDK ref: https://octokit.github.io/rest.js/#api-Repos-getContent
 */
const octokit = require('@octokit/rest')()
const config = require('../config/config')
const utils = require('./utils')

// token auth (https://github.com/settings/tokens)
octokit.authenticate({
  type: 'token',
  token: config.github.token
})

// github api params
const owner = config.github.owner
const repo = config.github.repo
const message = 'tx' // commit msg
const committer = {name: 'majorna', email: 'mj@majorna'}

exports.getFile = async path => {
  const res = await octokit.repos.getContent({owner, repo, path})
  return res.data.content
}

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
  } catch (e) {
    if (e.code !== 404) {
      throw e
    }

    // file does not exist so create it
    await octokit.repos.createFile({owner, repo, path, message, committer, content: Buffer.from(text).toString('base64')})
    return
  }

  await octokit.repos.updateFile({
    owner,
    repo,
    path,
    message,
    committer,
    content: Buffer.concat([Buffer.from(res.data.content, 'base64'), Buffer.from('\n' + text)]).toString('base64'),
    sha: res.data.sha
  })
}

/**
 * Inserts a transaction into a block, which is currently choose by date.
 * @param tx - Transaction object.
 */
exports.insertTxInBlock = async tx => {
  // block file frequency = 1 per week for now
  const now = new Date()
  const path = `${now.getFullYear()}/weeks/${utils.getWeekNumber(now)}`
  await exports.upsertFile(path, JSON.stringify(tx))
}
