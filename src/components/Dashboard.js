import React, { Component } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import QRCode from 'qrcode';

export default class extends Component {
  async componentWillReceiveProps(nextProps) {
    nextProps.user && this.setState({
      accountQr: await QRCode.toDataURL([{data: nextProps.user.uid, mode: 'byte'}], {errorCorrectionLevel: 'H', margin: 1, scale: 8})
    })
  }

  // generate static chart data for a single value (useful for pre-trading price display)
  getChartData() {
    let data = this.props.exchange.usd.monthly;
    const val = this.props.exchange.usd.val;

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
    return (
      <React.Fragment>
        <div className="mj-box flex-column p-s">
          <div className="is-size-4 has-text-centered">1 mj = {this.props.exchange.usd.val}$*</div>
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

        {!this.props.account ? (
          <div className="mj-box flex-center-all spinner"/>
        ) : (
          <React.Fragment>
            <div className="mj-box flex-column">
              <div><strong>Balance</strong>: <strong>{this.props.account.balance}</strong>mj ({this.props.account.balance * this.props.exchange.usd.val}$)</div>
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
              {this.props.account.transactions.map(t =>
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
        )}
      </React.Fragment>
    )
  }
};