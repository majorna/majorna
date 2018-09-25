import React, { Component } from 'react'
import { fm, fn } from '../../data/utils'
import server from '../../data/server'
import { mineBlock, stopMining } from '../../blockchain/miner'
import { ResponsiveContainer, Scatter, ScatterChart, XAxis, YAxis } from 'recharts'
import worldMap from '../../res/world_map.svg'
import { Link } from 'react-router-dom'

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
    hashRate: 0,

    // pas mining info
    minedBlocks: 0,
    collectedReward: 0,

    // ui state
    showDetails: false,
    miners: []
  }

  componentDidMount = async () => {
    // 3rd party service can fail here so waking server is enough even if request fails
    new Promise(async () => {
      try {
        // get rough location so we can populate miner map
        const locationRes = await server.peers.getSelfLocation()
        const location = locationRes.status === 200 && await locationRes.json()

        // set miner location for miner map (also wakes server up)
        const minersRes = await server.peers.miners.join(location.latitude, location.longitude)
        const minersData = await minersRes.json()
        this.setState({miners: minersData.miners})
      } catch (e) {
        console.error(e)
      }
    })

    // start network requests
    this.fbUnsubBlockInfoMetaDocSnapshot = this.props.db.collection('meta').doc('blockInfo').onSnapshot(async doc => {
      if (!this.fbUnsubBlockInfoMetaDocSnapshot) {
        return // can happen if callback queued to be triggered right after unmount function call
      }

      stopMining()

      const blockInfo = doc.data()
      this.setState({blockInfo})

      // todo: better way would be to check and abort running mining promise inside node.stopMining()
      await mineBlock(
        blockInfo.miner.headerStrWithoutNonce,
        blockInfo.miner.targetDifficulty,
        s => this.setState(s), // callback: progress update
        async nonce => { // callback: mined a block
          const res = await server.blocks.create(nonce)
          if (res.ok) { // we collected the reward
            this.setState(preState => ({
              minedBlocks: (preState.minedBlocks + 1),
              collectedReward: (preState.collectedReward + preState.blockInfo.miner.reward)
            }))
          }
          this.setState({
            nonce: 0,
            time: 0,
            hashRate: 0
          })
        })
    })
  }

  componentWillUnmount = () => {
    this.fbUnsubBlockInfoMetaDocSnapshot && this.fbUnsubBlockInfoMetaDocSnapshot()
    this.fbUnsubBlockInfoMetaDocSnapshot = null
    stopMining()
  }

  handleStop = () => this.props.history.goBack()

  handleShowDetails = () => this.setState(prevState => ({showDetails: !prevState.showDetails}))

  render = () =>
    <div className="mj-box flex-column box-center w-m">
      <div className="is-size-5 has-text-centered">Mining mj</div>

      <div className="flex-row center-all spinner m-t-l"/>
      <div><strong>Time:</strong> {this.state.time}s</div>
      <div><strong>Rate:</strong> {fn(this.state.hashRate)} Hash/s</div>
      <div><strong>Nonce:</strong> {fn(this.state.nonce)}</div>

      <div className="m-t-m"><strong>Target Difficulty:</strong> {this.state.blockInfo.miner.targetDifficulty}</div>
      <div><strong>Reward for Block:</strong> mj{fm(this.state.blockInfo.miner.reward || 0)}</div>

      <div className="m-t-m"><strong>Mined Blocks:</strong> {this.state.minedBlocks}</div>
      <div><strong>Collected Rewards:</strong> mj{fm(this.state.collectedReward)}</div>

      <div className="m-t-m" style={{maxWidth: '30rem'}}>
        <strong>Miner Map:</strong>
        <ResponsiveContainer width="100%" aspect={2}>
          <ScatterChart style={{backgroundImage: `url(${worldMap})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%', backgroundPosition: '1rem center'}}>
            <XAxis dataKey={'lon'} type="number" domain={[-180, 180]} hide/>
            <YAxis dataKey={'lat'} type="number" domain={[-90, 90]} hide/>
            <Scatter data={this.state.miners} fill='darkorange'/>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="m-t-m">
        <button className="button is-small" onClick={this.handleShowDetails}>
          <span style={{display: (this.state.showDetails ? 'none' : 'initial')}}><i className="far fa-plus-square m-r-s"/></span>
          <span style={{display: (this.state.showDetails ? 'initial' : 'none')}}><i className="far fa-minus-square m-r-s"/></span>
          Details
        </button>
        {/* todo: anchor link might not work without this: https://github.com/rafrex/react-router-hash-link */}
        <Link to='/about/tech#mining' className="button is-small m-l-s"><i className="far fa-question-circle m-r-s"/>What is mining?</Link>
      </div>
      {this.state.showDetails &&
        <small className="flex-column">
          <strong className="has-text-info m-t-m">Current Block</strong>
          <div className="m-t-xs"><strong>No:</strong> {this.state.blockInfo.header.no}</div>
          <div><strong>Version:</strong> {this.state.blockInfo.header.version}</div>
          <div><strong>Time:</strong> {this.state.blockInfo.header.time && this.state.blockInfo.header.time.toLocaleString()}</div>
          <div><strong>Transaction Count:</strong> {this.state.blockInfo.header.txCount}</div>
          <div><strong>Min Difficulty:</strong> {this.state.blockInfo.header.minDifficulty}</div>
          <div><strong>Nonce:</strong> {fn(this.state.blockInfo.header.nonce || 0)}</div>
          <div><strong>Merkle Root:</strong> <small className="wrap-text">{this.state.blockInfo.header.merkleRoot}</small></div>
          <div><strong>Proof of Work:</strong> <small className="wrap-text">{this.state.blockInfo.pow}</small></div>

          <strong className="has-text-info m-t-m">Previous Block</strong>
          <div className="m-t-xs"><strong>Hash:</strong> <small className="wrap-text">{this.state.blockInfo.header.prevHash}</small></div>
          <div><strong>Proof of Work:</strong> <small className="wrap-text">{this.state.blockInfo.header.prevPow}</small></div>

          <strong className="has-text-info m-t-m">Blockchain</strong>
          <div className="m-t-xs"><strong>Download Blockchain:</strong> <small className="wrap-text">
              <a href="https://github.com/majorna/blockchain/archive/master.zip" target="_blank" rel="noopener noreferrer">
                https://github.com/majorna/blockchain/archive/master.zip
              </a>
            </small>
          </div>

          {/*<strong className="m-t-m">Peers</strong>*/}
          {/*<div><strong>Online Peers:</strong> ?</div>*/}
          {/*<div><strong>Global Hash Rate:</strong> ?</div>*/}

          {/*<div><strong>Expected Reward (per hour):</strong> ?</div>*/}
        </small>
      }

      <div className="flex-row center-h m-t-l">
        <button className="button" onClick={this.handleStop}>Stop</button>
      </div>
    </div>
}
