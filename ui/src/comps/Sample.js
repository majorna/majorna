import React, { Component } from 'react'

export default props =>
  <React.Fragment>
    <div className="mj-box">
      <span>Wow</span>
    </div>
  </React.Fragment>

const OneLiner = props => <div>Wow</div>

// export default props => <div>Wow</div>
//
// export default class extends Component {
//   state = {
//     abc: ''
//   }
//
//   componentDidMount = () => {/*start network requests here*/ /*rendering of dom is complete in-mem so we can manipulate dom now*/}
//
//   handleCancel = () => this.props.history.goBack()
//
//   render = () =>
//     <React.Fragment>
//       abc
//     </React.Fragment>
// }
