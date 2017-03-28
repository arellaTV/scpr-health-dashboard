import React from 'react';
import ChartElement from './ChartElement';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      charts: []
    }
  }

  componentDidMount() {
    this.getCharts();
  }

  getCharts() {
    fetch('/charts')
      .then(response => response.json())
      .then(charts=> this.setState({ charts }))
  }

  render() {
    return (
      <div>
        <h1>SCPR Health Metrics Dashboard</h1>
        <div className="grid-container">
        {this.state.charts.map((chart, index) => {
          return (
            <ChartElement key={chart.title} context={index} chart={chart}/>
          )
        })}
        </div>
      </div>
    )
  }
}

export default App;