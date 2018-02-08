import React, { Component } from 'react'
import server from '../../data/server'
import { fm } from '../../data/utils'

export default class extends Component {
  state = {
    receiver: '',
    amount: 0,
    receiverName: null,
    error: null,
    step: 'start',
    sending: false
  }

  handleReceiver = async e => {
    const receiverId = e.target.value
    this.setState({receiver: receiverId})

    // get receiver name if exists
    let receiverName
    if (receiverId) {
      try {
        const res = await server.users.get(receiverId)
        if (res.status === 200) {
          const user = await res.json()
          receiverName = user.name
        }
      } catch (e) { console.error(e) }
    }
    this.setState({receiverName})
  }

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

    this.setState({step: 'confirm'})
  }

  handleConfirm = async () => {
    // try to send
    let error
    this.setState({error, sending: true})
    try {
      const res = await server.txs.make(this.state.receiver, this.state.amount)
      if (res.status === 201) {
        this.setState({error, sending: false, step: 'complete'})
        return
      }
      error = await res.text()
    } catch (e) {
      error = e
    }

    this.setState({error, sending: false})
  }

  render() {
    // todo: allow amount input be empty string or it is really annoying to put in single digit amounts like "5" (which becomes "05")
    // todo: improve server errors (i.e. receiver does not exist)
    // todo: cleanup state code & error handling code
    // todo: receiver box can be a search box (for account no or email or maybe event name)
    // todo: show receiver details (acct no, name) upon receiver input
    // todo: ask to authenticate again before sending (10 min cooldown)

    if (this.state.step === 'confirm') {
      return (
        <div className="mj-box flex-column">
          <div className="is-size-5 has-text-centered">Confirm Send</div>

          <div><strong>Receiver:</strong> {this.state.receiver}</div>

          <div><strong className="m-t-m">Amount:</strong> mj{fm(this.state.amount)}</div>

          {this.state.error && <strong className="has-text-danger has-text-centered m-t-l">{this.state.error}</strong>}

          {this.state.sending ? (
            <div className="flex-row center-all spinner m-t-l"/>
          ) : (
            <div className="flex-row m-t-l">
              <button className="button is-info" onClick={this.handleConfirm}>Confirm</button>
              <button className="button m-l-m" onClick={this.handleCancel}>Cancel</button>
            </div>
          )}
        </div>
      )
    }

    if (this.state.step === 'complete') {
      return (
        <div className="mj-box flex-column">
          <div className="is-size-5 has-text-centered has-text-info">Successfully Sent</div>

          <div className="flex-row center-h m-t-l">
            <button className="button" onClick={this.handleCancel}>Close</button>
          </div>
        </div>
      )
    }

    return (
      <div className="mj-box flex-column">
        <div className="is-size-5 has-text-centered">Send mj</div>

        <strong>Receiver</strong>
        <input className="input" type="text" value={this.state.receiver} onChange={this.handleReceiver}/>
        {this.state.receiverName && <strong className="has-text-info">Name: {this.state.receiverName}</strong>}

        <strong className="m-t-m">Amount</strong>
        <input className="input" type="number" value={this.state.amount} onChange={this.handleAmount}/>

        {this.state.error && <strong className="has-text-danger has-text-centered m-t-l">{this.state.error}</strong>}

        <div className="flex-row m-t-l">
          <button className="button is-info" onClick={this.handleSend}>Send</button>
          <button className="button m-l-m" onClick={this.handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }
}