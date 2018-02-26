import React, { Component } from 'react'

export default props => (
  <React.Fragment>
    <div className="mj-box flex-column">
      <div className="is-size-5 has-text-centered">Mine mj</div>
    </div>
  </React.Fragment>
)

// exports.receiveTxs = () => {
//   // no duplicates
//   // no balance below 0
//   // valid signatures
// }
//
// exports.receiveBlock = () => {
//   // validate each tx signature unless block is signed by a trusted key
// }
