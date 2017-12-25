import React, { Component } from 'react';

export default class Dashboard extends Component {
  constructor (props) {
    super(props);
    // this.getBalance()
  }

  getBalance = async () => {
    const doc = await this.props.db.collection("cities").doc(this.props.user.uid).get();
    console.log(doc.data())
  }

  render() {
    return (
      <div className="has-text-centered">
        mj vs $ (0.01) <br/>
        Balance: 500mj (~5$)
      </div>
    );
  }
}