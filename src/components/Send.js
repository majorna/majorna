import React, { Component } from 'react'
import server from '../data/server'

export default class extends Component {
  state = {
    receiver: '',
    amount: 0,
    error: null,
    sending: false
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

    this.setState({amount: parseInt(amount, 10)})
  }

  handleCancel = () => this.props.history.goBack()

  handleSend = async () => {
    // verify inputs
    let error = !this.state.receiver ? 'Put in a receiver.' :
      this.state.amount <= 0 ? 'Put in the amount to be sent.' :
      null

    this.setState({error})
    if (error) {
      return
    }

    // try to send
    this.setState({sending: true})
    try {
      const res = await server.txs.make(this.state.receiver, this.state.amount)
      if (res.status === 201) {
        this.setState({sending: false})
        this.props.history.goBack()
        return
      }
      error = await res.text()
    } catch (e) {
      error = e
    }

    this.setState({error, sending: false})
  }

  render() {
    // todo: lock cancel/send buttons and show indicator while trying to send request
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

        {this.state.sending ? (
          <div className="flex-row flex-center-all spinner m-t-l"/>
        ) : (
          <div className="flex-row m-t-l">
            <button className="button is-info" onClick={this.handleSend}>Send</button>
            <button className="button m-l-m" onClick={this.handleCancel}>Cancel</button>
          </div>
        )}
      </div>
    )
  }
}