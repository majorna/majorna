// import assert from './assert'
import PeerNetwork from './PeerNetwork'

// todo: verify that all peers are closed and removed from array after test
// todo: add a test verifying  peer.on('error'...) actually removes peer connection from peers array

export default {
  'init': () => new Promise((resolve, reject) => {
    class Peer1Network extends PeerNetwork {
      constructor () {
        super({ // mock server:
          peers: {
            initPeer: async signalData => {
              peerNetwork2.onSignal('peer1', signalData)
              return {json: () => ({userId: 'peer2'})}
            }
          }
        })
        this.name = 'Peer1Network'
      }

      onPeerConnect = peer => {
        super.onPeerConnect(peer)
        this.broadcastTxs([{id: '123ABC', amount: 250}])
      }
    }

    class Peer2Network extends PeerNetwork {
      constructor () {
        super({ // mock server:
          peers: {
            signal: (userId, signalData) => peerNetwork1.onSignal('peer2', signalData)
          }
        })
        this.name = 'Peer2Network'
      }

      onReceiveTxs = txs => {
        super.onReceiveTxs(txs)
        peerNetwork1.close()
        peerNetwork2.close()
        txs[0].id === '123ABC' ? resolve() : reject()
      }
    }

    const peerNetwork1 = new Peer1Network()
    const peerNetwork2 = new Peer2Network()

    peerNetwork1.initPeer()
  }),

  'txs': () => {},

  'blocks': () => {}
}
