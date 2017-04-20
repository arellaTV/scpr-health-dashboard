import React from 'react';
import Chart from 'chart.js';
import { customTooltips, getAdjacentLetter, buildConfiguration } from './actions';

class ChartElement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      startAtIndexZero: true,
      type: 'bar',
      zoomIcon: 'zoom-in',
      typeIcon: 'bar-chart',
    };

    this.getChartData = this.getChartData.bind(this);
    this.buildChart = this.buildChart.bind(this);
    this.changeIndex = this.changeIndex.bind(this);
    this.changeType = this.changeType.bind(this);
  }

  componentDidMount() {
    const query = `select A, ${this.props.id}, ${getAdjacentLetter(this.props.id)} order by A`;
    this.props.googleQuery(query, this.props.dataSourceUrl, this.getChartData);
  }

  getChartData(response) {
    if (response.isError()) { return; }
    const table = response.getDataTable();
    const dataTable = JSON.parse(table.toJSON());
    this.setState({ dataTable });
    this.buildChart('bar');
  }

  buildChart(type) {
    if (this.currentChart) { this.currentChart.destroy(); }
    const dataTable = this.state.dataTable;
    const startAtIndexZero = this.state.startAtIndexZero;
    const chartConfiguration = buildConfiguration(dataTable, type, startAtIndexZero);
    this.currentChart = new Chart(this.context, chartConfiguration);
  }

  changeIndex() {
    const yAxis = this.currentChart.config.options.scales.yAxes[0];
    if (this.state.startAtIndexZero) {
      yAxis.ticks.beginAtZero = false;
      this.setState({ startAtIndexZero: false, zoomIcon: 'zoom-out' });
    } else {
      yAxis.ticks.beginAtZero = true;
      this.setState({ startAtIndexZero: true, zoomIcon: 'zoom-in' });
    }
    this.currentChart.update();
  }

  changeType() {
    if (this.state.type === 'bar') {
      this.buildChart('line');
      this.setState({ type: 'line', typeIcon: 'line-chart' });
    } else {
      this.buildChart('bar');
      this.setState({ type: 'bar', typeIcon: 'bar-chart' });
    }
  }

  render() {
    return (
      <div className="chart-element box-shadow">
        <h4>{this.props.label}</h4>
        <button className="chart-element__button" onClick={this.changeIndex}>
          <img title="Zoom" alt="Zoom" src={`/assets/icons/${this.state.zoomIcon}.svg`} />
        </button>
        <button className="chart-element__button" onClick={this.changeType}>
          <img title="Change type" alt="Type" src={`/assets/icons/${this.state.typeIcon}.svg`} />
        </button>
        <canvas ref={(elem) => { this.context = elem; }} width="400" height="300" />
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
