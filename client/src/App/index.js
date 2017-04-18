import React from 'react';
import shortid from 'shortid';
import ChartElement from './ChartElement';
import SpreadsheetInput from './SpreadsheetInput';
import Authentication from './Authentication';
import ShareButton from './ShareButton';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      columns: [],
      signedIn: false,
    };

    this.googleQuery = this.googleQuery.bind(this);
    this.getColumns = this.getColumns.bind(this);
    this.ingestSpreadsheet = this.ingestSpreadsheet.bind(this);
    this.updateAccessToken = this.updateAccessToken.bind(this);
    this.updateAuthenticationStatus = this.updateAuthenticationStatus.bind(this);
  }

  componentDidMount() {
    const sheetId = this.props.match.params.sheetId;
    if (sheetId) {
      const queryUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;
      this.ingestSpreadsheet(queryUrl);
    }
  }

  componentWillReceiveProps(nextProps) {
    const sheetId = nextProps.match.params.sheetId;
    if (sheetId) {
      const queryUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;
      this.ingestSpreadsheet(queryUrl);
    }
  }

  getColumns(response) {
    if (response.isError()) {
      this.setState({
        ingestStatus: response.getDetailedMessage(),
        columns: [],
      });
    } else {
      this.setState({
        ingestStatus: response.getDetailedMessage(),
        columns: [],
      });
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
  }

  ingestSpreadsheet(spreadsheetUrl) {
    this.googleQuery('SELECT * order by A', spreadsheetUrl, this.getColumns);
  }

  googleQuery(queryString, spreadsheetUrl, callback) {
    this.state.dataSourceUrl = spreadsheetUrl;
    const encodedString = encodeURIComponent(queryString);
    const suffix = '/gviz/tq?gid=0&headers=1&tq=';
    const accessToken = `&access_token=${this.state.accessToken}`;
    const queryUrl = spreadsheetUrl + suffix + encodedString + accessToken;
    const query = new google.visualization.Query(queryUrl);
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
    let columns;
    this.state.signedIn ? columns = this.renderColumns() : columns = [];
    return (
      <div>
        <div className="navigation-bar">
          <SpreadsheetInput
            signedIn={this.state.signedIn}
            history={this.props.history}
          />
          <div className="navigation-bar--right">
            <ShareButton signedIn={this.state.signedIn} />
            <Authentication
              updateAccessToken={this.updateAccessToken}
              updateAuthenticationStatus={this.updateAuthenticationStatus}
              signedIn={this.state.signedIn}
            />
          </div>
        </div>
        <div className="navigation-bar__title box-shadow">
          <span className="navigation-bar__title-text">SCPR HEALTH DASHBOARD</span>
        </div>
        <span>{this.state.ingestStatus}</span>
        <div className="grid-container">
          {columns}
        </div>
      </div>
    );
  }
}

App.propTypes = {
  history: React.PropTypes.shape({ push: React.PropTypes.func }).isRequired,
};

export default App;
