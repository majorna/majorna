import PeerNetwork from './PeerNetwork'

export default {
  'webrtc single peer': () => new Promise((resolve, reject) => {
    const peerNetwork = new PeerNetwork()
    peerNetwork ? resolve() : reject(`malformed peer network: ${peerNetwork}`)
  })
}
