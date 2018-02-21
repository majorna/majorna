const db = require('../data/db')
const block = require('./block')
const github = require('../data/github')

/**
 * Retrieves the full path of a block in a git repo with respect to given time and day shift.
 * @param time - 'Date' object instance.
 * @param dayShift - No of days to shift the time, if any. i.e. +5, -3, etc.
 */
exports.getBlockPath = (time, dayShift) => `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate() + (dayShift || 0)}`

/**
 * Provides a time range for a block:
 * Start: Midnight of {now} minus the {goBackDays} days.
 * End: Midnight of {now}.
 * @param now - Required just in case day changes right before the call to this function.
 * @param goBackDays - No of days to go back in time as the start date.
 */
exports.getBlockTimeRange = (now, goBackDays = 1) => {
  const start = new Date(now.getTime())
  start.setUTCHours(0, 0, 0, 0)
  start.setDate(start.getDate() - goBackDays)

  const end = new Date(now.getTime())
  end.setUTCHours(0, 0, 0, 0)

  return {start, end}
}

/**
 * Creates and inserts a new block into the blockchain git repo, asynchronously.
 * Two separate files are created for the block header and data.
 * @param startTime - Time to start including txs from.
 * @param endTime - Time to stop including txs from.
 * @param blockPath - Full path of the block to create. i.e. "dir/sub_dir/filename".
 * @param prevBlock - Full path of the previous block. i.e. "dir/sub_dir/filename".
 */
exports.insertBlock = async (startTime, endTime, blockPath, prevBlock) => {
  const txs = await db.getTxsByTimeRange(startTime, endTime)
  const signedBlock = block.createSignedBlock(txs, prevBlock, true)
  await github.createFile(JSON.stringify(signedBlock, null, 2), blockPath)
}

/**
 * Checks if it is time then creates the required block in blockchain, asynchronously.
 * Returns true if a block was inserted. False otherwise.
 * @param prevBlockPath - Only used for testing. Automatically calculated otherwise.
 */
exports.insertBlockIfRequired = async prevBlockPath => {
  // check if it is time to create a block
  const now = new Date()
  now.setMinutes(now.getMinutes() - 15 /* some latency to let ongoing txs to complete */)
  prevBlockPath = prevBlockPath || exports.getBlockPath(now, -1)
  try {
    await github.getFileContent(prevBlockPath)
    console.log('not time to create a block yet')
    return false
  } catch (e) {
    if (e.code === 404) {
      const blockTimeRange = exports.getBlockTimeRange(now)
      // todo: move logic somewhere else and keep this function "if-block-required" only
      await exports.insertBlock(blockTimeRange.start, blockTimeRange.end, prevBlockPath, null /* todo: ... */)
      console.log(`inserted block ${prevBlockPath}`)
      return true
    } else {
      throw e
    }
  }
}

let timerStarted = false
/**
 * Starts the the blockchain insert timer.
 * Returns a number that can be used in clearing the interval with "clearInterval(ret)".
 * @param interval - Only used for testing. Automatically calculated otherwise.
 */
exports.startBlockchainInsertTimer = interval => {
  // prevent duplicate timers
  if (timerStarted) {
    return
  }
  timerStarted = true

  // start timer
  interval = interval || 1000/* ms */ * 60/* s */ * 15/* min */
  return setInterval(async () => {
    try {
      await exports.insertBlockIfRequired()
    } catch (e) { console.error(e) }
  }, interval)
}
