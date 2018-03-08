import React, { Component } from 'react'
import { fm } from '../../data/utils'
import server from '../../data/server'
import { mineBlock, stopMining } from '../../data/node'

export default class extends Component {
  state = {
    blockHeader: {},
    reward: 0,
    minedBlocks: 0,
    hashRate: 0,
    time: 0,
    targetDifficulty: 0,
    blockNo: 0,
    showDetails: false
  }

  runMinerLoop = true

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
        targetDifficulty: mineableBlock.targetDifficulty
      })

      // start mining that block
      await mineBlock(
        mineableBlock.headerString,
        mineableBlock.targetDifficulty,
        s => this.setState(s), // progress update
        async nonce => { // mined a block
          await server.blocks.create(this.state.blockNo, nonce) // todo: ignore errors (except auth) but display error msg
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
      <div><strong>Rate:</strong> {this.state.hashRate} Hash/s</div>

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
          <div><strong>Previous Difficulty:</strong> {this.state.blockHeader.difficulty}</div>
          <div><strong>Previous Nonce:</strong> {this.state.blockHeader.nonce}</div>
          <div><strong>Previous Hash:</strong> <small>{this.state.blockHeader.prevHash}</small></div>
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
