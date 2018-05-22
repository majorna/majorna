import React from 'react'

export default props =>
  <div className="mj-box flex-column">
    <div className="is-size-5 has-text-centered">Majorna User Agreement</div>
    <div className="m-t-m">
      <u>Last updated: May 22, 2018.</u>
      Via using or purchasing Majorna, you agree to the following terms and conditions so make sure to review them thoroughly:
    </div>

    <strong className="m-t-m">No Liability</strong>
    <div>
      All Majorna transactions are final/not-refundable, and visible at <a href="https://github.com/majorna/blockchain" target="_blank" rel="noopener noreferrer">blockchain</a> repository.
      As the account holder, you are responsible for all your transactions.
      You are also responsible for keeping your connected accounts secure, as Majorna assumes no liability.
      Compromise of your accounts credentials may result in loss of funds.
      If you choose to move your funds to a personal private key, you are responsible for its safety and security.
      Majorna accounts current are not covered by deposit insurance, but we plan to add it as an option in the future.
    </div>

    <strong className="m-t-m">Updates to the Agreement</strong>
    <div>
      User agreement is updated occasionally, and you can find the last updated time at the beginning of the agreement.
      You are required to review the updates occasionally as with continuing to use Majorna means agreement to updated terms.
    </div>

    <div className="flex-row center-h m-t-l">
      <button className="button m-t-l" onClick={props.history.goBack}>Back</button>
    </div>
  </div>
