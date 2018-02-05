import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class extends Component {
  handleReceiver = e => this.setState({receiver: e.target.value})
  handleAmount = e => this.setState({amount: e.target.value})

  render() {
    return (
      <div className="mj-box flex-column">
        <strong className="has-text-  centered">Send mj</strong>

        <strong>Receiver:</strong>
        <input type="text" value={this.state.receiver} onChange={this.handleReceiver} />

        <strong>Amount:</strong>
        <input type="number" value={this.state.amount} onChange={this.handleAmount} />

        <Link to="/send" className="button is-info m-r-m">Send</Link>
      </div>
    )
  }
}