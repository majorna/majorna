import assert from './assert'
import PeerNetwork from './PeerNetwork'

export default {
  // todo: verify that all peers are closed and removed from array after test

  'init': () => new Promise((resolve, reject) => {
    let _localConnId

    const getMockServer = peerId => ({
      peers: {
        initPeer: (localConnId, data) => {
          _localConnId = localConnId
          assert(peerId === 'initiating')
          peerNetwork2.onInitPeer(_localConnId, data)
        },
        signal: (userId, data) => {
          assert(peerId === 'matching')
          peerNetwork1.onInitPeerResponse(_localConnId, userId, data)
        }
      }
    })

    class MockInitiatingPeerNetwork extends PeerNetwork {
      onPeerConnect = peer => {
        super.onPeerConnect(peer)
        this.broadcastTxs([{id: '123ABC', amount: 250}])
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

    const peerNetwork1 = new MockInitiatingPeerNetwork(getMockServer('initiating'))
    const peerNetwork2 = new MockMatchingPeerNetwork(getMockServer('matching'))

    peerNetwork1.initPeer()
  }),

  'txs': () => {},

  'blocks': () => {}
}
