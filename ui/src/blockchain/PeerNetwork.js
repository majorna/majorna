import { InitiatingPeer } from './Peer'
import server from '../data/server'

export default class PeerNetwork {
  peers = []

  initPeer = () => {
    const peer = new InitiatingPeer()
    peer.on('error', e => console.error(e))
    peer.on('close', () => {})
    peer.on('signal', data => server.peers.init(this.peers.length + 1, data))
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
