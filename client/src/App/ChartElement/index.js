import React from 'react';
import Chart from 'chart.js';

class ChartElement extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const columnLabel = this.props.columnLabel;
    const chartData = this.props.chart;
    const dataLabel = this.props.dataLabel.map(date => {
      var monthNames = [
        "January", "February", "March", "April", "May", "June", "July",
        "August", "September", "October", "November", "December"
      ];
      var month = monthNames[date.getMonth()];
      return `${month} ${date.getFullYear()}`;
    });
    const context = document.getElementById(this.props.index);
    const myChart = new Chart(context, {
      type: 'bar',
      data: {
        labels: dataLabel,
        datasets: [{
            label: columnLabel,
            data: chartData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
          }],
        options: {
          responsive: true,
          title: {
            display: true,
            text: columnLabel,
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