import assert from './assert'
import PeerNetwork from './PeerNetwork'

export default {
  // todo: verify that all peers are closed and removed from array after test

  // todo: add a test verifying  peer.on('error'...) actually removes peer connection from peers array

  'init': () => new Promise((resolve, reject) => {
    let matchingSignalReceivedFn
    const matchingSignalPromise = new Promise((resolve, reject) => { matchingSignalReceivedFn = resolve})

    class MockInitiatingPeerNetwork extends PeerNetwork {
      constructor () {
        super({
          peers: {
            initPeer: async signalData => {
              peerNetwork2.onInitPeer(userId, signalData)
              return matchingSignalPromise
            }
          }
        })
      }

      onPeerConnect = peer => {
        super.onPeerConnect(peer)
        this.broadcastTxs([{id: '123ABC', amount: 250}])
      }
    }

    class MockMatchingPeerNetwork extends PeerNetwork {
      constructor () {
        super({
          peers: {
            signal: (userId, signalData) => matchingSignalReceivedFn(userId, signalData)
          }
        })
      }

      onReceiveTxs = txs => {
        super.onReceiveTxs(txs)
        peerNetwork1.close()
        peerNetwork2.close()
        txs[0].id === '123ABC' ? resolve() : reject()
      }
    }

    const peerNetwork1 = new MockInitiatingPeerNetwork()
    const peerNetwork2 = new MockMatchingPeerNetwork()

    peerNetwork1.initPeer()
  }),

  'txs': () => {},

  'blocks': () => {}
}
