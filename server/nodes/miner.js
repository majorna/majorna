exports.miners = []

exports.addMiner = (id, lat, lon) => {
  const miner = exports.miners.find(m => m.id === id)
  if (miner) {
    miner.lat = lat
    miner.lon = lon
  } else {
    exports.miners.push({id, lat, lon, seen: new Date()})
  }

  // purge offline miners
}
