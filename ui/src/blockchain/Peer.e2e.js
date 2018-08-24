import { InitiatingPeer, MatchingPeer } from './Peer'

export default {
  'webrtc single peer': () => new Promise((resolve, reject) => {
    const peer1 = new InitiatingPeer()
    const peer2 = new MatchingPeer()

    peer1.on('error', e => reject(e))
    peer2.on('error', e => reject(e))

    peer1.on('signal', data => peer2.signal(data))
    peer2.on('signal', data => peer1.signal(data))

    peer1.on('connect', () => peer1.send('hello peer 2'))

    peer2.on('data', data => {
      peer1.destroy()
      peer2.destroy()
      data.toString() === 'hello peer 2' ? resolve() : reject(`got unexpected message from peer 1: ${data}`)
    })
  }),

  'webrtc mesh network': () => new Promise((resolve, reject) => {
    // create mesh channels
    const peer1toPeer2 = new InitiatingPeer()
    const peer1toPeer3 = new InitiatingPeer()

    const peer2toPeer1 = new MatchingPeer()
    const peer2toPeer3 = new InitiatingPeer()

    const peer3toPeer1 = new MatchingPeer()
    const peer3toPeer2 = new MatchingPeer()

    // success checks
    let peer1Success, peer2Success, peer3Success
    const checkResolve = () => {
      if (peer1Success && peer2Success && peer3Success) {
        peer1toPeer2.destroy()
        peer1toPeer3.destroy()
        peer2toPeer1.destroy()
        peer2toPeer3.destroy()
        peer3toPeer1.destroy()
        peer3toPeer2.destroy()
        resolve()
      }
    }

    // handle errors
    peer1toPeer2.on('error', e => reject(e))
    peer1toPeer3.on('error', e => reject(e))

    peer2toPeer1.on('error', e => reject(e))
    peer2toPeer3.on('error', e => reject(e))

    peer3toPeer1.on('error', e => reject(e))
    peer3toPeer2.on('error', e => reject(e))

    // handle init signals
    peer1toPeer2.on('signal', data => peer2toPeer1.signal(data))
    peer1toPeer3.on('signal', data => peer3toPeer1.signal(data))

    peer2toPeer1.on('signal', data => peer1toPeer2.signal(data))
    peer2toPeer3.on('signal', data => peer3toPeer2.signal(data))

    peer3toPeer1.on('signal', data => peer1toPeer3.signal(data))
    peer3toPeer2.on('signal', data => peer2toPeer3.signal(data))

    // handle connect events
    peer1toPeer2.on('connect', () => peer1toPeer2.send('hello peer 2'))
    peer2toPeer3.on('connect', () => peer2toPeer3.send('hello peer 3'))
    peer3toPeer1.on('connect', () => peer3toPeer1.send('hello peer 1'))

    // handle incoming data
    peer2toPeer1.on('data', data => data.toString() === 'hello peer 2'
      ? checkResolve(peer1Success = true)
      : reject(`got unexpected message from peer 1: ${data}`))
    peer3toPeer2.on('data', data => data.toString() === 'hello peer 3'
      ? checkResolve(peer2Success = true)
      : reject(`got unexpected message from peer 2: ${data}`))
    peer1toPeer3.on('data', data => data.toString() === 'hello peer 1'
      ? checkResolve(peer3Success = true)
      : reject(`got unexpected message from peer 3: ${data}`))
  })
}
