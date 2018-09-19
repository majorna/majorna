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
   * Call this to send signaling server initialization data to establish a WebRTC connection to an available peer.
   */
  initPeer () {
    const peer = new InitiatingPeer()

    peer.on('error', e => {
      console.error('peer connection errored:', e)
      this.peers.splice(this.peers.indexOf(peer), 1) // todo: add a test verifying this removal step
    })
    peer.on('close', () => this.peers.splice(this.peers.indexOf(peer), 1))
    peer.on('signal', data => this.server.peers.initPeer(peer._id, data)) // todo: send signals after connection via already established data channel?
    peer.on('connect', () => this.onPeerConnect(peer))
    peer.on('data', data => this.onData(data))

    this.peers.push(peer)
  }

  /**
   * When a connection initialization signal data is delivered to us by the server for a connection that was initialized by us with {initPeer}.
   */
  onInitPeerResponse (localPeerId, userId, data) {
    this.peers.find(p => p._id === localPeerId).signal(data)
  }

  /**
   * When a peer initializes a connection and server delivers us the details.
   */
  onInitPeer (userId, data) {
    const peer = new MatchingPeer(userId)

    // todo: this is duplicated above by InitiatingPeer event handling
    peer.on('error', e => {
      console.error('peer connection errored:', e)
      this.peers.splice(this.peers.indexOf(peer), 1)
    })
    peer.on('close', () => this.peers.splice(this.peers.indexOf(peer), 1))
    peer.on('signal', data => this.server.peers.signal(userId, data))
    peer.on('connect', () => this.onPeerConnect(peer))
    peer.on('data', data => this.onData(data))

    peer.signal(data)
    this.peers.push(peer)
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
  }

  onReceiveBlocks () {
    // validate each tx signature unless block is signed by a trusted key
  }

  /**
   * Closes all peer connections and removes them from peers list.
   */
  close () {
    this.peers.forEach(p => p.destroy())
    this.peers.length = 0
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
}
