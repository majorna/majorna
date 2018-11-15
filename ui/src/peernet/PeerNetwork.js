import { InitiatingPeer, MatchingPeer } from './Peer'
import server from '../data/server'

export default class PeerNetwork {
  constructor (userDocRef, customServer) {
    this.server = customServer || server

    // receive signals from firestore via userDoc.notifications
    this.webRTCSignalNotification = null
    userDocRef && userDocRef.onSnapshot(docRef => {
      const userDoc = docRef.data()
      if (!userDoc.notifications || !userDoc.notifications.length) {
        this.webRTCSignalNotification = {data: {sdp: 'no initial signal notification found'}}
        return
      }

      const newNotification = userDoc.notifications[0]
      if (newNotification.type !== 'webRTCSignal') {
        return
      }

      if (!this.webRTCSignalNotification) {
        // store any stale notification and move on
        this.webRTCSignalNotification = newNotification
        server.notifications.clear().catch(e => console.error(e))
      } else if (this.webRTCSignalNotification.data.sdp !== newNotification.data.sdp) {
        this.onSignal(newNotification.data.userId, newNotification.data.signalData)
        this.webRTCSignalNotification = newNotification
        server.notifications.clear().catch(e => console.error(e))
      }
    })
  }

  /**
   * Array of connected, connecting, and possibly disconnected peers (though they are removed from the array as soon as possible).
   */
  peers = []

  /**
   * Call this to initiate a connection to a suitable peer (if any).
   */
  async initPeer () {
    const initRes = await this.server.peers.get()
    if (!initRes.ok) {
      const errRes = await initRes.text()
      if (errRes === 'no available peers') {
        return false
      }
      throw new Error(errRes)
    }
    const initData = await initRes.json()

    const peer = new InitiatingPeer(initData.userId)
    this._attachCommonPeerEventHandlers(peer)

    this.peers.push(peer)

    return true
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
    peer.on('data', data => this.onData(peer, data))
  }

  _removePeer (peer) {
    this.peers.splice(this.peers.indexOf(peer), 1)
  }

  /**
   * When a WebRTC connection is successfully established with a peer.
   * @param peer - Connected peer object.
   */
  onPeerConnect (peer) {}

  /**
   * Handle incoming peer data.
   * @param peer - Peer that sent this data.
   * @param data - A JSON-RPC 2.0 object: https://en.wikipedia.org/wiki/JSON-RPC#Version_2.0
   */
  onData (peer, data) {
    data = JSON.parse(data)
    switch (data.method) {
      case 'ping':
        peer.send({method: 'pong'})
        break
      case 'pong':
        this.ongPong(peer)
        break
      case 'txs':
        this.onReceiveTxs(peer, data.params)
        break
      case 'blocks':
        this.onReceiveBlocks(peer, data.params)
        break
      default:
        console.error('peer sent malformed data:', data)
    }
  }

  onReceiveTxs (peer, txs) {
    // no duplicates
    // no balance below 0
    // valid signatures
    // console.log('received txs from peer:', txs)
  }

  onReceiveBlocks (peer, blocks) {
    // validate each tx signature unless block is signed by a trusted key
    // console.log('received blocks from peer:', blocks)
  }

  ongPong (peer) {}

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

  broadcastPing () {
    this._broadcast({method: 'ping'})
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
