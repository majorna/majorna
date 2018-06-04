import React from 'react'
import { fm } from '../../data/utils'

export default props =>
  <div className="mj-box">
    <div className="is-size-5 has-text-centered">Transaction Details</div>

    <div><strong>Tx ID:</strong> {props.tx.id}</div>

    <div><strong className="m-t-m">Amount:</strong> mj{fm(props.tx.amount)}</div>

    <div><strong>Time:</strong> {props.tx.time}</div>

    {props.tx.from ?
      <div><strong>From:</strong> {props.tx.fromName} - {props.tx.from}</div> :
      <div><strong>From:</strong> {props.name} - {props.address}</div>}

    {props.tx.to ?
      <div><strong>To:</strong> {props.tx.toName} - {props.tx.to}</div> :
      <div><strong>To:</strong> {props.name} - {props.address}</div>}

    <div><strong>Search in Blockchain Repo:</strong> <a className="button is-small is-outlined" href={`https://github.com/majorna/blockchain/search?q=${props.tx.id}`} target="_blank" rel="noopener noreferrer"><i className="fab fa-github m-r-s"/> {`https://github.com/majorna/blockchain/search?q=${props.tx.id}`}</a></div>

    <div><strong>Time:</strong> {props.tx.time}</div>
  </div>
