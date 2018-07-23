const config = require('../config/config')
const db = require('../data/db')
const block = require('./block')
const github = require('../data/github')

/**
 * Retrieves the full path of a block in git repo.
 */
exports.getBlockPath = blockHeader => `${blockHeader.time.getUTCFullYear()}/${blockHeader.no}`

/**
 * Looks for the latest block then creates a new block with matching txs, asynchronously.
 * Start time will be the very beginning of the day that the last block was created. End date will be the very beginning of {now}.
 * Also the previous block is inserted into the git repo, since it cannot be updated any more.
 * @param now - Required just in case day changes right before the call to this function (so not using new Date()).
 * @param blockInfo - Block info meta document.
 * @param customOldBlockPath - Only used for testing. Useful for creating same block in git repo without overwriting the same one.
 */
exports.insertBlockSinceLastOne = async (now, blockInfo, customOldBlockPath) => {
  // don't allow non-mined blocks, except for initial block (so users can start mining right away)
  if (!blockInfo.header.nonce && blockInfo.header.no > 2) {
    console.log(`previous block is not mined so skipping block creation`)
    return
  }
  // insert old block to storage first, in case it fails, we will skip new block creation and try again
  const oldBlock = await db.getBlock(blockInfo.header.no)
  let oldBlockPath = customOldBlockPath || exports.getBlockPath(oldBlock.header)
  config.app.isDev && (oldBlockPath += `-${new Date().getTime()}`)
  try {
    await github.createFile(block.toJson(oldBlock), oldBlockPath)
  } catch (e) {
    // this happens when file was inserted but github failed to ack
    if (!(e.message.includes('sha') && e.message.includes('wasn\'t supplied'))) throw e
  }
  const txs = await db.getTxsByTimeRange(blockInfo.header.time, now)
  const newBlock = await db.insertBlock(txs, now)
  console.log(`inserted new block: no ${newBlock.header.no}, time: ${newBlock.header.time}, previous-nonce: ${oldBlock.header.nonce}`)
}

/**
 * Checks if it is time then creates the required block in blockchain, asynchronously.
 * @param now - Only used for testing. Automatically calculated otherwise.
 * @param customOldBlockPath - Only used for testing. Useful for creating same block in git repo without overwriting the same one.
 */
exports.insertBlockIfRequired = async (now, customOldBlockPath) => {
  // check if it is time to create a block
  now = now || new Date()
  // todo: this 5 min stuff creates confusion in the UI, where current block seems 5 mins in the past even if it's freshly created
  now.setMinutes(now.getMinutes() - 5 /* some latency to let ongoing tx insert operations to complete */)
  const blockInfo = await db.getBlockInfo()

  if (now.getTime() > blockInfo.header.time.getTime() + config.blockchain.blockInterval) {
    await exports.insertBlockSinceLastOne(now, blockInfo, customOldBlockPath)
    return
  }

  console.log('not enough time elapsed since the last block so skipping block creation')
}

/**
 * Calls conditional block insertion and stat updater functions and silently logs all errors thrown.
 */
function failSafeInsertBlockAndUpdateStatsIfRequired () {
  exports.insertBlockIfRequired().catch(e => console.error(e))
  db.updateMjMetaStatsIfRequired().catch(e => console.error(e))
  // todo: also verify blocks for last 1 week or so to make sure that all txs are in blocks, and all blocks are valid
}

let timerStarted = false
/**
 * Starts the the blockchain insert timer.
 * Returns a number that can be used in clearing the interval with "clearInterval(ret)".
 * @param interval - Only used for testing.
 */
exports.startBlockchainInsertTimer = interval => {
  // prevent duplicate timers
  if (timerStarted) {
    return
  }
  timerStarted = true

  // do initial block check immediately
  // skip on testing since ongoing promise can do conflicting data changes as we don't await the promise
  !interval && failSafeInsertBlockAndUpdateStatsIfRequired()

  // start timer
  interval = interval || Math.round(config.blockchain.blockInterval / 2)
  return setInterval(() => failSafeInsertBlockAndUpdateStatsIfRequired(), interval)
}
