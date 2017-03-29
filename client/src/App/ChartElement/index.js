import React from 'react';
import Chart from 'chart.js';

class ChartElement extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const tableLabels = this.props.tableLabels.slice(1).map(column => column.label);
    const currentChart = this.props.chart.slice(1);
    const chartLabel = this.props.chart[0].v;
    const chartData = currentChart.map(datapoint => {
      if (datapoint === null) {
        return null
      }
      return datapoint.v;
    });
    const context = document.getElementById(this.props.index);

    const myChart = new Chart(context, {
      type: 'line',
      data: {
        labels: tableLabels,
        datasets: [{
            label: chartLabel,
            data: chartData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
          }],
        options: {
          responsive: true,
          title: {
            display: true,
            text: chartLabel,
          }
        }
      }
    })
  }

  render() {
    return (
      <div className='square'>
        <canvas id={this.props.index} width='400' height='300'></canvas>
      </div>
    )
  }
}

export default ChartElement;