import React, { Component } from 'react'

export default class extends Component {
  constructor(props) {
    super(props)
    this.state = {
      receiver: '',
      amount: 0
    }
  }

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

        <button className="button is-info m-r-m">Send</button>
      </div>
    )
  }
}