import React from 'react'

export default props =>
  <div className="modal">
    <div className="modal-background"/>
    <div className="modal-content">
      {props.children}
    </div>
    <button className="modal-close is-large" aria-label="close"/>
  </div>