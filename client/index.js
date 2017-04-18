import React from 'react';
import Chart from 'chart.js';
import { render } from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import App from './src/App';

Chart.defaults.global.legend.display = false;

google.charts.load('current', { packages: ['corechart'] });
google.charts.setOnLoadCallback(() => {
  render(<Router>
    <Switch>
      <Route path="/:sheetId" component={App} />
      <Route path="/" component={App} />
    </Switch>
  </Router>, document.getElementById('app'));
});
