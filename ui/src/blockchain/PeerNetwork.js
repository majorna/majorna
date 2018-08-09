import { InitiatingPeer } from './Peer'
import server from '../data/server'

export default class PeerNetwork {
  peers = []

  connCounter = 0

  initPeer = () => {
    this.connCounter++

    const peer = new InitiatingPeer()
    peer.on('error', e => console.error(e))
    peer.on('close', () => {})
    peer.on('signal', data => server.peers.init(this.connCounter, data))
    peer.on('connect', () => console.log('peer successfully initialized:', peer))
    peer.on('data', this.onData)

    this.peers.push({connId: this.connCounter, peer})
  }

  onData = data => console.log(data)

  onReceiveTxs = () => {
    // no duplicates
    // no balance below 0
    // valid signatures
  }

  onReceiveBlocks = () => {
    // validate each tx signature unless block is signed by a trusted key
  }
}
