import React, { Component } from 'react'
import builtInItems from './BuiltInItems'

export default class extends Component {
  item = builtInItems.find(i => i.id === this.props.match.params.id)

  state = {
    buyButtonDisabled: this.item.unavailable || this.item.getChargeUrl,
    externalUrl: this.item.externalUrl
  }

  componentDidMount = async () => {
    if (this.item.externalScript) {
      // coinbase script expects to be executed in the same container with the 'Buy' button
      const script = document.createElement('script')
      script.src = this.item.externalScript
      this.actionButtons.appendChild(script)
    } else if (this.item.externalUrlFn) {
      const urlRes = await this.item.externalUrlFn()
      const urlData = await urlRes.json()
      this.setState({externalUrl: urlData.chargeUrl})
    }
  }

  handleBuy = () => {
    // if (this.item.externalUrl || this.item.externalUrlFn) {
    //   return
    // }

    // no external url to redirect the user to, so handle exchange internally
  }

  render = () =>
    <div className="mj-box flex-column center-all box-center w-m">
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

      <div ref={ref => this.actionButtons = ref} className="flex-row m-t-l">
        <a className="button is-info donate-with-crypto" disabled={this.state.buyButtonDisabled} href={this.state.externalUrl} onClick={this.handleBuy}>Buy</a>
        <button className="button m-l-m" onClick={this.props.history.goBack}>Cancel</button>
      </div>
    </div>
}