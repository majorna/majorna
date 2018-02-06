import React, { Component } from 'react'

export default class extends Component {
  state = {
    receiver: '',
    amount: 0
  }

  handleReceiver = e => this.setState({receiver: e.target.value})
  handleAmount = e => {
    // cannot send more than account
    let amount = e.target.value
    if (amount > this.props.userDoc.balance) {
      amount = this.props.userDoc.balance
    }
    this.setState({amount})
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

        <button className="button is-info m-t-l">Send</button>
      </div>
    )
  }
}