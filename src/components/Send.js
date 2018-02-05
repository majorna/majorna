import React, { Component } from 'react'

export default class extends Component {
  render() {
    return (
      <div className="mj-box flex-column">
        <strong className="has-text-centered">Send mj</strong>

        <strong>Receiver:</strong>
        <input type="text" />
      </div>
    )
  }
}