export default class {
  tree = {
    leaves: [], // flat array of ArrayBuffer of item hashes
    levels: []
  }

  addLeaves = async items => {
    for (let i = 0; i < items.length; i++) {
      const itemHash = await crypto.hashTextToBuffer(items[i])
      this.tree.leaves.push(itemHash)
    }
  }

  makeTree = async () => {
    this.tree.levels.unshift(this.tree.leaves)
    while (this.tree.levels[0].length > 1) {
      this.tree.levels.unshift(_calculateNextLevel(doubleHash))
    }
  }

  _calculateNextLevel = () => {
    const nodes = []
    const topLevel = tree.levels[0]
    const topLevelCount = topLevel.length
    for (let x = 0; x < topLevelCount; x += 2) {
      if (x + 1 <= topLevelCount - 1) { // concatenate and hash the pair, add to the next level array, doubleHash if requested
        if (doubleHash) {
          nodes.push(hashFunction(hashFunction(Buffer.concat([topLevel[x], topLevel[x + 1]]))))
        } else {
          nodes.push(hashFunction(Buffer.concat([topLevel[x], topLevel[x + 1]])))
        }
      } else { // this is an odd ending node, promote up to the next level by itself
        nodes.push(topLevel[x])
      }
    }
    return nodes
  }

  getMerkleRoot = () => this.tree.levels[0][0]
}
