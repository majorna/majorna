import React from 'react'
import { fm } from '../../data/utils'

export default props =>
  <div className="mj-box stats-grid">
    <div className="flex-column center-all">
      <strong className="is-size-5 has-text-success">{fm(props.mjMetaDoc.marketCap / (1000 * 1000))}M mj</strong>
      Current Supply
    </div>
    <div className="flex-column center-all">
      <strong className="is-size-5 has-text-success">{fm(Math.round(props.mjMetaDoc.monthly.txVolume))} mj</strong>
      Tx Volume (monthly)
    </div>
    <div className="flex-column center-all">
      <strong className="is-size-5 has-text-grey">{fm(props.mjMetaDoc.maxSupply / (1000 * 1000 * 1000))}B mj</strong>
      Max Supply
    </div>
    <div className="flex-column center-all">
      <strong className="is-size-5 has-text-grey">{props.mjMetaDoc.userCount}</strong>
      Total Accounts
    </div>
  </div>

// export default props =>
//   <div className="mj-box stats-grid">
//     <div className="flex-column center-all">
//       <strong className="is-size-5 has-text-success">${props.mjMetaDoc.val}*</strong>
//       Current Price
//     </div>
//     <div className="flex-column center-all">
//       <strong className="is-size-5 has-text-success">${fm(Math.round(props.mjMetaDoc.marketCap * props.mjMetaDoc.val))}</strong>
//       Market Cap.
//     </div>
//     <div className="flex-column center-all">
//       <strong className="is-size-5 has-text-success">${fm(Math.round(props.mjMetaDoc.monthly.txVolume * props.mjMetaDoc.val))}</strong>
//       Tx Volume (monthly)
//     </div>
//     <div className="flex-column center-all">
//       <strong className="is-size-5 has-text-grey">{fm(props.mjMetaDoc.marketCap / (1000 * 1000))}M mj</strong>
//       Current Supply
//     </div>
//     <div className="flex-column center-all">
//       <strong className="is-size-5 has-text-grey">{fm(props.mjMetaDoc.maxSupply / (1000 * 1000 * 1000))}B mj</strong>
//       Max Supply
//     </div>
//     <div className="flex-column center-all">
//       <strong className="is-size-5 has-text-grey">{props.mjMetaDoc.userCount}</strong>
//       Total Accounts
//     </div>
//   </div>
