import React, { Component } from 'react'

export default class extends Component {
  state = {
    receiver: '',
    amount: 0,
    error: null
  }

  handleReceiver = e => this.setState({receiver: e.target.value})

  handleAmount = e => {
    // cannot send more than account
    let amount = e.target.value
    if (amount > this.props.userDoc.balance) {
      amount = this.props.userDoc.balance
    }
    // cannot send negative amount
    if (amount <= 0) {
      amount = 0
    }

    this.setState({amount})
  }

  handleCancel = () => {}

  handleSend = () => {
    let error = !this.state.receiver ? 'Put in a receiver.' :
      this.state.amount <= 0 ? 'Put in the amount to be sent.' :
      null

    this.setState({error})
  }

  render() {
    // todo: cannot send more than account
    // todo: render confirm page -or- sent page according to state
    // todo: receiver box can be a search box (for account no or email or maybe event name)
    // todo: show receiver details (acct no, name) upon receiver input
    // todo: ask to authenticate again before sending (10 min cooldown)

    return (
      <div className="mj-box flex-column">
        <div className="is-size-5 has-text-centered">Send mj</div>

        <strong>Receiver</strong>
        <input className="input" type="text" value={this.state.receiver} onChange={this.handleReceiver}/>

        <strong className="m-t-m">Amount</strong>
        <input className="input" type="number" value={this.state.amount} onChange={this.handleAmount}/>

        {this.state.error && <strong className="has-text-danger has-text-centered m-t-l">{this.state.error}</strong>}

        <div className="flex-row m-t-l">
          <button className="button" onClick={this.handleCancel}>Cancel</button>
          <button className="button is-info m-l-m" onClick={this.handleSend}>Send</button>
        </div>
      </div>
    )
  }
}