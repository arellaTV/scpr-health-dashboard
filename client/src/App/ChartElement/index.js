import React from 'react';
import Chart from 'chart.js';

class ChartElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: [],
      labelArray: [],
      type: 'bar',
    };

    this.getChartData = this.getChartData.bind(this);
    this.buildChart = this.buildChart.bind(this);
  }

  componentDidMount() {
    const query = `select A, ${this.props.id} order by A`;
    this.props.googleQuery(query, this.props.dataSourceUrl, this.getChartData);
  }

  getChartData(response) {
    const table = response.getDataTable();
    const tableJSON = JSON.parse(table.toJSON());
    const dataArray = tableJSON.rows.map(datapoint => datapoint.c[1].v);
    const labelArray = tableJSON.rows.map(datapoint => datapoint.c[0].f);
    this.setState({ dataArray, labelArray });

    if (this.state.currentChart) {
      this.state.currentChart.update();
    } else {
      this.buildChart();
    }
  }

  buildChart() {
    this.currentChart = new Chart(this.context, {
      type: this.state.type,
      data: {
        labels: this.state.labelArray,
        datasets: [{
          label: this.props.label,
          data: this.state.dataArray,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
        }],
        options: {
          responsive: true,
        },
      },
    });
  }

  render() {
    return (
      <div className="square">
        <canvas
          ref={(elem) => { this.context = elem; }}
          width="400"
          height="300"
        />
      </div>
    );
  }
}

ChartElement.propTypes = {
  id: React.PropTypes.string.isRequired,
  label: React.PropTypes.string.isRequired,
  dataSourceUrl: React.PropTypes.string.isRequired,
  googleQuery: React.PropTypes.func.isRequired,
};

export default ChartElement;
