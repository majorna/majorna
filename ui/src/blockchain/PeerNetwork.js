import { InitiatingPeer } from './Peer'

export default class PeerNetwork {
  peers = []

  initPeer = () => {
    const peer = new InitiatingPeer()
    peer.on('error', e => console.error(e))
    peer.on('close', () => {})
    peer.on('signal', data => server.initPeer(data))
    peer.on('connect', () => console.log('peer successfully initialized:', peer))
    peer.on('data', data => console.log(data))
    this.peers.push(peer)
  }

  receiveTxs = () => {
    // no duplicates
    // no balance below 0
    // valid signatures
  }

  receiveBlock = () => {
    // validate each tx signature unless block is signed by a trusted key
  }

  initPeerConns = () => {
  }
}
