import { InitiatingPeer, MatchingPeer } from './Peer'
import server from '../data/server'

export default class PeerNetwork {
  constructor (customServer) {
    this.server = customServer || server
  }

  peers = [] // {peer, localConnId, userId}

  connInitCounter = 0

  /**
   * Call this to send signaling server initialization data to establish a WebRTC connection to an available peer.
   */
  initPeer () {
    const localConnId = ++this.connInitCounter
    const peer = new InitiatingPeer()

    peer.on('error', e => {
      console.error('peer connection errored:', e)
      this.peers.splice(this.peers.indexOf(peer), 1)
    })
    peer.on('close', () => this.peers.splice(this.peers.indexOf(peer), 1))
    peer.on('signal', data => this.server.peers.initPeer(localConnId, data)) // todo: send signals after connection via already established data channel?
    peer.on('connect', () => this.onPeerConnect(peer))
    peer.on('data', data => this.onData(data))

    this.peers.push({peer, localConnId})
  }

  /**
   * When a connection initialization signal data is delivered to us by the server for a connection that was initialized by us with {initPeer}.
   */
  onInitPeerResponse (localConnId, userId, data) {
    this.peers.find(p => p.localConnId === localConnId).peer.signal(data)
  }

  /**
   * When a peer initializes a connection and server delivers us the details.
   */
  onInitPeer (userId, data) {
    const localConnId = ++this.connInitCounter
    const peer = new MatchingPeer()

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
    this.peers.push({peer, localConnId, userId})
  }

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
   * Broadcast given data to all connected peers
   * @param data - A JSON-RPC 2.0 object: https://en.wikipedia.org/wiki/JSON-RPC#Version_2.0
   */
  broadcast (data) {
    data = JSON.stringify(data)
    this.peers.forEach(p => p.peer.send(data))
  }

  /**
   * Closes all peer connections and removes them from peers list.
   */
  close () {
    this.peers.forEach(p => p.peer.destroy())
    this.peers.length = 0
  }
}
