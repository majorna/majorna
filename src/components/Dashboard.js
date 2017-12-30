import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default (props) => (
  <React.Fragment>
    <div className="mj-box p-s">
      <div className="is-size-4 has-text-centered">1 mj = 0.01$*</div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={props.exchange.usd.monthly}>
          <XAxis dataKey="t"/>
          <YAxis orientation="right"/>
          <Tooltip/>
          <Area type='monotone' dataKey='mj' unit="$" stroke='DarkOrange' fill='Wheat'/>
        </AreaChart>
      </ResponsiveContainer>
      <small><i>* (pre-determined trading price before exchange opens)</i></small>
    </div>

    {!props.account ? (
      <div className="mj-box flex-center-all spinner"/>
    ) : (
      <React.Fragment>
        <div className="mj-box">
          <p><strong>Balance</strong>: <strong>{props.account.balance}</strong>mj (~{props.account.balance * 0.01}$)</p>
          <p><strong>Address</strong>: <small>{props.user.uid}</small></p>
        </div>

        <div className="mj-box flex-row">
          <button className="button is-info r-m-m" disabled>Send</button>
          <button className="button is-info r-m-m" disabled>Receive</button>
          <i>(Feature to be enabled in: Feb 2018)</i>
        </div>
      </React.Fragment>
    )}
  </React.Fragment>
);