import assert from '../utils/assert'
import config from '../data/config'
import PeerNetwork from './PeerNetwork'

// todo: verify that all peers are closed and removed from array after test
// todo: add a test verifying  peer.on('error'...) actually removes peer connection from peers array

export default {
  'init with mock server': () => new Promise((resolve, reject) => {
    class Peer1Network extends PeerNetwork {
      constructor () {
        super({ // mock server:
          peers: {
            get: () => ({ok: true, json: () => ({userId: 'peer2'})}),
            signal: (userId, signalData) => peerNetwork2.onSignal('peer1', signalData)
          }
        })
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
      }

      onReceiveTxs = (peer, txs) => {
        super.onReceiveTxs(txs)
        peerNetwork1.close()
        peerNetwork2.close()
        txs[0].id === '123ABC' ? resolve() : reject('received unexpected tx ID')
      }
    }

    const peerNetwork1 = new Peer1Network()
    const peerNetwork2 = new Peer2Network()

    peerNetwork1.initPeer().catch(e => reject(e))
  }),

  'init': () => new Promise((resolve, reject) => {
    class PeerNetworkTest extends PeerNetwork {
      onPeerConnect () {
        super.onPeerConnect()
        this.broadcastPing()
      }

      ongPong () {
        super.ongPong()
        resolve()
      }
    }

    const peerNetwork = new PeerNetworkTest()
    peerNetwork.initPeer().then(success => {
      if (!success) {
        resolve()
      } else if (config.app.isTest) {
        reject('there should be no peers to connect in test mode')
      }
    }, err => reject(err))

    peerNetwork.close()
  }),

  'txs': () => {},

  'blocks': () => {}
}
