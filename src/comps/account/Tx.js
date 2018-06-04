import React from 'react'
import { fm } from '../../data/utils'

export default props => {
  const tx = props.userDoc.txs.find(i => i.id === props.match.params.id)
  const githubLink = 'https://github.com/majorna/blockchain/search?q=' + tx.id

  return <div className="mj-box flex-column box-center w-m">
    <div className="is-size-5 has-text-centered">Transaction Details</div>

    <div className="m-t-m"><strong>Tx ID:</strong> {tx.id}</div>
    <div><strong className="m-t-m">Amount:</strong> mj{fm(tx.amount)}</div>
    <div><strong>Time:</strong> {tx.time.toLocaleString()}</div>

    {tx.from ?
      <div className="m-t-m"><strong>From:</strong> {tx.fromName} - {tx.from}</div> :
      <div className="m-t-m"><strong>From:</strong> {props.userDoc.name} - {props.user.uid}</div>}

    {tx.to ?
      <div><strong>To:</strong> {tx.toName} - {tx.to}</div> :
      <div><strong>To:</strong> {props.userDoc.name} - {props.user.uid}</div>}

    <div className="m-t-m"><strong>In Block:</strong></div>
    <small>(Transaction data might take up to a day to be indexed by GitHub)</small>
    <a href={githubLink} target="_blank" rel="noopener noreferrer">{githubLink}</a>

    <div className="flex-row center-h m-t-m">
      <button className="button m-t-l" onClick={props.history.goBack}>Back</button>
    </div>
  </div>
}