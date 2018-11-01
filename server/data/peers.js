const utils = require('./utils')
const db = require('./db')

// peer.js is in /data directory since it contains miners list, which might become persistent in the future
const miners = [] // todo: purge offline miners before interacting with this array (Heroku restart does the business once a day, for the moment)

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
 * Finds and returns the ID of a suitable peer.
 * @param uid - ID of the user that is calling this function.
 */
exports.initPeer = uid => {
  // get a random miner from list, excluding the initializing user itself
  const filteredMiners = miners.filter(m => m.id !== uid)
  if (!filteredMiners.length) {
    throw new utils.UserVisibleError('no available miners', 500)
  }
  const miner = filteredMiners[utils.getRandomInt(0, filteredMiners.length - 1)]
  if (!miner) {
    throw new utils.UserVisibleError(`no suitable peers available at the moment`, 500)
  }

  return { userId: miner.id }
}

/**
 * Delivers given WebRTC signal data to desired peer, asynchronously.
 */
exports.signal = async (fromId, toId, signalData) => {
  // see if the target miner is still online
  const miner = miners.find(m => m.id === toId)
  if (!miner) {
    throw new utils.UserVisibleError(`miner with ID: ${toId} is unavailable`, 500)
  }
  await db.addNotification(toId, { type: 'webRTCSignal', data: { userId: fromId, signalData } })
}
