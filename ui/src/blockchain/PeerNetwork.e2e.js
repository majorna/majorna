import assert from './assert'
import PeerNetwork from './PeerNetwork'

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
        this.broadcast({method: 'txs', params: [{id: '123ABC'}]})
      }
    }

    class MockMatchingPeerNetwork extends PeerNetwork {
      onReceiveTxs = txs => {
        super.onReceiveTxs(txs)
        peerNetwork1.close()
        peerNetwork2.close()
        txs[0].id === '123ABC' ? resolve() : reject()
      }
    }

    const peerNetwork1 = new MockInitiatingPeerNetwork(getMockServer(1))
    const peerNetwork2 = new MockMatchingPeerNetwork(getMockServer(2))

    peerNetwork1.initPeer()
  }),

  'txs': () => {},

  'blocks': () => {}
}
