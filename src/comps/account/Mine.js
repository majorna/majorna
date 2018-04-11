import React, { Component } from 'react'
import { fm, fn } from '../../data/utils'
import server from '../../data/server'
import { mineBlock, stopMining } from '../../data/node'

export default class extends Component {
  state = {
    // firestore doc
    blockInfo: {
      header: {},
      miner: {}
    },

    // current mining info
    nonce: 0,
    time: 0,
    minedBlocks: 0,
    hashRate: 0,

    // ui state
    showDetails: false
  }

  componentDidMount = async () => {
    // 3rd party service can fail here so waking server is enough even if request fails
    let miners = []
    try {
      // get rough location so we can populate miner map
      const locationRes = await server.miners.getLocation()
      const location = locationRes.status === 200 && await locationRes.json()

      // set miner location for miner map (also wakes server up)
      const minersRes = await server.miners.post(location.latitude, location.longitude)
      const minersData = await await minersRes.json()
      miners = minersData.miners
    } catch (e) { console.error(e) }

    // start network requests
    this.fbUnsubBlockInfoMetaDocSnapshot = this.props.db.collection('meta').doc('blockInfo').onSnapshot(async doc => {
      stopMining()

      const blockInfo = doc.data()
      this.setState({blockInfo})

      await mineBlock(
        blockInfo.miner.headerStrWithoutNonce,
        blockInfo.miner.targetDifficulty,
        s => this.setState(s), // callback: progress update
        async nonce => { // callback: mined a block
          await server.blocks.create(nonce) // todo: ignore errors but display error msg
          this.setState((preState, props) => ({
            minedBlocks: (preState.minedBlocks + 1),
            hashRate: 0,
            time: 0,
            targetDifficulty: 0
          }))
        })
    })
  }

  componentWillUnmount = () => {
    this.fbUnsubBlockInfoMetaDocSnapshot && this.fbUnsubBlockInfoMetaDocSnapshot()
    stopMining()
  }

  handleStop = () => this.props.history.goBack()

  handleShowDetails = () => this.setState(prevState => ({showDetails: !prevState.showDetails}))

  render = () =>
    <div className="mj-box flex-column">
      <div className="is-size-5 has-text-centered">Mining mj</div>
      <div className="flex-row center-all spinner m-t-l"/>

      <div><strong>Time:</strong> {this.state.time}s</div>
      <div><strong>Rate:</strong> {fn(this.state.hashRate)} Hash/s</div>
      <div><strong>Nonce:</strong> {fn(this.state.nonce)}</div>

      <div className="m-t-m"><strong>Target Difficulty:</strong> {this.state.blockInfo.miner.targetDifficulty}</div>
      <div><strong>Reward for Block:</strong> mj{fm(this.state.blockInfo.miner.reward)}</div>

      <div className="m-t-m"><strong>Mined Blocks:</strong> {this.state.minedBlocks}</div>
      <div><strong>Collected Rewards:</strong> mj{fm(this.state.blockInfo.miner.reward * this.state.minedBlocks)}</div>

      <div className="m-t-m">
        <button className="button is-small" onClick={this.handleShowDetails}>
          {this.state.showDetails ? <i className="far fa-minus-square m-r-s"/> : <i className="far fa-plus-square m-r-s"/>}
          Details
        </button>
      </div>
      {this.state.showDetails &&
        <small className="flex-column">
          <strong className="m-t-m">Current Block</strong>
          <div><strong>No:</strong> {this.state.blockInfo.header.no}</div>
          <div><strong>Time:</strong> {this.state.blockInfo.header.time && this.state.blockInfo.header.time.toLocaleString()}</div>
          <div><strong>Transaction Count:</strong> {this.state.blockInfo.header.txCount}</div>
          <div><strong>Min Difficulty:</strong> {this.state.blockInfo.header.minDifficulty}</div>
          <div><strong>Nonce:</strong> {fn(this.state.blockInfo.header.nonce)}</div>
          <div><strong>Previous Block Hash:</strong> <small>{this.state.blockInfo.header.prevHash}</small></div>
          <div><strong>Merkle Root:</strong> <small>{this.state.blockInfo.header.merkleRoot}</small></div>

          {/*<strong className="m-t-m">Peers</strong>*/}
          {/*<div><strong>Online Peers:</strong> ?</div>*/}
          {/*<div><strong>Global Hash Rate:</strong> ?</div>*/}

          {/*<div><strong>Expected Reward (per hour):</strong> ?</div>*/}
        </small>
      }

      <div className="flex-row center-h m-t-l">
        <button className="button" onClick={this.handleStop}>Stop</button>
      </div>

      <small className="m-t-l">
        <i>
          All the mined blocks are on testnet until July 2018.
          They may or may not be transferred (in part or fully) to the mainnet, depending on security analysis.
        </i>
      </small>
    </div>
}
