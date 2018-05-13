import React from 'react'

export default props =>
  <div className="modal is-active">
    <div className="modal-background"/>
    <div className="modal-content">
      {props.children}

      <div className="flex-row center-h m-t-l">
        <button className="button" onClick={props.history.goBack}>Close</button>
      </div>
    </div>
    {props.topRightCloseButton && <button className="modal-close is-large"/>}
  </div>