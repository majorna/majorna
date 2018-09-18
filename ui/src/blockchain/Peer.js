import Peer from 'simple-peer'

// keep hardcoded STUN servers and additional TURN server in case all other P2P connection option fails
// Peer.config.iceServers.push({urls: 'turn:numb.viagenie.ca', username: 'peer2peer@pokemail.net', credential: 'peer2peer'})

export class InitiatingPeer extends Peer {
  constructor() {
    super({trickle: false, initiator: true})
  }
}

export class MatchingPeer extends Peer {
  constructor() {
    super({trickle: false})
  }
}
