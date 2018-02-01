import React, { Component } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import QRCode from 'qrcode';

export default class extends Component {
  constructor(props) {
    super(props);
    this.state = {accountQr: null};
  }

  fm = new Intl.NumberFormat().format;

  async componentWillReceiveProps(nextProps) {
    nextProps.user && this.setState({
      accountQr: await QRCode.toDataURL(
        [{data: `majorna:${nextProps.user.uid}`, mode: 'byte'}],
        {errorCorrectionLevel: 'H', margin: 1, scale: 8})
    })
  }

  // generate static chart data for a single value (useful for pre-trading price display)
  getChartData() {
    let data = this.props.mj.meta.monthly;
    const val = this.props.mj.meta.val;

    if (!data && val) {
      data = []
      const month = new Date().toLocaleString('en-us', {month: 'short'});
      for (let i = 1; i < 29; i++) {
        data.push({t: `${month} ${i}`, mj: val});
      }
    }
    return data;
  }

  render() {
    if (!this.props.account) {
      return <div className="mj-box flex-center-all spinner"/>
    }

    return (
      <React.Fragment>
        <div className="mj-box flex-column p-s">
          <div className="is-size-5 has-text-centered"><span className="faded">Majorna Price:</span> ${this.props.mj.meta.val}*</div>
          <div className="is-size-5 has-text-centered">
            <span className="faded">Market Cap:</span> ${this.fm(this.props.mj.meta.cap * this.props.mj.meta.val)} <small>mj{this.fm(this.props.mj.meta.cap)}</small>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={this.getChartData()}>
              <XAxis dataKey="t"/>
              <YAxis orientation="right"/>
              <Tooltip/>
              <Area type='monotone' dataKey='mj' unit="$" stroke='DarkOrange' fill='Wheat'/>
            </AreaChart>
          </ResponsiveContainer>
          <small><i>* (future-fixed trading price before exchange opens)</i></small>
        </div>

        <div className="mj-box flex-column">
          <div><strong>Balance</strong>: <strong>{this.props.account.balance}</strong>mj ({this.props.account.balance * this.props.mj.meta.val}$)</div>
          <div><strong>Address</strong>: <small>{this.props.user.uid}</small></div>
          <img width="72" src={this.state.accountQr} alt={this.props.user.uid}/>
        </div>

        <div className="mj-box">
          <button className="button is-info m-r-m" disabled>Send</button>
          <button className="button is-info m-r-m" disabled>Receive</button>
          <i>(Feature to be enabled in: Feb 2018)</i>
        </div>

        <div className="mj-box flex-column">
          <strong className="m-b-s">Transactions</strong>
          {this.props.account.txs.map(t =>
            t.from ? (
              <div className="m-b-xs" key={t.id}>
                <span className="tag is-success" title={'TX ID: ' + t.id}>+{t.amount}</span>
                <span className="m-l-s" title={t.sent}>{t.sent.toLocaleDateString()}</span>
                <strong className="m-l-s">From:</strong> {t.from}
              </div>
            ) : (
              <div className="m-b-xs" key={t.id}>
                <span className="tag is-danger" title={'TX ID: ' + t.id}>-{t.amount}</span>
                <span className="m-l-s" title={t.sent}>{t.sent.toLocaleDateString()}</span>
                <strong className="m-l-s">To:</strong> {t.to}
              </div>
            )
          )}
        </div>
      </React.Fragment>
    )
  }
};