import React, { Component } from 'react'
import server from '../../data/server'
import { fm } from '../../data/utils'

export default class extends Component {
  state = {
    btcMj: 0,
    ethMj: 0
  }

  componentDidMount = async () => {
    const usdExRes = await server.coinbase.usdExchangeRates()
    const usdExData = await usdExRes.json()
    this.setState({
      btcMj: fm(Math.round(1 / usdExData.data.rates.BTC / this.props.mjMetaDoc.val)),
      ethMj: fm(Math.round(1 / usdExData.data.rates.ETH / this.props.mjMetaDoc.val))
    })
  }

  render = () =>
    <div className="flex-column">
      <strong>Exchange Rates</strong>
      {!this.state.btcMj ?
        <div className="mj-box center-all spinner"/> :
        <div className="mj-box">
          {/*1 USD = {fm(Math.round(1 / this.props.mjMetaDoc.val))} mj <br/>*/}
          1 Bitcoin = {this.state.btcMj} mj <br/>
          1 Ethereum = {this.state.ethMj} mj
        </div>
      }
    </div>
}