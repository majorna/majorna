import assert from './assert'
import PeerNetwork from './PeerNetwork'

// todo: emulate all things a normal peer network would do and all class methods, mock out server

export default {
  'init': () => new Promise((resolve, reject) => {
    const getMockServer = id => ({
      id,
      peers: {
        signal: (connId, data) => {
          assert(id === 1 || id === 2)
          this.id === 1 && peerNetwork2.onServerSignal(connId, 2, data)
          this.id === 2 && peerNetwork1.onServerSignal(connId, 1, data)
        }
      }
    })
    const peerNetwork1 = new PeerNetwork(getMockServer(1))
    const peerNetwork2 = new PeerNetwork(getMockServer(2))

    peerNetwork1.initPeer()

    peerNetwork1 ? resolve() : reject(`malformed peer network: ${peerNetwork1}`)
  })
}
