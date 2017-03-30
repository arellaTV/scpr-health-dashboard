import React from 'react';
import ChartElement from './ChartElement';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      columns: [],
      dataSourceUrl: 'https://docs.google.com/spreadsheets/d/1I9KFzjL6pIraJJScjNyCODlMDSXihpbr9XGzDqWdVuo/gviz/tq?gid=0&headers=1&tq=',
    }

    this.googleQuery = this.googleQuery.bind(this);
    this.getColumns = this.getColumns.bind(this)
  }

  componentDidMount() {
    this.ingestSpreadsheet(this.state.dataSourceUrl);
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
    for (let i = 1; i < table.getNumberOfColumns(); i++) {
      columns.push({
        label: table.getColumnLabel(i),
        id: table.getColumnId(i)
      });
    }
    this.setState({ columns });
  }

  renderColumns() {
    return this.state.columns.map((column, index) => {
      return (
        <ChartElement key={column.id}
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
        <div className="grid-container">
        {this.renderColumns()}
        </div>
      </div>
    )
  }
}

export default App;


