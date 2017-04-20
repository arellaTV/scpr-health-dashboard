import React from 'react';
import validateInput from './actions';

class SpreadsheetInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = { currentUrl: '' };
  }

  handleSubmit(event) {
    event.preventDefault();
    const url = event.target[0].value;
    if (validateInput(url)) {
      const parser = document.createElement('a');
      parser.href = url;
      if (parser.host === 'docs.google.com') {
        const sheetId = parser.pathname.slice(1).split('/')[2];
        const queryUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;
        this.props.history.push(`/${sheetId}`);
      }
    }
  }

  render() {
    let form = null;
    if (this.props.signedIn) {
      form = (<form onSubmit={this.handleSubmit}>
        <span className="spreadsheet-input__label">Google Sheets URL: </span>
        <input id="spreadsheet-input__url" type="url" />
      </form>);
    }
    return form;
  }
}

SpreadsheetInput.propTypes = {
  signedIn: React.PropTypes.bool.isRequired,
  history: React.PropTypes.shape({ push: React.PropTypes.func }).isRequired,
};

export default SpreadsheetInput;
