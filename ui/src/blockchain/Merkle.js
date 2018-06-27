import { hash, hashStr, bufferToHex } from './crypto'
export default class {
  leaves = [] // item hashes: array of ArrayBuffer(s)

  levels = []

  addLeaves = async items => {
    for (let i = 0; i < items.length; i++) {
      const itemHash = await hashStr(items[i])
      this.leaves.push(itemHash)
    }

    this.levels.unshift(this.leaves)
    while (this.levels[0].length > 1) {
      this.levels.unshift(await calcNextLevel(this.levels[0]))
    }
  }

  getMerkleRoot = () => bufferToHex(this.levels[0][0])

  getProof = () => {}

  validateProof = () => {}
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
