import React from 'react';
import shortid from 'shortid';
import ChartElement from './ChartElement';
import SpreadsheetInput from './SpreadsheetInput';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      columns: [],
    }

    this.googleQuery = this.googleQuery.bind(this);
    this.getColumns = this.getColumns.bind(this);
    this.ingestSpreadsheet = this.ingestSpreadsheet.bind(this);
  }

  ingestSpreadsheet(spreadsheetUrl) {
    this.googleQuery("SELECT * order by A", spreadsheetUrl, this.getColumns)
  }

  googleQuery(string, spreadsheetUrl, callback) {
    const queryString = encodeURIComponent(string);
    const query = new google.visualization.Query(spreadsheetUrl + queryString);
    query.send(callback);
  }

  getColumns(response) {
    const table = response.getDataTable();
    const columns = [];
    for (let i = 1; i < table.getNumberOfColumns(); i += 1) {
      columns.push({
        label: table.getColumnLabel(i),
        id: table.getColumnId(i),
      });
    }
    this.setState({ columns, dataSourceUrl: this.state.dataSourceUrl });
  }

  ingestSpreadsheet(spreadsheetUrl) {
    this.googleQuery('SELECT * order by A', spreadsheetUrl, this.getColumns);
  }

  googleQuery(queryString, spreadsheetUrl, callback) {
    this.state.dataSourceUrl = spreadsheetUrl;
    const encodedString = encodeURIComponent(queryString);
    const suffix = '/gviz/tq?gid=0&headers=1&tq=';
    const queryUrl = spreadsheetUrl + suffix;
    const query = new google.visualization.Query(queryUrl + encodedString);
    query.send(callback);
  }

  renderColumns() {
    return this.state.columns.map(column =>
      <ChartElement
        key={shortid.generate()}
        id={column.id}
        label={column.label}
        dataSourceUrl={this.state.dataSourceUrl}
        googleQuery={this.googleQuery}
      />);
  }

  render() {
    return (
      <div>
        <SpreadsheetInput ingestSpreadsheet={this.ingestSpreadsheet} />
        <div className="grid-container">
          {this.renderColumns()}
        </div>
      </div>
    );
  }
}

export default App;
