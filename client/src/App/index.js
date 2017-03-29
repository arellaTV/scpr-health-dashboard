import React from 'react';
import ChartElement from './ChartElement';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      charts: [],
      columnLabels: []
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
    const queryString = encodeURIComponent('SELECT * order by A');
    const query = new google.visualization.Query(DATA_SOURCE_URL + queryString);
    query.send((response) => {
      const table = response.getDataTable();
      this.buildColumnArrays(table);
    });
  }

  buildColumnArrays(table) {
    const numberOfColumns = table.getNumberOfColumns();
    const numberOfRows = table.getNumberOfRows();
    const chartsArray = [];
    const columnLabelArray = [];
    for (let i = 0; i < numberOfColumns; i++) {
      columnLabelArray.push(table.getColumnLabel(i));
      chartsArray.push([]);
      for (let j = 0; j < numberOfRows; j++) {
        chartsArray[i].push(table.getValue(j, i));
      }
    }
    this.setState({
      charts: chartsArray,
      columnLabels: columnLabelArray,
    })
  }

  render() {
    return (
      <div>
        <h1>SCPR Health Metrics Dashboard</h1>
        <div className="grid-container">
        {this.state.charts.slice(1).map((chart, index) => {
          return (
            <ChartElement columnLabel={this.state.columnLabels[index]}
              chart={chart}
              index={index}
              key={index}
              dataLabel={this.state.charts[0]}
            />
          )
        })}
        </div>
      </div>
    )
  }
}

export default App;


