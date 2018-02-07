import React from 'react'

// todo: both alt and qr code text should be same so new top level object? app.qr = {imageBase64: ..., text: ...}
export default (props) => (
  <div className="mj-box flex-column">
    <img width="72" src={this.state.accountAddrQr} alt={this.props.user.uid}/>
  </div>
)
