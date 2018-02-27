const db = require('../data/db')
const block = require('./block')
const github = require('../data/github')

const lastBlockHeaderPath = 'lastblock'

/**
 * Retrieves last block's header as an object from github, asynchronously.
 * Will throw an error with {code=404} property if last block is not found.
 */
exports.getLastBlockHeader = async () => {
  const lastBlockHeaderFile = await github.getFileContent(lastBlockHeaderPath)
  const header = JSON.parse(lastBlockHeaderFile)
  if (typeof header.time === 'string') header.time = new Date(header.time)
  return header
}

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
 * Returns true if a block was inserted. False if there were no txs found to create a block with.
 * @param startTime - Time to start including txs from.
 * @param endTime - Time to stop including txs from.
 * @param blockPath - Full path of the block to create. i.e. "dir/sub_dir/filename".
 * @param prevBlock - Full path of the previous block. i.e. "dir/sub_dir/filename".
 */
exports.insertBlock = async (startTime, endTime, blockPath, prevBlock) => {
  const txs = await db.getTxsByTimeRange(startTime, endTime)
  if (txs.length) {
    const signedBlock = block.createSignedBlock(txs, prevBlock, true)
    // todo: below two should be a single operation editing multiple files so they won't fail separately
    await github.createFile(JSON.stringify(signedBlock, null, 2), blockPath)
    await github.upsertFile(JSON.stringify(signedBlock.header, null, 2), lastBlockHeaderPath)
    console.log(`inserted block ${blockPath}`)
    return true
  } else {
    console.log(`no txs found to create block with`)
    return false
  }
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
  // get latest block file
  if (!lastBlockHeader) {
    try {
      lastBlockHeader = await exports.getLastBlockHeader()
    } catch (e) {
      if (e.code === 404) {
        lastBlockHeader = block.genesisBlock
      } else {
        throw e
      }
    }
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
    console.log('not the time to create a block yet')
    return false
  } catch (e) {
    if (e.code !== 404) {
      throw e
    }

    await exports.insertBlockSinceLastOne(now, blockPath)
    return true
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
