import React, { Component } from 'react'
import { fm } from '../../data/utils'

export default class extends Component {
  state = {
    progress: 0,
    reward: 10, // todo: read this from mj/meta
    minedBlocks: 0
  }

  async componentDidMount() {
    // call server and get last block header to start mining that block
  }

  handleStop = () => this.props.history.goBack()

  render() {
    return (
      <div className="mj-box flex-column">
        <div className="is-size-5 has-text-centered">Mining mj</div>

        <div><strong>Progress:</strong> {this.state.progress}%</div>
        <progress className="progress is-large is-info" value={this.state.progress} max="100"/>

        <div><strong>Earnings:</strong> mj{fm(this.state.reward * this.state.minedBlocks)}</div>
        <div><strong>Mined Blocks:</strong> {this.state.minedBlocks}</div>
        <div><strong>Reward per Block:</strong> mj{fm(this.state.reward)}</div>

        <div className="flex-row center-h m-t-l">
          <button className="button" onClick={this.handleStop}>Stop</button>
        </div>
      </div>
    )
  }
}
