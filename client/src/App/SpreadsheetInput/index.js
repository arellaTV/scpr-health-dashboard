import React from 'react';

class SpreadsheetInput extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const url = event.target[0].value;
    const parser = document.createElement('a');
    parser.href = url;
    const sheetId = parser.pathname.slice(1).split('/')[2];
    const queryUrl = `https://docs.google.com/spreadsheets/d/${sheetId}`;
    this.props.ingestSpreadsheet(queryUrl);
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
  ingestSpreadsheet: React.PropTypes.function.isRequired,
};

export default SpreadsheetInput;
