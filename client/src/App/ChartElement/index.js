import React from 'react';
import Chart from 'chart.js';

class ChartElement extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const context = document.getElementById(this.props.context);
    const currentChart = this.props.chart;
    const myChart = new Chart(context, {
      type: currentChart.type,
      data: {
        labels: currentChart.labels,
        datasets: [{
            label: currentChart.title,
            data: currentChart.data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
          }],
        options: {
          responsive: true,
          title: {
            display: true,
            text: currentChart.title,
          }
        }
      }
    })
  }

  render() {
    return (
      <div className={this.props.chart.class}>
        <canvas id={this.props.context}
                width={this.props.chart.width}
                height={this.props.chart.height}>
        </canvas>
      </div>
    )
  }
}

export default ChartElement;