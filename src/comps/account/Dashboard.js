import React from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'
import { Link } from 'react-router-dom'
import { fm, getChartData } from '../../data/utils'
import StatsWidget from '../shared/StatsWidget'

export default props => {
  if (!props.userDoc || !props.mjMetaDoc) {
    return <div className="mj-box center-all spinner"/>
  }

  return (
    <React.Fragment>
      <div className="mj-box flex-column p-s">
        <div className="is-size-5 has-text-centered"><span className="faded">Majorna Price:</span> ${props.mjMetaDoc.val}*</div>
        <div className="is-size-5 has-text-centered">
          <span className="faded">Market Cap:</span> ${fm(props.mjMetaDoc.marketCap * props.mjMetaDoc.val)} <small>(mj{fm(props.mjMetaDoc.marketCap)})</small>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={getChartData(props.mjMetaDoc)}>
            <XAxis dataKey="t"/>
            <YAxis orientation="right"/>
            <Tooltip/>
            <Area type='monotone' dataKey='mj' unit="$" stroke='DarkOrange' fill='Wheat'/>
          </AreaChart>
        </ResponsiveContainer>
        <small><i>* (fixed trading price until exchange opens)</i></small>
      </div>

      <div className="mj-box flex-column w-s">
        <div><strong>Balance</strong>: mj<strong>{fm(props.userDoc.balance)}</strong> (${fm(props.userDoc.balance * props.mjMetaDoc.val)})</div>
        <div><strong>Address</strong>: <small>{props.user.uid}</small></div>
        <div><Link to="/receive"><img width="72" src={props.acctQr} alt={props.user.uid}/></Link></div>
      </div>

      <div className="mj-box w-s">
        <Link to="/send" className="button is-info"><i className="fas fa-paper-plane m-r-s"/>Send</Link>
        <Link to="/receive" className="button m-l-m"><i className="fas fa-qrcode m-r-s"/>Receive</Link>
      </div>

      <div className="mj-box w-s">
        <Link to="/shop/majorna" className="button is-primary"><i className="fas fa-credit-card m-r-s"/>Buy Majorna</Link>
        <Link to="/mine" className="button m-l-m"><i className="fas fa-th m-r-s"/>Mine</Link>
      </div>

      <div className="mj-box flex-column w-m">
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

      <StatsWidget mjMetaDoc={props.mjMetaDoc} />
    </React.Fragment>
  )
}
