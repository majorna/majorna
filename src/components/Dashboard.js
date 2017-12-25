import React, { Component } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

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
      <React.Fragment>
        <div className="mj-box">
          <div className="is-size-4 has-text-centered">mj vs $</div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={this.data}>
              <XAxis dataKey="t"/>
              <YAxis orientation="right"/>
              <Tooltip/>
              <Area type='monotone' dataKey='mj' stroke='DarkOrange' fill='Wheat'/>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="mj-box">
          Balance: 500mj (~5$)
        </div>
      </React.Fragment>
    );
  }
}