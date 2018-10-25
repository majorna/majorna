const utils = require('./utils')
const db = require('./db')

const miners = [] // todo: purge offline miners before interacting with this array (heroku restart does the business once a day, for the moment)

miners.schema = {
  id: 'miner1',
  lat: 1.1234,
  lon: 1.1234,
  lastOnline: new Date()
}

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

/**
 * Initiates a connection to a suitable peer, asynchronously.
 * @param uid - ID of the user that is calling this function.
 * @param signalData - WebRTC signal data produced by the user calling this function.
 */
exports.initPeer = async (uid, signalData) => {
  // get a random miner from list, excluding the initializing user itself
  const filteredMiners = miners.filter(m => m.id !== uid)
  const miner = filteredMiners[utils.getRandomInt(0, filteredMiners.length - 1)]
  await db.addNotification(miner.id, { type: 'webRTCInit', data: { uid, signalData } })
  return {userId: miner.id}
  // todo: return error if no miners
}

exports.signal = (uid, signalData) => {
  // see if miner is still online
}