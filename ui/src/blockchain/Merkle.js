import { hash, hashStr, bufferToHex } from './crypto'

export default class Merkle {
  leaves = [] // item hashes: array of ArrayBuffer(s)
  levels = [] // 2D merkle schema that is fit for console.log(merkle.levels) so you will get a nicely styled diagram

  static create = async items => {
    const merkle = new Merkle()

    for (let i = 0; i < items.length; i++) {
      const itemHash = await hashStr(items[i])
      merkle.leaves.push(itemHash)
    }

    merkle.levels.unshift(merkle.leaves)
    while (merkle.levels[0].length > 1) {
      merkle.levels.unshift(await calcNextLevel(merkle.levels[0]))
    }

    return merkle
  }

  getMerkleRoot = () => bufferToHex(this.levels[0][0])

  getProof = () => {}

  validateProof = () => {
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
      nodes.push(await hash(node.buffer))
    } else {
      // this is an odd ending node, promote up to the next level by itself
      nodes.push(topLevel[x])
    }
  }
  return nodes
}
