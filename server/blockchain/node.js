const blockchain = require('../blockchain/blockchain')
const block = require('../blockchain/block')
const utils = require('../data/utils')
const crypto = require('./crypto')

/**
 * Retrieves last last mineable block for peers that choose to trust the majorna server.
 * In most cases, one honest peer is enough to get the longest blockchain since it's so hard to fake an entire chain.
 */
exports.getMineableBlock = async () => {
  const lastBlockHeader = await blockchain.getLastBlockHeader()
  const str = block.getHeaderStr(lastBlockHeader, true)
  const difficulty = lastBlockHeader.difficulty + 1 // always need to work on a greater difficulty than existing
  return {
    blockNo: lastBlockHeader.no,
    difficulty,
    reward: block.getBlockReward(difficulty),
    headerAsString: str
  }
}

/**
 *
 * @param blockNo
 * @param nonce
 * @returns {Promise.<void>}
 */
exports.collectMiningReward = async (blockNo, nonce) => {
  const mineableBlock = await exports.getMineableBlock()
  if (blockNo !== mineableBlock.header.no) {
    throw utils.UserVisibleError('Mined block is not the latest.')
  }

  const hash = crypto.hashText(nonce + mineableBlock.headerAsString)
  const difficulty = block.getHashDifficulty(hash)
  if (difficulty < mineableBlock.header.difficulty) {
    throw utils.UserVisibleError('Given nonce difficulty is less than the target difficulty.')
  }
}
