import React from 'react'

export default props =>
  <div className="mj-box flex-column">
    <div className="is-size-5 has-text-centered">Majorna Terms and Conditions</div>
    <div className="m-t-m">
      Last updated: Jun 8, 2018.
    </div>

    <div className="m-t-m">
      Via using or acquiring Majorna, you agree to the following terms and conditions:
    </div>

    <strong className="m-t-m">Definition of Majorna</strong>
    <div>
      Majorna (mj) is a cryptocurrency as well as the name of the project associated with it, which is not a commercial nor registered organization.
      All the Majorna on all the accounts along with all the transactions are stored and is visible at the <a href="https://github.com/majorna/blockchain" target="_blank" rel="noopener noreferrer">blockchain</a> repository.
      Via opening an account on Majorna, you become a counterpart to this agreement.
      You have the right to send, receive, and mine Majorna on your account.
    </div>

    <strong className="m-t-m">Donations</strong>
    <div>
      All donations goes towards Majorna development and are non-refundable.
      Donations are private (hence a tax-related donation receipt can not be issued) and have no rights or privileges associated with them.
      Majorna is an active project and it may or may not be successful.
      Majorna currently has no inherent value, and may or may not have any value in the future depending on public acceptance.
      Via using Majorna or donating to the project, you accept this.
      However we believe that it has a great chance of becoming a publicly accepted currency and a payment platform over time.
      Project is fully open source and will contribute to maturity of the cryptocurrency ecosystem regardless of the outcome.
    </div>

    <strong className="m-t-m">No Liability or Claim</strong>
    <div>
      All Majorna transactions including sending, receiving, mining, and donations are final and non-refundable.
      As the account holder, you are responsible for all your transactions.
      You are also responsible for keeping your connected accounts (i.e. Google) secure, as Majorna assumes no liability.
      Compromise of your account credentials may result in loss of your majorna, therefore it is highly recommended for you to enable 2-step verification in your connected accounts.
      If you choose to move your Majorna to a personal private key, you are responsible for its safety and security.
      Majorna in your account does not give you any rights or claim of any kind, in Majorna project, or from Majorna developers.
      Majorna project assumes no liability of any kind on your account or Majorna in it.
    </div>

    <strong className="m-t-m">No Guarantees</strong>
    <div>
      Safety of your account, account data, and majorna in it can not be guaranteed.
      Majorna is a young project and comprise of the entire network is a possibility.
      If Majorna fails as a project and stops operating before peer-to-peer network is in production, Majorna in your account may forever be lost.
      Majorna project and its developers do not give you any guarantees of any kind, or accept any liability of any kind.
      Majorna has the right to terminate your account at any time, with or without cause, with or without notice, with or without destroying all Majorna in it (ability to move Majorna from account to a private key is a work-in-progress).
      Accounts terminated due to malicious activity cannot be reopened.
    </div>

    <strong className="m-t-m">Development Period</strong>
    <div>
      Until a final v1.0 release, Majorna platform will be under rapid development.
      Currently all transactions and mining activity is on mainnet.
      However until wider security analysis and a v1.0 <a href="https://github.com/majorna/majorna/releases" target="_blank" rel="noopener noreferrer">release</a>, occasional hardforks and downtime is expected.
      All the forks and relevant activity will always be on blockchain repository.
    </div>

    <strong className="m-t-m">Privacy Policy</strong>
    <div>
      Majorna does not have access to your personally identifiable information outside of what 3rd party authentication providers supply.
      Majorna only keeps minimal information required to associate your account to you.
      All the information that Majorna receives is listed by the authentication provider during first ever login.
      Majorna does not have access to your credentials.
    </div>

    <strong className="m-t-m">Updates to the Terms and Conditions</strong>
    <div>
      Terms and conditions are updated occasionally, and you can find the last updated time at the beginning of this agreement.
      You are required to review the updates occasionally, as continuing to use Majorna means agreeing to the updated terms and conditions.
    </div>

    <div className="flex-row center-h m-t-l">
      <button className="button m-t-l" onClick={props.history.goBack}>Back</button>
    </div>
  </div>
