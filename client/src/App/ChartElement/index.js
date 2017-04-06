import React from 'react';
import Chart from 'chart.js';

class ChartElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataArray: [],
      labelArray: [],
      type: 'bar',
      startAtIndexZero: false,
      startDate: '',
      endDate: '',
      dateRangeModified: false,
    };

    this.getChartData = this.getChartData.bind(this);
    this.buildChart = this.buildChart.bind(this);
    this.captureElement = this.captureElement.bind(this);
    this.changeIndex = this.changeIndex.bind(this);
    this.changeType = this.changeType.bind(this);
    this.changeDateRange = this.changeDateRange.bind(this);
    this.updateChart = this.updateChart.bind(this);
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

    if (this.currentChart) {
      this.updateChart(dataArray, labelArray);
    } else {
      this.buildChart('bar');
    }
  }

  buildChart(type) {
    if (this.currentChart) {
      this.currentChart.destroy();
    }

    this.currentChart = new Chart(this.context, {
      type,
      data: {
        labels: this.state.labelArray,
        datasets: [{
          label: this.props.label,
          data: this.state.dataArray,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
        }],
      },
      options: {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: this.state.startAtIndexZero,
            },
          }],
        },
      },
    });
  }

  updateChart(dataArray, labelArray) {
    this.currentChart.data.labels = labelArray;
    this.currentChart.data.datasets[0].data = dataArray;
    this.currentChart.update();
  }

  changeIndex() {
    const options = this.currentChart.config.options;
    const yAxis = options.scales.yAxes[0];
    if (this.state.startAtIndexZero) {
      yAxis.ticks.beginAtZero = false;
      this.setState({
        startAtIndexZero: false,
      });
    } else {
      yAxis.ticks.beginAtZero = true;
      this.setState({
        startAtIndexZero: true,
      });
    }
    this.currentChart.update();
  }

  changeType() {
    if (this.state.type === 'bar') {
      this.buildChart('line');
      this.setState({ type: 'line' });
    } else {
      this.buildChart('bar');
      this.setState({ type: 'bar' });
    }
  }

  changeDateRange() {
    if (this.state.dateRangeModified) {
      const query = `select A, ${this.props.id} order by A`;
      this.props.googleQuery(query, this.props.dataSourceUrl, this.getChartData);
      this.setState({ dateRangeModified: false, startDate: '', endDate: '' });
      return;
    }

    if (this.state.startDate && this.state.endDate) {
      const startDate = new Date(this.state.startDate).toISOString().slice(0, 10);
      const endDate = new Date(this.state.endDate).toISOString().slice(0, 10);
      const query = `select A, ${this.props.id} where date '${startDate}' <= A and date '${endDate}' >= A order by A`;
      this.props.googleQuery(query, this.props.dataSourceUrl, this.getChartData);
      this.setState({ dateRangeModified: true });
    }
  }

  captureElement(event) {
    const activePoint = this.currentChart.getElementAtEvent(event)[0];
    if (activePoint) {
      if (!this.state.startDate) {
        this.setState({ startDate: activePoint._model.label });
      }

      if (this.state.startDate && !this.state.endDate) {
        this.setState({ endDate: activePoint._model.label });
      }
    }
  }

  render() {
    return (
      <div className="chart box-shadow">
        <canvas
          onClick={this.captureElement}
          ref={(elem) => { this.context = elem; }}
          width="400"
          height="300"
        />
        <button onClick={this.changeIndex}>Zoom</button>
        <button onClick={this.changeType}>Type</button>
        <button onClick={this.changeDateRange}>Date</button>
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
