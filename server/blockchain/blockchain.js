const db = require('../data/db')
const crypto = require('./crypto')
const github = require('../data/github')

/**
 * Retrieves the full path of a block in a git repo with respect to given time and day shift.
 * @param time - 'Date' object instance.
 * @param dayShift - No of days to shift the time, if any. i.e. +5, -3, etc.
 */
exports.getBlockPath = (time, dayShift) => `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate() + (dayShift || 0)}`

/**
 * Creates and inserts a new block into the blockchain git repo, asynchronously.
 * Two separate files are created for the block header and data.
 * @param blockPath - Full path of the block to create. i.e. "dir/sub_dir/filename".
 * @param startTime - Time to start including txs from.
 * @param endTime - Time to stop including txs from.
 */
exports.insertBlock = async (startTime, endTime, blockPath) => {
  const txs = await db.getTxsByTimeRange(startTime, endTime)
  const signedBlock = crypto.signObj(txs)
  await github.createFile(JSON.stringify(signedBlock), blockPath)
}

/**
 * Checks if it is time then creates the required block in blockchain, asynchronously.
 */
exports.insertBlockIfRequired = async () => {
  // check if it is time to create a block
  const now = new Date()
  now.setMinutes(now.getMinutes() - 10 /* some latency to let ongoing txs to complete */)
  const prevBlockPath = exports.getBlockPath(now, -1)
  try {
    await github.getFileContent(prevBlockPath)
  } catch (e) {
    if (e.code === 404) {
      await exports.insertBlock(now, prevBlockPath)
      console.log(`inserted block ${prevBlockPath}`)
    } else {
      throw e
    }
  }
}

let timerStarted = false
/**
 * Starts the the blockchain insert timer.
 * Returns a number that can be used in clearing the interval with "clearInterval(ret)".
 */
exports.startBlockchainInsertTimer = () => {
  // prevent duplicate timers
  if (timerStarted) {
    return
  }
  timerStarted = true

  // start timer
  const interval = 1000/* ms */ * 60/* s */ * 15/* min */
  return setInterval(async () => {
    try {
      await exports.insertBlockIfRequired()
    } catch (e) { console.error(e) }
  }, interval)
}
