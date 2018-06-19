import React from 'react'

/**
 * A bulma modal component that is only visible when it has content.
 */
export default props =>
  <div className={'modal' + (props.children ? ' is-active' : '')}>
    <div className="modal-background"/>
    <div className="modal-content mj-box flex-column center-h bg-white">
      {props.children}

      <div className="flex-row center-h m-t-l">
        <button className="button is-info" onClick={props.clearNotification}>Close</button>
      </div>
    </div>
    {props.topRightCloseButton && <button className="modal-close is-large"/>}
  </div>