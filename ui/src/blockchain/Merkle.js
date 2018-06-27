import { hash } from './crypto'
export default class {
  leaves = [] // item hashes: array of ArrayBuffer(s)

  levels = []

  addLeaves = async items => {
    for (let i = 0; i < items.length; i++) {
      const itemHash = await hash(items[i])
      this.leaves.push(itemHash)
    }
  }

  makeTree = async () => {
    this.levels.unshift(this.leaves)
    while (this.levels[0].length > 1) {
      this.levels.unshift(await calcNextLevel(this.levels[0]))
    }
  }

  getMerkleRoot = () => this.levels[0][0]

  // todo: getProof & validateProof and add tests
}

async function calcNextLevel(topLevel) {
  const nodes = []
  const topLevelCount = topLevel.length
  for (let x = 0; x < topLevelCount; x += 2) {
    if (x + 1 <= topLevelCount - 1) { // concatenate and hash the pair, add to the next level array
      nodes.push(await hash(Buffer.concat([topLevel[x], topLevel[x + 1]])))
    } else { // this is an odd ending node, promote up to the next level by itself
      nodes.push(topLevel[x])
    }
  }
  return nodes
}
