import React from 'react'

export default props =>
  <div className="mj-box flex-column">
    <div className="is-size-5 has-text-centered">Majorna Terms and Conditions</div>
    <div className="m-t-m">
      Last updated: Sep 5, 2018.
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

    <strong className="m-t-m">Development Period and Testnet</strong>
    <div>
      Until a final v1.0 <a href="https://github.com/majorna/majorna/releases" target="_blank" rel="noopener noreferrer">release</a>, Majorna platform will be under rapid development.
      Occasional downtime, hardforks, or even full scale reverts are expected.
      Majorna in testnet has no value, is not a legal tender, and is not sold.
      Sending and receiving Majorna in testnet does not result in exchange of any value.
    </div>

    <strong className="m-t-m">No Liability or Claim</strong>
    <div>
      All Majorna transactions including sending, receiving, and mining are final.
      As the account holder, you are responsible for all your transactions.
      You are also responsible for keeping your connected accounts (i.e. Google) secure, as Majorna assumes no liability.
      Compromise of your account credentials may result in loss of your Majorna, therefore it is highly recommended for you to enable 2-step verification in your connected accounts.
      If you choose to move your Majorna to a personal private key, you are responsible for its safety and security.
      Majorna in your account does not give you any rights or claim of any kind, in Majorna project, or from Majorna developers.
      Majorna project assumes no liability of any kind on your account or Majorna in it, to the extent permitted by applicable law.
    </div>

    <strong className="m-t-m">No Guarantees</strong>
    <div>
      Safety of your account, account data, and Majorna in it can not be guaranteed.
      Majorna is a young project and comprise of the entire network is a possibility.
      If Majorna fails as a project and stops operating, Majorna in your account may forever be lost.
      Majorna project and its developers do not give you any guarantees or warranties of any kind, or accept any liability of any kind, to the extent permitted by applicable law.
      Majorna has the right to terminate your account at any time during the development period, with or without cause, with or without notice, with or without destroying any Majorna in it.
      Ability to move Majorna from account to a private key is a work-in-progress.
      Accounts terminated due to malicious activity cannot be reopened.
    </div>

    <strong className="m-t-m">Donations</strong>
    <div>
      All donations goes towards Majorna development.
      Donations are anonymous and non-refundable.
      They are appreciated but never asked.
      All donations are private hence a tax-related donation receipt can not be issued, and have no rights or privileges associated with them.
    </div>

    <strong className="m-t-m">Privacy Policy</strong>
    <div>
      Majorna does not have access to your personally identifiable information outside of what 3rd party authentication providers supply.
      Majorna only keeps minimal information required to associate your account to you.
      All the information that Majorna receives is listed by the authentication provider during first ever login.
      Majorna does not have access to your credentials.
      Location information displayed on the miner map is anonymous.
    </div>

    <strong className="m-t-m">Updates to the Terms and Conditions</strong>
    <div>
      Terms and conditions are updated occasionally, and you can find the last updated time at the beginning of this agreement.
      You are required to review the updates occasionally, as continuing to use Majorna means agreeing to the updated terms and conditions.
    </div>

    <strong className="m-t-m">Copyright</strong>
    <div>
      Permission is hereby granted, free of charge, to any person obtaining a copy
      of this software and associated documentation files (the "Software"), to deal
      in the Software without restriction, including without limitation the rights
      to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
      copies of the Software, and to permit persons to whom the Software is
      furnished to do so, subject to the following conditions:

      The above copyright notice and this permission notice shall be included in all
      copies or substantial portions of the Software.

      THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
      IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
      FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
      AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
      LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
      OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
      SOFTWARE.
    </div>

    <div className="flex-row center-h m-t-l">
      <button className="button m-t-l" onClick={props.history.goBack}>Back</button>
    </div>
  </div>
