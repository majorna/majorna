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
    // todo: beautify the form using bulma components
    // todo: render confirm page -or- sent page according to state
    // todo: receiver box can be a search box
    // todo: show receiver details (acct no, name) upon receiver input
    // todo: ask to authenticate again before sending (10 min cooldown)

    return (
      <div className="mj-box flex-column">
        <strong className="has-text-centered">Send mj</strong>

        <strong>Receiver:</strong>
        <input className="input" type="text" value={this.state.receiver} onChange={this.handleReceiver} />

        <strong>Amount:</strong>
        <input className="input" type="number" value={this.state.amount} onChange={this.handleAmount} />

        <button className="button is-info">Send</button>
      </div>
    )
  }
}