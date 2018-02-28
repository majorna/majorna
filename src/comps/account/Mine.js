import React, { Component } from 'react'
import { fm } from '../../data/utils'
import server from '../../data/server'

export default class extends Component {
  state = {
    reward: 10, // todo: read this from mj/meta
    minedBlocks: 0,
    hashRate: 0,
    time: null
  }

  async componentDidMount() {
    // call server and get last block header
    const res = await server.blocks.mine()
    const miningParams = await res.json()

    // start mining that block
    const start = new Date().getTime()
    const alg = 'SHA-256'
    let nonce = 0
    let lastNonce = 0
    let i, found
    const enc = new TextEncoder('utf-8')
    const strBuffer = enc.encode(miningParams.str)
    const difficulty = miningParams.difficulty
    let nonceBuffer, fullStrArr, hashBuffer, hashArray, base64String

    this.interval = setInterval(() => {
      this.setState({
        hashRate: nonce - lastNonce,
        time: new Date(new Date().getTime() - start)
      })
      lastNonce = nonce
    }, 1000)

    console.log(`starting mining loop with difficulty ${miningParams.difficulty}`)
    while (this.interval) {
      nonce++
      nonceBuffer = enc.encode(nonce.toString())
      fullStrArr = new Uint8Array(nonceBuffer.length + strBuffer.length)
      fullStrArr.set(nonceBuffer)
      fullStrArr.set(strBuffer, nonceBuffer.length)
      // todo: since data to be hashed is so small, async/await cycle takes a lot longer than actual hashing
      // node-forge is about 10x faster here (but needs breaks in the loop with setImmediate not to block the event loop forever)
      // alternatively we can increase the input text size to make async call overhead negligible / or just sha3 or PoS variant
      hashBuffer = await crypto.subtle.digest(alg, fullStrArr.buffer)
      hashArray = new Uint8Array(hashBuffer)
      i = 0
      found = true
      for (;i < difficulty; i++) {
        if (hashArray[i] !== 0) found = false
      }
      if (found) {
        base64String = btoa(String.fromCharCode(...hashArray))
        console.log(`mined block with difficulty: ${difficulty}, nonce: ${nonce}, hash: ${base64String}`)
        break
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval)
    this.interval = null
  }

  handleStop = () => this.props.history.goBack()

  render() {
    return (
      <div className="mj-box flex-column">
        <div className="is-size-5 has-text-centered">Mining mj</div>
        <div className="flex-row center-all spinner m-t-l"/>

        <div><strong>Time:</strong> {this.state.time ? Math.round(this.state.time.getTime() / 1000) : 0}s</div>
        <div><strong>Rate:</strong> {this.state.hashRate} Hash/s</div>
        <div><strong>Reward:</strong> mj{fm(this.state.reward * this.state.minedBlocks)}</div>
        <div><strong>Mined Blocks:</strong> {this.state.minedBlocks}</div>
        <div><strong>Reward per Block:</strong> mj{fm(this.state.reward)}</div>

        <div className="flex-row center-h m-t-l">
          {/*<button className="button" onClick={this.handleBackground}>Background</button>*/}
          <button className="button" onClick={this.handleStop}>Stop</button>
        </div>
      </div>
    )
  }
}
