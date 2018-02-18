/**
 * GitHub Integration:
 * - API v3 ref: https://developer.github.com/v3/repos/contents/
 * - Node.js SDK src: https://github.com/octokit/rest.js
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
const committer = {name: 'majorna', email: 'mj@majorna'}

/**
 * Retrieves a file's content from repo with given full path. i.e. "dir/sub_dir/filename".
 */
exports.getFileContent = async path => {
  const res = await octokit.repos.getContent({owner, repo, path})
  return (Buffer.from(res.data.content, 'base64')).toString()
}

/**
 * Creates a file with given content at given path, asynchronously.
 * Throws an error if the file already exists.
 */
exports.createFile = (text, path) => octokit.repos.createFile({owner, repo, path, message, committer, content: Buffer.from(text).toString('base64')})

/**
 * Creates a file with given data if it does not exist. Updates the file with the data if it exists.
 * Concurrent updates to the same file will throw an error.
 * @param text - Text to be appended at the end of the file.
 * @param path - Path of the file in git repo.
 */
exports.upsertFile = async (text, path) => {
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
