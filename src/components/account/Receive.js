import React from 'react'

export default props => (
  <div className="mj-box flex-column">
    <img width="72" src={props.acctQr} alt={props.user.uid}/>

    <div className="flex-row center-h m-t-l">
      <button className="button" onClick={props.history.goBack}>Close</button>
    </div>
  </div>
)
