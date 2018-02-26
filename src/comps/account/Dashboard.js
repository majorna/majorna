import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { Link } from 'react-router-dom'
import { fm, getChartData } from '../../data/utils'

export default props => {
  if (!props.userDoc) {
    return <div className="mj-box center-all spinner"/>
  }

  return (
    <React.Fragment>
      <div className="mj-box flex-column p-s">
        <div className="is-size-5 has-text-centered"><span className="faded">Majorna Price:</span> ${props.mjDoc.meta.val}*</div>
        <div className="is-size-5 has-text-centered">
          <span className="faded">Market Cap:</span> ${fm(props.mjDoc.meta.cap * props.mjDoc.meta.val)} <small>(mj{fm(props.mjDoc.meta.cap)})</small>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={getChartData(props.mjDoc.meta)}>
            <XAxis dataKey="t"/>
            <YAxis orientation="right"/>
            <Tooltip/>
            <Area type='monotone' dataKey='mj' unit="$" stroke='DarkOrange' fill='Wheat'/>
          </AreaChart>
        </ResponsiveContainer>
        <small><i>* (future-fixed trading price before exchange opens)</i></small>
      </div>

      <div className="mj-box flex-column">
        <div><strong>Balance</strong>: mj<strong>{fm(props.userDoc.balance)}</strong> (${fm(props.userDoc.balance * props.mjDoc.meta.val)})</div>
        <div><strong>Address</strong>: <small>{props.user.uid}</small></div>
        <img width="72" src={props.acctQr} alt={props.user.uid}/>
      </div>

      <div className="mj-box">
        <Link to="/send" className="button is-info">Send</Link>
        <Link to="/receive" className="button m-l-m">Receive</Link>
      </div>

      <div className="mj-box flex-column">
        <strong>Transactions</strong>
        {props.userDoc.txs.map(t =>
          t.from ? (
            <div className="m-t-xs" key={t.id}>
              <span className="tag is-success" title={'TX ID: ' + t.id}>+{t.amount}</span>
              <span className="m-l-s" title={t.time}>{t.time.toLocaleDateString()}</span>
              <strong className="m-l-s">From:</strong> <span title={t.fromName}>{t.from}</span>
            </div>
          ) : (
            <div className="m-t-xs" key={t.id}>
              <span className="tag is-danger" title={'TX ID: ' + t.id}>-{t.amount}</span>
              <span className="m-l-s" title={t.time}>{t.time.toLocaleDateString()}</span>
              <strong className="m-l-s">To:</strong> <span title={t.toName}>{t.to}</span>
            </div>
          )
        )}
      </div>
    </React.Fragment>
  )
}
