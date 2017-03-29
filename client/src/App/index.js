import React from 'react';
import ChartElement from './ChartElement';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      charts: {
        rows: []
      }
    }
  }

  componentDidMount() {
    this.ingestSpreadsheet();
  }

  getCharts() {
    fetch('/charts')
      .then(response => response.json())
      .then(charts=> this.setState({ charts }))
  }

  ingestSpreadsheet() {
    const DATA_SOURCE_URL = 'https://docs.google.com/spreadsheets/d/1I9KFzjL6pIraJJScjNyCODlMDSXihpbr9XGzDqWdVuo/gviz/tq?gid=0&headers=1&tq=';
    const queryString = encodeURIComponent('SELECT *');
    const query = new google.visualization.Query(DATA_SOURCE_URL + queryString);
    query.send((response) => {
      const table = response.getDataTable().toJSON();
      const charts = JSON.parse(table);
      console.log(charts);
      this.setState({ charts });
    });
  }

  render() {
    return (
      <div>
        <h1>SCPR Health Metrics Dashboard</h1>
        <div className="grid-container">
        {this.state.charts.rows.map((chart, index) => {
          return (
            <ChartElement tableLabels={this.state.charts.cols}
                          chart={chart.c}
                          index={index}
                          key={index}/>
          )
        })}
        </div>
      </div>
    )
  }
}

export default App;