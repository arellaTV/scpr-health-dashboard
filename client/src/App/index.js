import React from 'react';
import ChartElement from './ChartElement';
import SpreadsheetInput from './SpreadsheetInput';
import shortid from 'shortid';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      columns: [],
      dataSourceUrl: 'https://docs.google.com/spreadsheets/d/1I9KFzjL6pIraJJScjNyCODlMDSXihpbr9XGzDqWdVuo/',
    }

    this.googleQuery = this.googleQuery.bind(this);
    this.getColumns = this.getColumns.bind(this);
    this.ingestSpreadsheet = this.ingestSpreadsheet.bind(this);
  }

  componentDidMount() {
    this.ingestSpreadsheet(this.state.dataSourceUrl);
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

  getColumns(response) {
    const table = response.getDataTable();
    const columns = [];
    for (let i = 1; i < table.getNumberOfColumns(); i++) {
      columns.push({
        label: table.getColumnLabel(i),
        id: table.getColumnId(i)
      });
    }
    this.setState({ columns, dataSourceUrl: this.state.dataSourceUrl });
  }

  renderColumns() {
    return this.state.columns.map((column, index) => {
      return (
        <ChartElement key={shortid.generate()}
                      id={column.id}
                      label={column.label}
                      dataSourceUrl={this.state.dataSourceUrl}
                      googleQuery={this.googleQuery}/>
      )
    })
  }

  render() {
    return (
      <div>
        <SpreadsheetInput ingestSpreadsheet={this.ingestSpreadsheet}/>
        <div className='grid-container'>
          {this.renderColumns()}
        </div>
      </div>
    )
  }
}

export default App;


