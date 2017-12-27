import React, { Component } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default class Dashboard extends Component {
  data = [
    {t: 'Dec 5', mj: 0},
    {t: 'Dec 10', mj: 0.005},
    {t: 'Dec 15', mj: 0.01},
    {t: 'Dec 20', mj: 0.01},
    {t: 'Dec 25', mj: 0.01}
  ];

  render() {
    return (
      <React.Fragment>
        <div className="mj-box p-s">
          <div className="is-size-4 has-text-centered">1 mj = 0.01$</div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={this.data}>
              <XAxis dataKey="t"/>
              <YAxis orientation="right"/>
              <Tooltip/>
              <Area type='monotone' dataKey='mj' unit="$" stroke='DarkOrange' fill='Wheat'/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {this.props.account ? (
          <React.Fragment>
            <div className="mj-box">
              <p><strong>Balance</strong>: <strong>{this.props.account.balance}</strong>mj (~{this.props.account.balance * 0.01}$)</p>
              <p><strong>Address</strong>: <small>{this.props.user.uid}</small></p>
            </div>

            <div className="mj-box flex-row">
              <button className="button is-info r-m-m" disabled>Send</button>
              <button className="button is-info r-m-m" disabled>Receive</button>
              <i>(Feature to be enabled in: Feb 2018)</i>
            </div>
          </React.Fragment>
        ) : (
          <div className="mj-box flex-center-all spinner"/>
        )}
      </React.Fragment>
    );
  }
}