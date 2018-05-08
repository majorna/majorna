import React, { Component } from 'react'
import builtInItems from './BuiltInItems'
import { fm } from '../../data/utils'
import config from '../../data/config'
import server from '../../data/server'

export default class extends Component {
  item = builtInItems.find(i => i.id === this.props.match.params.id)

  state = {
    showClose: false,
    showStripeAmount: false,
    stripeCheckout: null,
    stripeAmount: 10,
    coinbaseUrl: this.item.coinbaseUrl
  }

  componentDidMount = async () => {
    if (this.item.stripeScriptUrl) {
      const script = document.createElement('script')
      script.src = this.item.stripeScriptUrl
      script.onload = () => {
        this.state.stripeCheckout = window.StripeCheckout.configure({
          key: config.stripe.publishableKey,
          locale: 'auto',
          token: token => server.shop.createStripeCharge(token.id, this.state.stripeAmount)
        })
      }
      this.container.appendChild(script)
    }

    if (this.item.coinbaseUrlFn) {
      const urlRes = await this.item.coinbaseUrlFn()
      const urlData = await urlRes.json()
      this.setState({coinbaseUrl: urlData.chargeUrl})
    }
  }

  handleStripeAmount = e => {
    // cannot buy negative amount
    let amount = e.target.value
    amount = amount <= 0 ? '' : parseInt(amount, 10)
    this.setState({stripeAmount: amount && parseInt(amount, 10)})
  }

  handleStripeBuy = () => {
    this.item.stripeConfig.amount = this.state.stripeAmount * 100
    this.item.stripeConfig.email = this.props.user.email
    this.state.stripeCheckout.open(this.item.stripeConfig)
    this.setState({
      showStripeAmount: false,
      showClose: true
    })
  }

  render = () => {
    if (this.state.showStripeAmount) {
      return <div className="mj-box flex-column box-center w-s">
        <strong>Amount (USD)</strong>
        <input className="input" type="number" value={this.state.stripeAmount} onChange={this.handleStripeAmount}/>

        <div className="m-t-m"><strong>Amount (mj):</strong> {fm(this.state.stripeAmount / this.props.mjMetaDoc.val)}</div>

        <button className="button is-info m-t-l" onClick={this.handleStripeBuy}>
          <i className="fas fa-credit-card m-r-s"/>Buy with Card
        </button>
      </div>
    } else {
      return <div ref={ref => this.container = ref} className="mj-box flex-column center-all box-center w-m">
        <div className="is-size-5 has-text-centered">Buy - {this.item.name}</div>

        {this.item.fontIcon && <i className={this.item.fontIcon + ' m-t-m'} style={{width: 150, height: 150}}/>}

        {this.item.imageUrl && <img className="m-t-m" width="150" height="150" src={this.item.imageUrl} alt={this.item.name}/>}

        {this.item.googlePlayUrl &&
        <a href={this.item.googlePlayUrl} target="_blank" rel="noopener noreferrer">
          <img className="m-t-m" width="150" src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png" alt="Get it on Google Play"/>
        </a>
        }

        <strong className="m-t-m">Description</strong>
        <div>{this.item.description}</div>

        {this.item.widget && <div className="m-t-m"><this.item.widget mjMetaDoc={this.props.mjMetaDoc}/></div>}

        {this.item.unavailable && <strong className="m-t-m">Status: <span className="has-text-warning">Unavailable</span></strong>}

        {this.state.showClose ?
          <div className="flex-row m-t-l">
            <button className="button is-info m-l-m" onClick={this.props.history.goBack}><i className="fas fa-check m-r-s"/>Close</button>
          </div>
          :
          <div className="flex-row flex-column m-t-l">
            {this.item.id !== 'majorna' && <button className="button is-info" disabled={this.item.unavailable}><i className="fas fa-shopping-cart m-r-s"/>Buy</button>}
            {this.item.id === 'majorna' &&
              <React.Fragment>
                <button className="button is-info" disabled={!this.state.stripeCheckout} onClick={() => this.setState({showStripeAmount: true})}>
                  <i className="fas fa-credit-card m-r-s"/>Buy with Card
                </button>
                <a className="button is-info m-t-s" disabled={!this.state.coinbaseUrl} onClick={() => this.setState({showClose: true})} href={this.state.coinbaseUrl} target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-bitcoin m-r-s"/>Buy with Cryptos
                </a>
              </React.Fragment>}
            <button className="button m-t-s" onClick={this.props.history.goBack}>Cancel</button>
          </div>
        }
      </div>
    }
  }
}