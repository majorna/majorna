import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

// generate static chart data for a single value (useful for pre-trading price display)
function getChartData(val, data) {
  if (!data && val) {
    data = []
    const month = new Date().toLocaleString('en-us', {month: 'short'});
    for (let i = 1; i < 29; i++) {
      data.push({t: `${month} ${i}`, mj: val});
    }
  }
  return data;
}

export default (props) => (
  <React.Fragment>
    <div className="mj-box flex-column p-s">
      <div className="is-size-4 has-text-centered">1 mj = {props.exchange.usd.val}$*</div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={getChartData(props.exchange.usd.val, props.exchange.usd.monthly)}>
          <XAxis dataKey="t"/>
          <YAxis orientation="right"/>
          <Tooltip/>
          <Area type='monotone' dataKey='mj' unit="$" stroke='DarkOrange' fill='Wheat'/>
        </AreaChart>
      </ResponsiveContainer>
      <small><i>* (future-fixed trading price before exchange opens)</i></small>
    </div>

    {!props.account ? (
      <div className="mj-box flex-center-all spinner"/>
    ) : (
      <React.Fragment>
        <div className="mj-box flex-column">
          <p><strong>Balance</strong>: <strong>{props.account.balance}</strong>mj (~{props.account.balance * 0.01}$)</p>
          <p><strong>Address</strong>: <small>{props.user.uid}</small></p>
        </div>

        <div className="mj-box">
          <button className="button is-info r-m-m" disabled>Send</button>
          <button className="button is-info r-m-m" disabled>Receive</button>
          <i>(Feature to be enabled in: Feb 2018)</i>
        </div>

        <div className="mj-box flex-column">
          <strong>Transactions</strong>
        </div>
      </React.Fragment>
    )}
  </React.Fragment>
);