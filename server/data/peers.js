const miners = [] // todo: purge offline miners before interacting with this array (heroku restart does the business once a day, for the moment)

/**
 * Adds a miner to the miner map. If the miner exists on the map, the coordinates are updated.
 * Returns list of miners with lat & lon properties.
 */
exports.addMiner = (id, lat, lon) => {
  const lastOnline = new Date()
  const miner = miners.find(m => m.id === id)
  if (miner) {
    miner.lat = lat
    miner.lon = lon
    miner.lastOnline = lastOnline
  } else {
    miners.push({ id, lat, lon, lastOnline: lastOnline })
  }

  return miners.map(m => ({ lat: m.lat, lon: m.lon }))
}

exports.initPeer = signalData => {
  // todo: how to clear notification: [...] data from receiving end after use (user calls it from client side after notification is handled?)
  // todo: return signalData from a matching peer or send back a notification with 'onInitPeerResponse'?
}
