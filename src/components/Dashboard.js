import React, { Component } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export default class Dashboard extends Component {
  data = [
    {t: 'Dec 15', mj: 0},
    {t: 'Dec 16', mj: 1},
    {t: 'Dec 17', mj: 4},
    {t: 'Dec 18', mj: 5},
    {t: 'Dec 19', mj: 4},
    {t: 'Dec 20', mj: 5},
    {t: 'Dec 21', mj: 5},
  ];

  render() {
    return (
      <div className="has-text-centered">
        <AreaChart width={600} height={400} data={this.data}>
          <XAxis dataKey="t"/>
          <YAxis/>
          <Tooltip/>
          <Area type='monotone' dataKey='mj' stroke='DarkOrange' fill='Wheat'/>
        </AreaChart>

        mj vs $ (0.01) <br/>
        Balance: 500mj (~5$)
      </div>
    );
  }
}