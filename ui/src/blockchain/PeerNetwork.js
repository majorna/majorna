import { InitiatingPeer } from './Peer'
import server from '../data/server'

export default class PeerNetwork {
  peers = []

  connInitCounter = 0

  initPeer = () => {
    this.connInitCounter++

    const peer = new InitiatingPeer()
    peer.on('error', e => console.error(e))
    peer.on('close', () => {})
    peer.on('signal', data => server.peers.init(this.connInitCounter, data))
    peer.on('connect', () => console.log('peer successfully initialized:', this.connInitCounter, peer))
    peer.on('data', this.onData)

    this.peers.push({connId: this.connInitCounter, peer})
  }

  /**
   * Handle incoming peer data.
   * @param data - A JSON-RPC 2.0 object: https://en.wikipedia.org/wiki/JSON-RPC#Version_2.0
   */
  onData = data => {
    console.log('incoming peer data', data)
    switch (data.method) {
      case 'txs':
        this.onReceiveTxs(data.params)
        break
      case 'blocks':
        this.onReceiveBlocks(data.params)
        break
      default:
        console.error('peer send malformed data:', data)
    }
  }

  onReceiveTxs = txs => {
    // no duplicates
    // no balance below 0
    // valid signatures
  }

  onReceiveBlocks = () => {
    // validate each tx signature unless block is signed by a trusted key
  }
}
