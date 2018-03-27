import React, { Component } from 'react'
import { fm, fn } from '../../data/utils'
import server from '../../data/server'
import { mineBlock, stopMining } from '../../data/node'

export default class extends Component {
  state = {
    // firestore doc
    blockInfo: {
      header: {},
      miner: {}
    },

    // current mining info
    nonce: 0,
    time: 0,
    minedBlocks: 0,
    hashRate: 0,

    // ui state
    showDetails: false
  }

  startMinerLoop = async blockInfo => {
    // start mining loop
    this.hashing = false
    this.runMinerLoop = true

    while (this.runMinerLoop) {
      this.hashing = true
      await mineBlock(
        blockInfo.miner.headerStrWithoutNonce,
        blockInfo.miner.targetDifficulty,
        blockInfo.header.nonce,
        s => this.setState(s), // progress update
        async nonce => { // mined a block
          this.hashing = false
          await server.blocks.create(nonce) // todo: ignore errors but display error msg
          this.setState((preState, props) => ({
            minedBlocks: (preState.minedBlocks + 1),
            hashRate: 0,
            time: 0,
            targetDifficulty: 0
          }))
        })
    }

    console.log('stopped miner loop')
  }

  stopMinerLoop = () => {
    this.runMinerLoop = false
    stopMining()
  }

  componentDidMount = async () => {
    // start network requests
    this.fbUnsubBlockInfoMetaDocSnapshot = this.props.db.collection('meta').doc('blockInfo').onSnapshot(async doc => {
      const blockInfoSnap = doc.data()

      // if someone else finds the nonce first, don't waste time working on a stale block/difficulty
      if (this.hashing && this.state.blockInfo.miner.targetDifficulty
        && blockInfoSnap.miner.headerStrWithoutNonce !== this.state.blockInfo.miner.headerStrWithoutNonce) {
        console.log('block was mined by someone else or is old so restarting miner')
        this.stopMinerLoop()
        await this.startMinerLoop(blockInfoSnap)
        return
      }

      // start mining
      this.setState({blockInfo: blockInfoSnap})
      await this.startMinerLoop(blockInfoSnap)
    })
  }

  componentWillUnmount = () => {
    this.fbUnsubBlockInfoMetaDocSnapshot()
    this.stopMinerLoop()
  }

  handleStop = () => this.props.history.goBack()

  handleShowDetails = () => this.setState(prevState => ({showDetails: !prevState.showDetails}))

  render = () =>
    <div className="mj-box flex-column">
      <div className="is-size-5 has-text-centered">Mining mj</div>
      <div className="flex-row center-all spinner m-t-l"/>

      <div><strong>Time:</strong> {this.state.time}s</div>
      <div><strong>Rate:</strong> {fn(this.state.hashRate)} Hash/s</div>
      <div><strong>Nonce:</strong> {fn(this.state.nonce)}</div>

      <div className="m-t-m"><strong>Target Difficulty:</strong> {this.state.blockInfo.miner.targetDifficulty}</div>
      <div><strong>Reward for Block:</strong> mj{fm(this.state.blockInfo.miner.reward)}</div>

      <div className="m-t-m"><strong>Mined Blocks:</strong> {this.state.minedBlocks}</div>
      <div><strong>Collected Rewards:</strong> mj{fm(this.state.blockInfo.miner.reward * this.state.minedBlocks)}</div>

      <div className="m-t-m">
        <button className="button is-small" onClick={this.handleShowDetails}>
          {this.state.showDetails ? <i className="far fa-minus-square m-r-s"/> : <i className="far fa-plus-square m-r-s"/>}
          Details
        </button>
      </div>
      {this.state.showDetails &&
        <small className="flex-column">
          <strong className="m-t-m">Current Block</strong>
          <div><strong>No:</strong> {this.state.blockInfo.header.no}</div>
          <div><strong>Time:</strong> {this.state.blockInfo.header.time}</div>
          <div><strong>Transaction Count:</strong> {this.state.blockInfo.header.txCount}</div>
          <div><strong>Previous Difficulty:</strong> {this.state.blockInfo.header.difficulty}</div>
          <div><strong>Previous Nonce:</strong> {fn(this.state.blockInfo.header.nonce)}</div>
          <div><strong>Previous Block Hash:</strong> <small>{this.state.blockInfo.header.prevHash}</small></div>
          <div><strong>Merkle Root:</strong> <small>{this.state.blockInfo.header.merkleRoot}</small></div>

          {/*<strong className="m-t-m">Peers</strong>*/}
          {/*<div><strong>Online Peers:</strong> ?</div>*/}
          {/*<div><strong>Global Hash Rate:</strong> ?</div>*/}

          {/*<div><strong>Expected Reward (per hour):</strong> ?</div>*/}
        </small>
      }

      <div className="flex-row center-h m-t-l">
        <button className="button" onClick={this.handleStop}>Stop</button>
      </div>
    </div>
}
