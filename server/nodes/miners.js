exports.miners = []

/**
 * Adds a miner to the miner map. If the miner exists on the map, the coordinates are updated.
 */
exports.addMiner = (id, lat, lon) => {
  const miner = exports.miners.find(m => m.id === id)
  if (miner) {
    miner.lat = lat
    miner.lon = lon
  } else {
    exports.miners.push({ id, lat, lon, seen: new Date() })
  }

  // todo: purge offline miners
}
