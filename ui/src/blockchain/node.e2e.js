import Peer from 'simple-peer'

export default {
  'peer mesh test': async () => {
    // These are peer1's connections to peer2 and peer3
    const peer2 = new Peer({ initiator: true })
    const peer3 = new Peer({ initiator: true })

    peer2.on('signal', function (data) {
      // send this signaling data to peer2 somehow
    })

    peer2.on('connect', function () {
      peer2.send('hi peer2, this is peer1')
    })

    peer2.on('data', function (data) {
      console.log('got a message from peer2: ' + data)
    })

    peer3.on('signal', function (data) {
      // send this signaling data to peer3 somehow
    })

    peer3.on('connect', function () {
      peer3.send('hi peer3, this is peer1')
    })

    peer3.on('data', function (data) {
      console.log('got a message from peer3: ' + data)
    })
  }
}
