import React from 'react'

export default props =>
  <div className="mj-box flex-column">
    <div className="is-size-5 has-text-centered">Majorna Terms and Conditions</div>
    <div className="m-t-m">
      Last updated: May 22, 2018.
    </div>

    <div className="m-t-m">
      Via using or acquiring Majorna, you agree to the following terms and conditions:
    </div>

    <strong className="m-t-m">Definition of Majorna</strong>
    <div>
      Majorna is a cryptocurrency.
      All the Majorna on all the accounts along with all the transactions are stored and is visible at the <a href="https://github.com/majorna/blockchain" target="_blank" rel="noopener noreferrer">blockchain</a> repository.
      Via opening an account on Majorna, you become a counterpart to this agreement.
      You have the all rights to send, receive, mine, and purchase Majorna on your account.
      Your obligations are spelled out throughout the rest of this document.
    </div>

    <strong className="m-t-m">No Liability</strong>
    <div>
      All Majorna transactions are final, not-refundable, and visible at the blockchain repository.
      As the account holder, you are responsible for all your transactions.
      You are also responsible for keeping your connected accounts secure, as Majorna assumes no liability.
      Compromise of your accounts credentials may result in loss of funds.
      If you choose to move your funds to a personal private key, you are responsible for its safety and security.
      Majorna has no claim or liability on your funds, and Majorna accounts current are not covered by deposit insurance, however we plan to add it as an option in the future.
    </div>

    <strong className="m-t-m">Development Period</strong>
    <div>
      Until a final v1.0 release, Majorna platform will be under rapid development.
      Currently all mining and purchasing activity is on mainnet.
      However until wider security analysis and a 1.0 <a href="https://github.com/majorna/majorna/releases" target="_blank" rel="noopener noreferrer">release</a>, occasional hardforks and downtime is expected.
      All the forks and relevant activity will always be on blockchain repository.
    </div>

    <strong className="m-t-m">Data Processing</strong>
    <div>
      Majorna does not have access to your personally identifiable information outside of what 3rd party authentication providers supply.
      Majorna only keeps minimal information required to associate your account to you and does not share it with 3rd parties.
      All the information that Majorna receives is presented by the authentication provider during first ever login.
      Majorna does not have access to your credentials.
    </div>

    <strong className="m-t-m">Updates to the Terms and Conditions</strong>
    <div>
      Terms and conditions are updated occasionally, and you can find the last updated time at the beginning of the agreement.
      You are required to review the updates occasionally, as continuing to use Majorna means agreeing to the updated terms and conditions.
    </div>

    <div className="flex-row center-h m-t-l">
      <button className="button m-t-l" onClick={props.history.goBack}>Back</button>
    </div>
  </div>
