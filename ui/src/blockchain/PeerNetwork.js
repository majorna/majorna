import { InitiatingPeer, MatchingPeer } from './Peer'
import remoteServer from '../data/server'

export default class PeerNetwork {
  constructor (server) {
    this.server = server || remoteServer
  }

  peers = []

  connInitCounter = 0

  /**
   * Call this to send signaling server initialization data to establish a WebRTC connection to an available peer.
   */
  initPeer = () => {
    this.connInitCounter++
    const peer = new InitiatingPeer()

    peer.on('error', e => {
      console.error('peer connection errored:', e)
      this.peers.splice(this.peers.indexOf(peer), 1)
    })
    peer.on('close', () => {
      console.log('remote peer closed the connection', peer)
      this.peers.splice(this.peers.indexOf(peer), 1)
    })
    peer.on('signal', data => this.server.peers.signal(this.connInitCounter, data))
    peer.on('connect', () => this.onPeerConnect(peer))
    peer.on('data', this.onData)

    this.peers.push({connId: this.connInitCounter, peer})
  }

  /**
   * Broadcast given data to all connected peers
   * @param data - A JSON-RPC 2.0 object: https://en.wikipedia.org/wiki/JSON-RPC#Version_2.0
   */
  broadcast = data => {
    data = JSON.stringify(data)
    this.peers.forEach(p => p.send(data))
  }

  /**
   * When a WebRTC connection initialization signal data is delivered to us by the server.
   */
  onServerSignal = (connId, userId, data) => {
    this.connInitCounter++
    const peer = new MatchingPeer()

    // todo: handle events

    peer.signal(data)
    this.peers.push({connId: this.connInitCounter, data, peer})
  }

  onPeerConnect = peer => {
    console.log('peer successfully initialized:', this.connInitCounter, peer)
  }

  /**
   * Handle incoming peer data.
   * @param data - A JSON-RPC 2.0 object: https://en.wikipedia.org/wiki/JSON-RPC#Version_2.0
   */
  onData = data => {
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

  onReceiveTxs = txs => {
    // no duplicates
    // no balance below 0
    // valid signatures
  }

  onReceiveBlocks = () => {
    // validate each tx signature unless block is signed by a trusted key
  }
}
