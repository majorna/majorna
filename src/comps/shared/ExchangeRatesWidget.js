import React, { Component } from 'react'
import server from '../../data/server'

export default class extends Component {
  state = {
    btcMj: 0,
    ethMj: 0
  }

  componentDidMount = async () => {
    const resBtc = await server.coinbase.price('BTC-USD')
    const btcData = await resBtc.json()
    const resEth = await server.coinbase.price('ETH-USD')
    const ethData = await resEth.json()
    this.setState({
      btcMj: Math.round(btcData.data.amount / this.props.mjMetaDoc.val),
      ethMj: Math.round(ethData.data.amount / this.props.mjMetaDoc.val)
    })
  }

  render = () =>
    <React.Fragment>
      abc
    </React.Fragment>
}