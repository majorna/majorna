import React, { Component } from 'react'
import { fm } from '../../data/utils'
import server from '../../data/server'
import { mineBlock, stopMining } from '../../data/node'

export default class extends Component {
  state = {
    reward: 10, // todo: read this from mj/meta
    minedBlocks: 0,
    hashRate: 0,
    time: null
  }

  componentDidMount = async () => {
    // call server and get last block header
    const res = await server.blocks.mine()
    const miningParams = await res.json()

    // start mining that block
    await mineBlock(miningParams.str, miningParams.difficulty, s => this.setState(s))
  }

  componentWillUnmount = () => stopMining()

  handleStop = () => this.props.history.goBack()

  render = () =>
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
}
