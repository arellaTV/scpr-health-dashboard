import React from 'react';
import Chart from 'chart.js';

class ChartElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: [],
      labelArray: []
    }

    this.getChartData = this.getChartData.bind(this);
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
    this.buildChart();
  }

  buildChart() {
    const context = document.getElementById(this.props.id);
    const myChart = new Chart(context, {
      type: 'bar',
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
          title: {
            display: true,
            text: this.props.label,
          }
        }
      }
    })
  }

  render() {
    return (
      <div className='square'>
        <canvas id={this.props.id} width='400' height='300'></canvas>
      </div>
    )
  }
}

export default ChartElement;