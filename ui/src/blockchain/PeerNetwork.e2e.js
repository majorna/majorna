import PeerNetwork from './PeerNetwork'

// todo: emulate all things a normal peer network would do and all class methods, mock out server

export default {
  'init': () => new Promise((resolve, reject) => {
    const mockServer = {
      peers: {
        signal: () => {}
      }
    }
    const peerNetwork = new PeerNetwork(mockServer)
    peerNetwork ? resolve() : reject(`malformed peer network: ${peerNetwork}`)
  })
}
