import React from 'react';
import shortid from 'shortid';
import ChartElement from './ChartElement';

const ChartList = ({ columns, dataSourceUrl, googleQuery }) =>
  <div className="grid-container">
    {columns.map(column =>
      <ChartElement
        key={shortid.generate()}
        id={column.id}
        label={column.label}
        dataSourceUrl={dataSourceUrl}
        googleQuery={googleQuery}
      />,
    )}
  </div>;

ChartList.propTypes = {
  columns: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  dataSourceUrl: React.PropTypes.string.isRequired,
  googleQuery: React.PropTypes.func.isRequired,
};

export default ChartList;
