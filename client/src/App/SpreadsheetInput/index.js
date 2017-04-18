import React from 'react';
import validateInput from './actions';

class SpreadsheetInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
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
        this.props.ingestSpreadsheet(queryUrl);
      }
    }
  }

  render() {
    let form = null;
    if (this.props.signedIn) {
      form = <form onSubmit={this.handleSubmit}><input type="url" /></form>;
    }
    return form;
  }
}

SpreadsheetInput.propTypes = {
  ingestSpreadsheet: React.PropTypes.func.isRequired,
  signedIn: React.PropTypes.bool.isRequired,
};

export default SpreadsheetInput;
