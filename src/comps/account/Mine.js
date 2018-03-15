import React, { Component } from 'react'
import { fm, fn } from '../../data/utils'
import server from '../../data/server'
import { mineBlock, stopMining } from '../../data/node'

export default class extends Component {
  state = {
    blockHeader: {},
    nonce: 0,
    reward: 0,
    minedBlocks: 0,
    hashRate: 0,
    time: 0,
    targetDifficulty: 0,
    previousDifficulty: 0,
    blockNo: 0,
    showDetails: false
  }

  componentWillReceiveProps = async nextProps => {
    // if someone else finds a proper nonce first, don't waste time working on a stale block/difficulty
    if (nextProps.lastBlock &&
      (nextProps.lastBlock.no > this.state.blockHeader.no || nextProps.lastBlock.difficulty > this.state.previousDifficulty)) {
      console.log('someone else found the nonce first for this block/difficulty so skipping')
      this.componentWillUnmount()
      await this.componentDidMount()
    }
  }

  componentDidMount = async () => {
    this.runMinerLoop = true

    while (this.runMinerLoop) {
      // call server and get last block header
      const blockRes = await server.blocks.get()
      const mineableBlock = await blockRes.json()
      this.setState({
        blockHeader: mineableBlock.headerObject,
        blockNo: mineableBlock.no,
        reward: mineableBlock.reward,
        targetDifficulty: mineableBlock.targetDifficulty,
        previousDifficulty: mineableBlock.previousDifficulty
      })

      // start mining that block
      await mineBlock(
        mineableBlock.headerString,
        mineableBlock.targetDifficulty,
        mineableBlock.headerObject.nonce,
        s => this.setState(s), // progress update
        async nonce => { // mined a block
          await server.blocks.create(this.state.blockNo, nonce) // todo: ignore errors but display error msg
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

  componentWillUnmount = () => {
    this.runMinerLoop = false
    stopMining()
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

      <div className="m-t-m"><strong>Target Difficulty:</strong> {this.state.targetDifficulty}</div>
      <div><strong>Reward for Block:</strong> mj{fm(this.state.reward)}</div>

      <div className="m-t-m"><strong>Mined Blocks:</strong> {this.state.minedBlocks}</div>
      <div><strong>Collected Rewards:</strong> mj{fm(this.state.reward * this.state.minedBlocks)}</div>

      <div className="m-t-m">
        <button className="button is-small" onClick={this.handleShowDetails}>
          {this.state.showDetails ? <i className="far fa-minus-square m-r-s"/> : <i className="far fa-plus-square m-r-s"/>}
          Details
        </button>
      </div>
      {this.state.showDetails &&
        <small className="flex-column">
          <strong className="m-t-m">Current Block</strong>
          <div><strong>No:</strong> {this.state.blockHeader.no}</div>
          <div><strong>Time:</strong> {this.state.blockHeader.time}</div>
          <div><strong>Transaction Count:</strong> {this.state.blockHeader.txCount}</div>
          <div><strong>Previous Difficulty:</strong> {this.state.previousDifficulty}</div>
          <div><strong>Previous Nonce:</strong> {fn(this.state.blockHeader.nonce)}</div>
          <div><strong>Previous Block Hash:</strong> <small>{this.state.blockHeader.prevHash}</small></div>
          <div><strong>Merkle Root:</strong> <small>{this.state.blockHeader.merkleRoot}</small></div>

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
