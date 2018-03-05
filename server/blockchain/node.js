const blockchain = require('../blockchain/blockchain')
const block = require('../blockchain/block')
const utils = require('../data/utils')
const crypto = require('./crypto')

/**
 * Retrieves last last mineable block for peers that choose to trust the majorna server.
 * In most cases, one honest peer is enough to get the longest blockchain since it's so hard to craft a fake one.
 */
exports.getMineableBlock = async () => {
  const lastBlockHeader = await blockchain.getLastBlockHeader()
  const str = block.getHeaderStr(lastBlockHeader, true)
  return {header: lastBlockHeader, headerAsString: str}
}

exports.collectMiningReward = async (blockNo, nonce) => {
  const mineableBlock = await exports.getMineableBlock()
  if (blockNo !== mineableBlock.header.no) {
    throw utils.UserVisibleError('Mined block is not the latest.')
  }

  const hash = crypto.hashText(nonce + mineableBlock.headerAsString)
  return block.getHashDifficulty(hash)
}
