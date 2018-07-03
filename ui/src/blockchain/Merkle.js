import { hashBufferToBuffer, hashStrToBuffer, convertBufferToHexStr } from './crypto'

export default class Merkle {
  /**
   * Item hashes: An array of ArrayBuffers.
   */
  leaves = []

  /**
   * 2D Merkle schema that is fit for console.log(merkle.levels) so you will get a nicely styled diagram.
   */
  levels = []

  /**
   * Hex encoded Merkle root.
   */
  root = ''

  /**
   * Construct a Merkle tree with given hash array, asynchronously.
   * If a string array is given instead of a hash array, set hashItems to true.
   */
  static create = async (items, hashItems) => {
    const m = new Merkle()

    for (let i = 0; i < items.length; i++) {
      const itemHash = hashItems ? await hashStrToBuffer(items[i]) : items[i]
      m.leaves.push(itemHash)
    }

    m.levels.unshift(m.leaves)
    while (m.levels[0].length > 1) {
      m.levels.unshift(await calcNextLevel(m.levels[0]))
    }

    m.root = convertBufferToHexStr(m.levels[0][0])
    return m
  }

  getProof = item => {}

  verifyProof = () => {
    // todo: merkle-tools checks the proof without checking the tree depth hence enabling: https://en.wikipedia.org/wiki/Merkle_tree#Second_preimage_attack
    // we already store txCount in header so can easily verify the tree depth ourselves on top of merkle-tools path verification
  }
}

async function calcNextLevel(topLevel) {
  const nodes = []
  const topLevelCount = topLevel.length
  for (let x = 0; x < topLevelCount; x += 2) {
    if (x + 1 <= topLevelCount - 1) {
      // concatenate and hash the pair, add to the next level
      const item1 = new Uint8Array(topLevel[x])
      const item2 = new Uint8Array(topLevel[x + 1])
      const node = new Uint8Array(item1.length + item2.length)
      node.set(item1)
      node.set(item2, item1.length)
      nodes.push(await hashBufferToBuffer(node.buffer))
    } else {
      // this is an odd ending node, promote up to the next level by itself
      nodes.push(topLevel[x])
    }
  }
  return nodes
}
