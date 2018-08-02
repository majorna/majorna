import Peer from 'simple-peer'

Peer.config.iceServers.push({urls: 'turn:numb.viagenie.ca', username: 'peer2peer@pokemail.net', credential: 'peer2peer'})

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