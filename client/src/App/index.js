import React from 'react';
import shortid from 'shortid';
import ChartList from './ChartList';
import NavigationBar from './NavigationBar';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      columns: [],
      signedIn: false,
      ingestStatus: '',
      dataSourceUrl: '',
    };

    this.getColumns = this.getColumns.bind(this);
    this.googleQuery = this.googleQuery.bind(this);
    this.ingestSpreadsheet = this.ingestSpreadsheet.bind(this);
    this.updateAccessToken = this.updateAccessToken.bind(this);
    this.updateAuthenticationStatus = this.updateAuthenticationStatus.bind(this);
  }

  componentDidMount() {
    this.checkPropsForSheetId(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.checkPropsForSheetId(nextProps);
  }

  getColumns(response) {
    // If there is an error, store its message and empty columns
    if (response.isError()) {
      this.setState({ columns: [], ingestStatus: response.getDetailedMessage() });
      return;
    }

    // Build a list of charts
    const table = response.getDataTable();
    const columns = [];
    for (let i = 1; i < table.getNumberOfColumns(); i += 1) {
      const currentColumnLabel = table.getColumnLabel(i);
      if (currentColumnLabel !== '') {
        columns.push({
          label: table.getColumnLabel(i),
          id: table.getColumnId(i),
        });
      }
    }

    // Build chartElements by updating the columns state
    this.setState({ columns, dataSourceUrl: this.state.dataSourceUrl });
  }

  checkPropsForSheetId(props) {
    const sheetId = props.match.params.sheetId;
    if (sheetId) {
      const queryUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;
      this.ingestSpreadsheet(queryUrl);
    }
  }

  ingestSpreadsheet(spreadsheetUrl) {
    this.googleQuery('SELECT * order by A', spreadsheetUrl, this.getColumns);
  }

  googleQuery(queryString, spreadsheetUrl, callback) {
    const encodedString = encodeURIComponent(queryString);
    const suffix = '/gviz/tq?gid=0&headers=1&tq=';
    const accessToken = `&access_token=${this.state.accessToken}`;
    const queryUrl = spreadsheetUrl + suffix + encodedString + accessToken;
    const query = new google.visualization.Query(queryUrl);
    this.state.dataSourceUrl = spreadsheetUrl;
    query.send(callback);
  }

  updateAccessToken(accessToken) {
    this.setState({ accessToken, columns: [] });
    if (this.state.dataSourceUrl) {
      this.ingestSpreadsheet(this.state.dataSourceUrl);
    }
  }

  updateAuthenticationStatus(authenticationResponse) {
    const signedIn = authenticationResponse.signedIn;
    this.setState({ signedIn });
  }

  render() {
    let columns;
    this.state.signedIn ? columns = this.state.columns : columns = [];
    return (
      <div>
        <NavigationBar
          signedIn={this.state.signedIn}
          history={this.props.history}
          updateAccessToken={this.updateAccessToken}
          updateAuthenticationStatus={this.updateAuthenticationStatus}
        />
        <span>{this.state.ingestStatus}</span>
        <ChartList
          columns={columns}
          dataSourceUrl={this.state.dataSourceUrl}
          googleQuery={this.googleQuery}
        />
      </div>
    );
  }
}

App.propTypes = {
  history: React.PropTypes.shape({ push: React.PropTypes.func }).isRequired,
};

export default App;
