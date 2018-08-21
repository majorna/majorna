import assert from './assert'
import PeerNetwork from './PeerNetwork'

// todo: emulate all things a normal peer network would do and all class methods, mock out server

export default {
  'init': () => new Promise((resolve, reject) => {
    const getMockServer = id => ({
      peers: {
        initPeer: (localConnId, data) => {
          assert(id === 1)
          peerNetwork2.onInitPeer(id, data)
        },
        signal: (userId, data) => {
          assert(id === 2)
          peerNetwork1.onInitPeerResponse(1, userId, data)
        }
      }
    })

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

    const peerNetwork1 = new MockInitiatingPeerNetwork(getMockServer(1))
    const peerNetwork2 = new MockMatchingPeerNetwork(getMockServer(2))

    peerNetwork1.initPeer()
  })
}
