import React from 'react'
import config from '../../data/config'

export default props => config.app.isTestnet ?
  <small className="flex-row center-all has-text-weight-bold m-t-m" style={{color: 'orange'}}>
    <i className="fas fa-flask m-r-s"/>TESTNET
  </small> :
  null
