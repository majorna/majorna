import React, { Component } from 'react'

// one liner
export default props => <div>Wow</div>

// multi one liner
export default props =>
  <React.Fragment>
    <div className="mj-box">
      <span>Wow</span>
    </div>
  </React.Fragment>

// using react hooks (no classes)
export default props => {
    const [page, setPage] = useState('Home')

    // similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
      // update the document title using the browser API
      document.title = `You are still on page ${page}`;

      // cleanup stage to be executed on unmount
      return () => {setPage('Home')}
    });

    return <React.Fragment>
      Current page is: ${page}
        <button onClick={() => setPage('Search')}>
          Click to Search
        </button>
    </React.Fragment>
}

// old-school class based approach
export default class extends Component {
  state = {
    abc: ''
  }

  componentDidMount = () => {/*start network requests here*/ /*rendering of dom is complete in-mem so we can manipulate dom now*/}

  handleCancel = () => this.props.history.goBack()

  render = () =>
    <React.Fragment>
      abc
    </React.Fragment>
}
