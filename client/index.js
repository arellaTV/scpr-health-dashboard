import React from 'react';
import { render } from 'react-dom';
import App from './src/App';

google.charts.load('current', { 'packages': ['corechart']});
google.charts.setOnLoadCallback(() => {
  render(<App />, document.getElementById('app'));
});
