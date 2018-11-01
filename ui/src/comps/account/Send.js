import React, { Component } from 'react'
import server from '../../data/server'
import { fm } from '../../utils/utils'

// todo: 'successfully sent' screen should show tx details
// todo: every character difference in handleReceiver results in a search query and the last one overwrite everything (might be the one with no result)
// todo: improve server errors (i.e. receiver does not exist)
// todo: cleanup state code & error handling code
// todo: receiver box should also allow search by email (maybe not for security?)
// todo: show receiver details (acct no, name) upon receiver input
// todo: ask to authenticate again before sending (10 min cooldown)
export default class extends Component {
  state = {
    receiver: '',
    amount: 0,
    showSenderName: false,
    receiverNameValid: null,
    error: null,
    step: 'start',
    sending: false
  }

  handleReceiver = async e => {
    const receiverId = e.target.value
    this.setState({receiver: receiverId})

    // check if the receiver is valid
    let receiverNameValid
    if (receiverId) {
      try {
        const res = await server.users.get(receiverId)
        if (res.status === 200) {
          const user = await res.json()
          receiverNameValid = user.name
        }
      } catch (e) { console.error(e) }
    }
    this.setState({receiverNameValid})
  }

  handleAmount = e => {
    // cannot send more than account
    let amount = e.target.value
    if (amount > this.props.userDoc.balance) {
      amount = this.props.userDoc.balance
    }

    // cannot send negative amount
    amount = amount <= 0 ? '' : parseInt(amount, 10)
    this.setState({amount: amount && parseInt(amount, 10)})
  }

  handleShowSenderName = e => this.setState({showSenderName: e.target.checked})

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
      const res = await server.txs.make(this.state.receiver, this.state.amount, this.state.showSenderName)
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
    if (this.state.step === 'confirm') {
      return (
        <div className="mj-box flex-column box-center w-s">
          <div className="is-size-5 has-text-centered">Confirm Send</div>

          <div><strong>Address:</strong> {this.state.receiver}</div>

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
        <div className="mj-box flex-column box-center w-s">
          <div className="is-size-5 has-text-centered has-text-info"><i className="fas fa-check m-r-s"/>Successfully Sent</div>

          <div className="flex-row center-h m-t-l">
            <button className="button" onClick={this.handleCancel}>Close</button>
          </div>
        </div>
      )
    }

    return (
      <div className="mj-box flex-column box-center w-s">
        <div className="is-size-5 has-text-centered">Send mj</div>

        <strong>Address</strong>
        <input className="input" type="text" value={this.state.receiver} onChange={this.handleReceiver}/>
        {this.state.receiverNameValid && <strong className="has-text-info">Valid Receiver</strong>}

        <strong className="m-t-m">Amount</strong>
        <input className="input" type="number" value={this.state.amount} onChange={this.handleAmount}/>

        <label className="checkbox m-t-m">
          <input type="checkbox" checked={this.state.showSenderName} onChange={this.handleShowSenderName}/> Show my name to receiver
        </label>

        {this.state.error && <strong className="has-text-danger has-text-centered m-t-l">{this.state.error}</strong>}

        <div className="flex-row m-t-l">
          <button className="button is-info" onClick={this.handleSend}><i className="fas fa-paper-plane m-r-s"/>Send</button>
          <button className="button m-l-m" onClick={this.handleCancel}>Cancel</button>
        </div>
      </div>
    )
  }
}