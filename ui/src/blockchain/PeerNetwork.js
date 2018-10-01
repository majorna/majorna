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
    this._attachCommonPeerEventHandlers(peer)
    peer.on('signal', async signalData => {
      if (!peer.initPeerCalled) {
        // send the first signal data to server to initialize new peer
        peer.initPeerCalled = true
        const initRes = await this.server.peers.initPeer(signalData)
        const initData = await initRes.json()
        peer.userId = initData.userId
        peer.signal(initData.signalData)
      } else {
        // send subsequent signal data (if any) directly to user through server
        await this.server.peers.signal(peer.userId, signalData)
      }
    })
    this.peers.push(peer)
  }

  /**
   * When a peer initializes a connection and server delivers us the details.
   */
  onInitPeer (userId, signalData) {
    const peer = new MatchingPeer(userId)
    this._attachCommonPeerEventHandlers(peer)
    peer.on('signal', signalData => this.server.peers.signal(userId, signalData))
    peer.signal(signalData)
    this.peers.push(peer)
  }

  /**
   * When a peer produces a signal data outside of the initialization sequence.
   * todo: remove this if WebRTC protocol does not allow arbitrary signals outside of init sequence.
   */
  onSignal (userId, signalData) {
    const peer = this.peers.find(p => p.userId === userId)
    peer.signal(signalData)
  }

  _attachCommonPeerEventHandlers (peer) {
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
