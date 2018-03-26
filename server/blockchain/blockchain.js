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
 * Looks for the latest block then creates a new block with matching txs (if any), asynchronously.
 * Start time will be the very beginning of the day that the last block was created. End date will be the very beginning of {now}.
 * Also the previous block is inserted into the git repo, since it cannot be updated any more.
 * @param now - Required just in case day changes right before the call to this function (so not using new Date()).
 * @param blockInfo - Block info meta document.
 * @param customOldBlockPath - Only used for testing. Useful for creating same block in git repo without overwriting the same one.
 */
exports.insertBlockSinceLastOne = async (now, blockInfo, customOldBlockPath) => {
  const txs = await db.getTxsByTimeRange(blockInfo.header.time, now)
  const newBlock = await db.insertBlock(txs)
  const oldBlock = await db.getBlock(newBlock.header.no - 1)
  const oldBlockPath = customOldBlockPath || exports.getBlockPath(oldBlock.header)
  await github.createFile(block.toJson(oldBlock), oldBlockPath)
  console.log(`inserted new block`)
}

/**
 * Checks if it is time then creates the required block in blockchain, asynchronously.
 * Returns true if a block was inserted. False otherwise.
 * @param now - Only used for testing. Automatically calculated otherwise.
 */
exports.insertBlockIfRequired = async now => {
  // check if it is time to create a block
  now = now || new Date()
  now.setMinutes(now.getMinutes() - 5 /* some latency to let ongoing tx insert operations to complete */)
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
  // todo: also verify blocks for last 1 week or so to make sure that all txs are in blocks, and all blocks are valid
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
  interval = interval || 1000/* ms */ * 60/* s */ * 5/* min */
  return setInterval(() => failSafeInsertBlockIfRequired(), interval)
}
