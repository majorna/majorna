const github = require('../data/github')

/**
 * Retrieves the full path of a block in a git repo with respect to given time and day shift.
 * @param time - 'Date' object instance.
 * @param dayShift - No of days to shift the time, if any. i.e. +5, -3, etc.
 */
exports.getBlockPath = (time, dayShift) => `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate() + dayShift}`

/**
 * Creates and inserts a new block into the blockchain git repo, asynchronously.
 * Two separate files are created for the block header and data.
 * @param blockPath - Full path of the block to create. i.e. "dir/sub_dir/filename".
 */
exports.insertBlock = async blockPath => {
  // get last block header

  // get all txs since last block interval + 1 hours (not to allow any conflicts)

  // const signedBlock = crypto.signObj()
  // await github.insertTxInBlock(signedBlock)

  // block file frequency = 1 per week for now
  // const now = new Date()
  // const path = `${now.getFullYear()}/weeks/${utils.getWeekNumber(now)}`
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
    await github.getFileContent(prevBlockPath + '-header')
  } catch (e) {
    if (e.code === 404) {
      await exports.insertBlock(prevBlockPath)
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
  const interval = 1000/* ms */ * 60/* s */ * 10/* min */
  return setInterval(async () => {
    try {
      await exports.insertBlockIfRequired()
    } catch (e) { console.error(e) }
  }, interval)
}
