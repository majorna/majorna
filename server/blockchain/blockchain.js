const db = require('../data/db')
const block = require('./block')
const github = require('../data/github')

// block difficulty increases by this step every time someone finds and submits a valid nonce
exports.blockDifficultyIncrementStep = 1

const blockInterval = 24 * 60 * 60 * 1000 // ms

/**
 * Retrieves the full path of a block in git repo.
 */
exports.getBlockPath = blockHeader => `${blockHeader.time.getUTCFullYear()}/${blockHeader.no}`

/**
 * Provides a time range for a block:
 * Start: Midnight of {start}.
 * End: Midnight of {end}.
 */
exports.getBlockTimeRange = (start, end) => {
  // make copies of date object not to modify originals
  start = new Date(start.getTime())
  start.setUTCHours(0, 0, 0, 0)

  end = new Date(end.getTime())
  end.setUTCHours(0, 0, 0, 0)

  return {start, end}
}

/**
 * Creates and inserts a new block into the database, asynchronously.
 * In addition, previous block is exported to git repo.
 * @param startTime - Time to start including txs from.
 * @param endTime - Time to stop including txs from.
 */
exports.insertBlock = async (startTime, endTime) => {
  const txs = await db.getTxsByTimeRange(startTime, endTime)
  const newBlock = await db.insertBlock(txs)
  const oldBlock = await db.getBlock(newBlock.header.no - 1)
  const blockPath = exports.getBlockPath(oldBlock.header)
  await github.createFile(block.toJson(oldBlock), blockPath)
  console.log(`inserted block ${blockPath}`)
}

/**
 * Looks for the latest block then creates a new block with matching txs (if any), asynchronously.
 * Start time will be the very beginning of the day that the last block was created.
 * End date will be the very beginning of {now}.
 * @param now - Required just in case day changes right before the call to this function (so not using new Date()).
 * @param blockInfo - Block info met doc.
 */
exports.insertBlockSinceLastOne = async (now, blockInfo) => {
  // start with getting the time of the last tx in the last block
  const oldBlock = await db.getBlock(blockInfo.header.no - 1)


  const blockTimeRange = exports.getBlockTimeRange(blockInfo.header.time, now)
  await exports.insertBlock(blockTimeRange.start, blockTimeRange.end)
}

/**
 * Checks if it is time then creates the required block in blockchain, asynchronously.
 * Returns true if a block was inserted. False otherwise.
 * @param now - Only used for testing. Automatically calculated otherwise.
 */
exports.insertBlockIfRequired = async now => {
  // check if it is time to create a block
  now = now || new Date()
  now.setMinutes(now.getMinutes() - 15 /* some latency to let ongoing txs to complete */)
  const blockInfo = await db.getBlockInfo()

  if (blockInfo.header.time.getTime() + blockInterval < now.getTime()) {
    await exports.insertBlockSinceLastOne(now, blockInfo)
    return true
  } else {
    console.log('not enough time elapsed since the last block so skipping block creation')
    return false
  }
}

function failSafeInsertBlockIfRequired () {
  exports.insertBlockIfRequired().catch(e => console.error(e))
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

  // do initial block check immediately
  // skip on testing since ongoing promise can do conflicting data changes
  !interval && failSafeInsertBlockIfRequired()

  // start timer
  interval = interval || 1000/* ms */ * 60/* s */ * 15/* min */
  return setInterval(() => failSafeInsertBlockIfRequired(), interval)
}
