import Peer from 'simple-peer'

export default {
  'webrtc single peer': () => new Promise((resolve, reject) => {
    Peer.config.iceServers.push({urls: 'turn:numb.viagenie.ca', username: 'peer2peer@pokemail.net', credential: 'peer2peer'})

    const peer1 = new Peer({initiator: true, trickle: false})
    const peer2 = new Peer({trickle: false})

    peer1.on('error', e => reject(e))
    peer2.on('error', e => reject(e))

    peer1.on('signal', data => peer2.signal(data))
    peer2.on('signal', data => peer1.signal(data))

    peer2.on('data', data => {
      peer1.destroy()
      peer2.destroy()
      data.toString() === 'peer1msg' ? resolve() : reject(`got unexpected message from peer 1: ${data}`)
    })

    peer1.on('connect', () => peer1.send('peer1msg'))
  }),

  'webrtc mesh network': () => {
    // // create mesh channels
    // const peer1toPeer2 = new Peer({initiator: true, trickle: false})
    // const peer1toPeer3 = new Peer({initiator: true, trickle: false})
    //
    // const peer2toPeer1 = new Peer()
    // const peer2toPeer3 = new Peer({initiator: true, trickle: false})
    //
    // const peer3toPeer1 = new Peer()
    // const peer3toPeer2 = new Peer()
    //
    // // handle init signals
    // peer1toPeer2.on('signal', data => peer2toPeer1.signal(data))
    // peer1toPeer3.on('signal', data => peer3toPeer1.signal(data))
    //
    // peer2toPeer1.on('signal', data => peer1toPeer2.signal(data))
    // peer2toPeer3.on('signal', data => peer3toPeer2.signal(data))
    //
    // peer3toPeer1.on('signal', data => peer1toPeer3.signal(data))
    // peer3toPeer2.on('signal', data => peer2toPeer3.signal(data))
    //
    // // handle incoming data
    // peer1toPeer2.on('data', data => console.log('peer 1 got message from peer 2: ', data))
    //
    // // handle connect events
    // peer2toPeer1.on('connect', () => peer2toPeer1.send('hello peer 1'))
  }
}
