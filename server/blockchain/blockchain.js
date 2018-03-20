const db = require('../data/db')
const block = require('./block')
const github = require('../data/github')
const crypto = require('./crypto')
const utils = require('../data/utils')

// block difficulty increases by this step every time someone finds and submits a valid nonce
exports.blockDifficultyIncrementStep = 1

/**
 * Retrieves the full path of a block in a git repo with respect to given time and day shift.
 * @param time - 'Date' object instance.
 * @param dayShift - No of days to shift the time, if any. i.e. +5, -3, etc.
 */
exports.getBlockPath = (time, dayShift) => {
  time = new Date(time.getTime()) // don't modify original
  if (dayShift) {
    time.setDate(time.getDate() + dayShift)
  }
  return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()}`
}

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
 * Creates and inserts a new block into the blockchain git repo, asynchronously.
 * @param startTime - Time to start including txs from.
 * @param endTime - Time to stop including txs from.
 * @param blockPath - Full path of the block to create. i.e. "dir/sub_dir/filename".
 * @param prevBlockHeader - Previous block's header.
 */
exports.insertBlock = async (startTime, endTime, blockPath, prevBlockHeader) => {
  const txs = await db.getTxsByTimeRange(startTime, endTime)
  const newBlock = block.create(txs, prevBlockHeader)
  block.sign(newBlock)
  block.verify(newBlock, prevBlockHeader)
  // todo: move this inside transaction in db.insertBlock
  await github.createFile(block.toJson(newBlock), blockPath)
  console.log(`inserted block ${blockPath}`)
}

/**
 * Looks for the latest block then creates a new block with matching txs (if any), asynchronously.
 * Start time will be the very beginning of the day that the last block was created.
 * End date will be the very beginning of {now}.
 * @param now - Required just in case day changes right before the call to this function (so not using new Date()).
 * @param blockPath - Full path of the block to create. i.e. "dir/sub_dir/filename".
 * @param lastBlockHeader - Only used for testing. Automatically retrieved from GitHub otherwise.
 */
exports.insertBlockSinceLastOne = async (now, blockPath, lastBlockHeader) => {
  if (!lastBlockHeader) {
    const blockInfo = await db.getBlockInfo()
    lastBlockHeader = blockInfo.lastBlockHeader
  }
  const blockTimeRange = exports.getBlockTimeRange(lastBlockHeader.time, now)
  await exports.insertBlock(blockTimeRange.start, blockTimeRange.end, blockPath, lastBlockHeader)
}

/**
 * Checks if it is time then creates the required block in blockchain, asynchronously.
 * Returns true if a block was inserted. False otherwise.
 * @param blockPath - Only used for testing. Automatically calculated otherwise.
 * @param now - Only used for testing. Automatically calculated otherwise.
 */
exports.insertBlockIfRequired = async (blockPath, now) => {
  // check if it is time to create a block
  now = now || new Date()
  now.setMinutes(now.getMinutes() - 15 /* some latency to let ongoing txs to complete */)
  blockPath = blockPath || exports.getBlockPath(now, -1)
  try {
    await github.getFileContent(blockPath)
    console.log('not enough time elapsed since the last block so skipping block creation')
    return false
  } catch (e) {
    if (e.code !== 404) throw e
    await exports.insertBlockSinceLastOne(now, blockPath)
    return true
  }
}
