import React, { Component } from 'react'
import { fm } from '../../data/utils'

export default class extends Component {
  state = {
    progress: 0,
    reward: 10, // todo: read this from mj/meta
    minedBlocks: 0
  }

  async componentDidMount() {
    // get txs for the last 10 minute period and start mining
    const now = new Date() // get time snapshot to prevent drift

    const start = new Date(now.getTime())
    start.setMilliseconds(0)
    start.setSeconds(0)
    start.setMinutes(now.getMinutes() - now.getMinutes() % 10)

    const end = new Date(now.getTime())
    end.setMilliseconds(0)
    end.setSeconds(0)
    end.setMinutes(now.getMinutes() - 10 - now.getMinutes() % 10)

    console.log(`starting to mine block for txs between [${start}] and [${end}]`)
    const txsSnap = await this.props.db.collection('txs').where('time', '>=', start).where('time', '<', end).get()
    const txs = txsSnap.docs.map(doc => doc.data())

    console.log(txs)
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
