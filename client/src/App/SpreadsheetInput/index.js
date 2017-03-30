import React from 'react';

class SpreadsheetInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const url = event.target[0].value;
    if (this.validateInput(url)) {
      const parser = document.createElement('a');
      parser.href = url;
      if (parser.host === 'docs.google.com') {
        const sheetId = parser.pathname.slice(1).split('/')[2];
        const queryUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;
        this.props.ingestSpreadsheet(queryUrl);
      }
    }
  }

  validateInput(input) {
    const expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

    if (input.match(regex)) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="url" />
      </form>
    );
  }
}

SpreadsheetInput.propTypes = {
  ingestSpreadsheet: React.PropTypes.func.isRequired,
};

export default SpreadsheetInput;
