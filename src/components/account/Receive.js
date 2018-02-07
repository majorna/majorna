import React from 'react'
import { toClipboard } from '../../data/utils'

export default props => (
  <div className="mj-box flex-column center-all">
    <div className="is-size-5">Account Address</div>

    <img width="248" src={props.acctQr} alt={props.user.uid}/>

    <div className="flex-row m-t-l">
      <strong>{props.user.uid}</strong>
      <button className="button is-small is-info is-outlined m-l-s" onClick={() => toClipboard(props.user.uid)}>Copy</button>
    </div>

    <button className="button m-t-l" onClick={props.history.goBack}>Close</button>
  </div>
)
