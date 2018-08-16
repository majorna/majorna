import assert from './assert'
import PeerNetwork from './PeerNetwork'

// todo: emulate all things a normal peer network would do and all class methods, mock out server

export default {
  'init': () => new Promise((resolve, reject) => {
    resolve()
    class MockInitiatingPeerNetwork extends PeerNetwork {
      onPeerConnect = peer => {
        super.onPeerConnect(peer)
        this.broadcast({method: 'txs'})
      }
    }

    class MockMatchingPeerNetwork extends PeerNetwork {
      onReceiveTxs = txs => {
        super.onReceiveTxs()
        resolve()
      }
    }

    const getMockServer = id => ({
      peers: {
        signal: (connId, data) => {
          // todo: matching conn needs to send signal data back
          peerNetwork2.onServerSignal(connId, 2, data)
        }
      }
    })
    const peerNetwork1 = new MockInitiatingPeerNetwork(getMockServer(1))
    const peerNetwork2 = new MockMatchingPeerNetwork(getMockServer(2))

    peerNetwork1.initPeer()
  })
}
