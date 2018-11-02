import Peer from 'simple-peer'
import assert from '../utils/assert'

// keep hardcoded STUN servers and additional TURN server in case all other P2P connection option fails
// Peer.config.iceServers.push({urls: 'turn:numb.viagenie.ca', username: 'peer2peer@pokemail.net', credential: 'peer2peer'})

export class InitiatingPeer extends Peer {
  constructor(userId) {
    super({trickle: false, initiator: true})
    assert(userId, 'userId parameter is required')
    this.userId = userId
  }
}

export class MatchingPeer extends Peer {
  constructor(userId) {
    super({trickle: false})
    assert(userId, 'userId parameter is required')
    this.userId = userId
  }
}
