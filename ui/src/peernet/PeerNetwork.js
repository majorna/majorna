import { InitiatingPeer, MatchingPeer } from './Peer'
import server from '../data/server'

export default class PeerNetwork {
  constructor (customServer) {
    this.server = customServer || server
  }

  /**
   * Array of connected, connecting, and possibly disconnected peers (though they are removed from the array as soon as possible).
   */
  peers = []

  /**
   * Call this to ask the server to give us the ID of a suitable peer to initiate a connection to.
   */
  async initPeer () {
    const initRes = await this.server.peers.initPeer()
    const initData = await initRes.json()

    const peer = new InitiatingPeer(initData.userId)
    this._attachCommonPeerEventHandlers(peer)

    this.peers.push(peer)
  }

  /**
   * When a peer produces a signal data and server delivers it to us.
   */
  onSignal (userId, signalData) {
    const peer = this.peers.find(p => p.userId === userId)
    if (peer) {
      peer.signal(signalData)
    } else {
      const peer = new MatchingPeer(userId)
      this._attachCommonPeerEventHandlers(peer)
      peer.signal(signalData)
      this.peers.push(peer)
    }
  }

  _attachCommonPeerEventHandlers (peer) {
    peer.on('signal', signalData => this.server.peers.signal(peer.userId, signalData))
    peer.on('error', e => {
      console.error('peer connection error:', e)
      this._removePeer(peer)
    })
    peer.on('close', () => this._removePeer(peer))
    peer.on('connect', () => this.onPeerConnect(peer))
    peer.on('data', data => this.onData(data))
  }

  _removePeer (peer) {
    this.peers.splice(this.peers.indexOf(peer), 1)
  }

  /**
   * When a WebRTC connection is successfully established with a peer.
   * @param peer - Connected peer object.
   */
  onPeerConnect (peer) {
  }

  /**
   * Handle incoming peer data.
   * @param data - A JSON-RPC 2.0 object: https://en.wikipedia.org/wiki/JSON-RPC#Version_2.0
   */
  onData (data) {
    data = JSON.parse(data)
    switch (data.method) {
      case 'txs':
        this.onReceiveTxs(data.params)
        break
      case 'blocks':
        this.onReceiveBlocks(data.params)
        break
      default:
        console.error('peer sent malformed data:', data)
    }
  }

  onReceiveTxs (txs) {
    // no duplicates
    // no balance below 0
    // valid signatures
    // console.log('received txs from peer:', txs)
  }

  onReceiveBlocks (blocks) {
    // validate each tx signature unless block is signed by a trusted key
    // console.log('received blocks from peer:', blocks)
  }

  /**
   * Broadcast given transactions to all connected peers.
   * @param txs - Transaction array.
   */
  broadcastTxs (txs) {
    this._broadcast({method: 'txs', params: txs})
  }

  /**
   * Broadcast given blocks to all connected peers.
   * @param blocks - Block array.
   */
  broadcastBlocks (blocks) {
    this._broadcast({method: 'blocks', params: blocks})
  }

  /**
   * Broadcast given data to all connected peers.
   * @param data - A JSON-RPC 2.0 object: https://en.wikipedia.org/wiki/JSON-RPC#Version_2.0
   */
  _broadcast (data) {
    data = JSON.stringify(data)
    this.peers.forEach(p => p.send(data))
  }

  /**
   * Closes all peer connections and removes them from peers list.
   */
  close () {
    this.peers.forEach(p => p.destroy())
    this.peers.length = 0
  }
}
