const utils = require('../utils/utils')
const db = require('../data/db')

const peers = [] // todo: purge offline peers before interacting with this array (Heroku restart does the business once a day, for the moment)

peers.schema = {
  id: 'peer1',
  lat: 1.1234,
  lon: 1.1234,
  lastOnline: new Date()
}

/**
 * Adds a peer to the peer map. If the peer exists on the map, the coordinates are updated.
 * Returns list of peers with lat & lon properties.
 */
exports.addPeer = (id, lat, lon) => {
  const lastOnline = new Date()
  const peer = peers.find(m => m.id === id)
  if (peer) {
    peer.lat = lat
    peer.lon = lon
    peer.lastOnline = lastOnline
  } else {
    peers.push({ id, lat, lon, lastOnline: lastOnline })
  }

  return peers.map(m => ({ lat: m.lat, lon: m.lon }))
}

/**
 * Removes all peers form the peers list.
 */
exports.purgePeers = () => { peers.length = 0 }

/**
 * Finds and returns the ID of a suitable peer.
 * @param uid - ID of the user that is calling this function.
 */
exports.getPeer = uid => {
  // get a random peer from list, excluding the initializing user itself
  const filteredPeers = peers.filter(m => m.id !== uid)
  if (!filteredPeers.length) {
    throw new utils.UserVisibleError('no available peers', 500)
  }
  const peer = filteredPeers[utils.getRandomInt(0, filteredPeers.length - 1)]
  if (!peer) {
    throw new utils.UserVisibleError(`no suitable peers available at the moment`, 500)
  }

  return { userId: peer.id }
}

/**
 * Delivers given WebRTC signal data to desired peer, asynchronously.
 */
exports.signal = async (fromId, toId, signalData) => {
  // see if the target peer is still online
  const peer = peers.find(m => m.id === toId)
  if (!peer) {
    throw new utils.UserVisibleError(`peer with ID: ${toId} is unavailable`, 500)
  }
  await db.addNotification(toId, { type: 'webRTCSignal', data: { userId: fromId, signalData } })
}
