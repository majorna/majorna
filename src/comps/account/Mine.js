import React, { Component } from 'react'

export default class extends Component {
  state = {
    paymentLimit: 10,
    earning: 0
  }

  componentDidMount() {
    // get txs and start mining
  }

  handlePause = () => {}
  handleStop = () => this.props.history.goBack()

  render() {
    return (
      <React.Fragment>
        <div className="mj-box flex-column">
          <div className="is-size-5 has-text-centered">Mining mj</div>

          <strong>Progress</strong>
          <progress className="progress is-large is-info" value="15" max="100">15.69%</progress>
        </div>
      </React.Fragment>
    )
  }
}
