export default class PeerNetwork {
  receiveTxs = () => {
    // no duplicates
    // no balance below 0
    // valid signatures
  }

  receiveBlock = () => {
    // validate each tx signature unless block is signed by a trusted key
  }

  initPeerConns = () => {
  }
}